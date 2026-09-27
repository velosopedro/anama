import { useEffect, useMemo, useState } from "react";

import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { ApiError, apiRequest } from "../services/api";

import type {
  CatalogItem,
  CatalogResponse,
  CreateAidRequestResponse,
} from "../types/basket";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function RequestAidPage() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [catalog, setCatalog] = useState<CatalogItem[]>([]);

  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCatalog() {
      try {
        const response = await apiRequest<CatalogResponse>(
          "/baskets/catalog/items",
        );

        setCatalog(response.items);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError("Não foi possível carregar o catálogo.");
        }
      } finally {
        setLoading(false);
      }
    }

    void loadCatalog();
  }, []);

  const baseItems = useMemo(
    () => catalog.filter((item) => item.basico),
    [catalog],
  );

  const additionalItems = useMemo(
    () => catalog.filter((item) => !item.basico),
    [catalog],
  );

  const baseTotal = useMemo(
    () =>
      baseItems.reduce(
        (total, item) => total + item.valorMedio * item.quantidadePadrao,
        0,
      ),
    [baseItems],
  );

  const additionalTotal = useMemo(
    () =>
      additionalItems.reduce((total, item) => {
        const quantity = quantities[item.idItem] ?? 0;

        return total + item.valorMedio * quantity;
      }, 0),
    [additionalItems, quantities],
  );

  const estimatedTotal = baseTotal + additionalTotal;

  if (user?.tipo !== "FAMILIA") {
    return <Navigate to="/" replace />;
  }

  function changeQuantity(idItem: number, amount: number) {
    setQuantities((current) => {
      const currentValue = current[idItem] ?? 0;

      const newValue = Math.max(0, currentValue + amount);

      return {
        ...current,
        [idItem]: newValue,
      };
    });
  }

  async function handleSubmit() {
    setError("");
    setSubmitting(true);

    try {
      const itensAdicionais = additionalItems
        .map((item) => ({
          idItem: item.idItem,

          quantidade: quantities[item.idItem] ?? 0,
        }))
        .filter((item) => item.quantidade > 0);

      const response = await apiRequest<CreateAidRequestResponse>(
        "/families/me/aid-requests",
        {
          method: "POST",

          body: {
            itensAdicionais,
          },
        },
      );

      navigate(`/baskets/${response.basket.idCesta}`);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Não foi possível criar a solicitação.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="page-section">
        <div className="feedback-card">Carregando cesta padrão...</div>
      </section>
    );
  }

  return (
    <section className="request-aid-page">
      <Link to="/" className="back-link">
        ← Voltar
      </Link>

      <div className="request-header">
        <span className="eyebrow">Solicitação de auxílio</span>

        <h1>Monte sua cesta</h1>

        <p>
          A cesta básica já vem preparada com os itens essenciais. Você pode
          adicionar outros alimentos disponíveis no catálogo.
        </p>
      </div>

      {error && (
        <div className="feedback-card error request-error">{error}</div>
      )}

      <section className="request-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Cesta padrão</span>

            <h2>Itens incluídos</h2>
          </div>

          <strong className="section-total">{formatCurrency(baseTotal)}</strong>
        </div>

        <div className="request-items-grid">
          {baseItems.map((item) => (
            <article key={item.idItem} className="request-item-card base">
              <div>
                <span className="request-item-category">{item.categoria}</span>

                <h3>{item.nome}</h3>
              </div>

              <div className="request-item-footer">
                <span>
                  {item.quantidadePadrao} unidade
                  {item.quantidadePadrao !== 1 ? "s" : ""}
                </span>

                <strong>
                  {formatCurrency(item.valorMedio * item.quantidadePadrao)}
                </strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="request-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Opcional</span>

            <h2>Itens adicionais</h2>
          </div>

          <strong className="section-total">
            {formatCurrency(additionalTotal)}
          </strong>
        </div>

        <p className="section-description">
          Selecione somente os itens que sua família necessita além da cesta
          padrão.
        </p>

        <div className="additional-items-list">
          {additionalItems.map((item) => {
            const quantity = quantities[item.idItem] ?? 0;

            return (
              <article
                key={item.idItem}
                className={
                  quantity > 0 ? "additional-item selected" : "additional-item"
                }
              >
                <div className="additional-item-info">
                  <span>{item.categoria}</span>

                  <strong>{item.nome}</strong>

                  <small>{formatCurrency(item.valorMedio)} por unidade</small>
                </div>

                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => changeQuantity(item.idItem, -1)}
                    disabled={quantity === 0}
                    aria-label={`Remover ${item.nome}`}
                  >
                    −
                  </button>

                  <strong>{quantity}</strong>

                  <button
                    type="button"
                    onClick={() => changeQuantity(item.idItem, 1)}
                    aria-label={`Adicionar ${item.nome}`}
                  >
                    +
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <aside className="request-summary">
        <div>
          <span>Cesta padrão</span>

          <strong>{formatCurrency(baseTotal)}</strong>
        </div>

        <div>
          <span>Adicionais</span>

          <strong>{formatCurrency(additionalTotal)}</strong>
        </div>

        <div className="request-total">
          <span>Valor estimado</span>

          <strong>{formatCurrency(estimatedTotal)}</strong>
        </div>

        <button
          type="button"
          className="primary-button request-submit"
          disabled={submitting}
          onClick={() => void handleSubmit()}
        >
          {submitting ? "Criando solicitação..." : "Confirmar solicitação"}
        </button>

        <small>
          Os valores são estimativas calculadas a partir dos valores médios
          cadastrados na plataforma.
        </small>
      </aside>
    </section>
  );
}

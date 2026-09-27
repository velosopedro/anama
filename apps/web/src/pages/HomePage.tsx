import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { BasketCard } from "../components/baskets/BasketCard";
import { useAuth } from "../contexts/AuthContext";

import { ApiError, apiRequest } from "../services/api";

import type { Basket, BasketListResponse } from "../types/basket";

export function HomePage() {
  const { user } = useAuth();

  const [baskets, setBaskets] = useState<Basket[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBaskets() {
      try {
        const response = await apiRequest<BasketListResponse>("/baskets");

        setBaskets(response.baskets);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError("Não foi possível carregar as cestas.");
        }
      } finally {
        setLoading(false);
      }
    }

    void loadBaskets();
  }, []);

  return (
    <section className="home-page">
      <div className="home-hero">
        <div>
          <span className="eyebrow">ANAMÃ</span>

          <h1>Olá, {user?.nome}</h1>

          <p>
            {user?.tipo === "DOADOR"
              ? "Escolha uma cesta e acompanhe as necessidades das famílias."
              : user?.tipo === "FAMILIA"
                ? "Acompanhe as cestas disponíveis e sua solicitação de auxílio."
                : user?.tipo === "ONG"
                  ? "Acompanhe as cestas que estão sendo montadas."
                  : "Acompanhe as atividades da plataforma."}
          </p>
        </div>

        {user?.tipo === "FAMILIA" && (
          <Link to="/request-aid" className="primary-link">
            Solicitar auxílio
          </Link>
        )}
      </div>

      {user?.tipo === "ONG" && user.ong && (
        <div
          className={
            user.ong.statusVerificacao === "APROVADA"
              ? "organization-status approved"
              : "organization-status pending"
          }
        >
          <strong>Status da ONG:</strong>

          <span>{user.ong.statusVerificacao}</span>
        </div>
      )}

      <div className="section-heading">
        <div>
          <span className="eyebrow">Cestas</span>

          <h2>Em montagem</h2>
        </div>

        {!loading && (
          <span className="result-count">
            {baskets.length} encontrada
            {baskets.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {loading && <div className="feedback-card">Carregando cestas...</div>}

      {error && <div className="feedback-card error">{error}</div>}

      {!loading && !error && baskets.length === 0 && (
        <div className="empty-state">
          <h3>Nenhuma cesta em montagem</h3>

          <p>Ainda não existem solicitações disponíveis neste momento.</p>

          {user?.tipo === "FAMILIA" && (
            <Link to="/request-aid" className="primary-link">
              Solicitar auxílio
            </Link>
          )}
        </div>
      )}

      {!loading && !error && baskets.length > 0 && (
        <div className="basket-grid">
          {baskets.map((basket) => (
            <BasketCard key={basket.idCesta} basket={basket} />
          ))}
        </div>
      )}
    </section>
  );
}

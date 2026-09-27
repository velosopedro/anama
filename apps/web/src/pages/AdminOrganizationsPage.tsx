import { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { ApiError, apiRequest } from "../services/api";

import type {
  OrganizationResponse,
  PendingOrganization,
  PendingOrganizationsResponse,
} from "../types/organization";

export function AdminOrganizationsPage() {
  const { user } = useAuth();

  const [organizations, setOrganizations] = useState<PendingOrganization[]>([]);

  const [loading, setLoading] = useState(true);

  const [processingId, setProcessingId] = useState<number | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrganizations() {
      try {
        const response = await apiRequest<PendingOrganizationsResponse>(
          "/admin/organizations/pending",
        );

        setOrganizations(response.organizations);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError("Não foi possível carregar as ONGs pendentes.");
        }
      } finally {
        setLoading(false);
      }
    }

    if (user?.tipo === "ADMIN") {
      void loadOrganizations();
    }
  }, [user]);

  if (user?.tipo !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  async function updateOrganization(
    idOng: number,
    action: "approve" | "reject",
  ) {
    setError("");
    setProcessingId(idOng);

    try {
      await apiRequest<OrganizationResponse>(
        `/admin/organizations/${idOng}/${action}`,
        {
          method: "PATCH",
        },
      );

      setOrganizations((current) =>
        current.filter((organization) => organization.idOng !== idOng),
      );
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Não foi possível atualizar a ONG.");
      }
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <span className="eyebrow">Administração</span>

          <h1>Homologação de ONGs</h1>

          <p>
            Analise as instituições cadastradas antes de liberar o acesso às
            funcionalidades operacionais.
          </p>
        </div>
      </div>

      {error && (
        <div className="feedback-card error admin-feedback">{error}</div>
      )}

      {loading && (
        <div className="feedback-card">Carregando ONGs pendentes...</div>
      )}

      {!loading && organizations.length === 0 && (
        <div className="empty-state">
          <h3>Nenhuma ONG pendente</h3>

          <p>Todas as instituições cadastradas já foram analisadas.</p>
        </div>
      )}

      {!loading && organizations.length > 0 && (
        <div className="organization-list">
          {organizations.map((organization) => (
            <article key={organization.idOng} className="organization-card">
              <div className="organization-card-header">
                <div>
                  <span className="basket-label">
                    ONG #{organization.idOng}
                  </span>

                  <h2>{organization.nomeFantasia}</h2>
                </div>

                <span className="organization-pending-badge">Pendente</span>
              </div>

              <div className="organization-data-grid">
                <div>
                  <span>CNPJ</span>

                  <strong>{organization.cnpj}</strong>
                </div>

                <div>
                  <span>Responsável</span>

                  <strong>{organization.responsavel.nome}</strong>
                </div>

                <div>
                  <span>E-mail</span>

                  <strong>{organization.responsavel.email}</strong>
                </div>

                <div>
                  <span>Status da conta</span>

                  <strong>{organization.responsavel.status}</strong>
                </div>
              </div>

              <div className="organization-actions">
                <button
                  type="button"
                  className="reject-button"
                  disabled={processingId === organization.idOng}
                  onClick={() =>
                    void updateOrganization(organization.idOng, "reject")
                  }
                >
                  Rejeitar
                </button>

                <button
                  type="button"
                  className="approve-button"
                  disabled={processingId === organization.idOng}
                  onClick={() =>
                    void updateOrganization(organization.idOng, "approve")
                  }
                >
                  {processingId === organization.idOng
                    ? "Processando..."
                    : "Aprovar ONG"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

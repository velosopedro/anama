import { useAuth } from "../contexts/AuthContext";

export function HomePage() {
  const { user } = useAuth();

  return (
    <section className="page-section">
      <span className="eyebrow">ANAMÃ</span>

      <h1>Olá, {user?.nome}</h1>

      <p>Sua conta está conectada à API com sucesso.</p>

      <div className="status-card">
        <strong>Perfil</strong>

        <span>{user?.tipo}</span>
      </div>
    </section>
  );
}

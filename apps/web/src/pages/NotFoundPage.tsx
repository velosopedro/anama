import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="simple-page">
      <h1>Página não encontrada</h1>

      <Link to="/">Voltar ao início</Link>
    </main>
  );
}

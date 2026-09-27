import { Link, Outlet } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="brand" to="/">
          ANAMÃ
        </Link>

        <div className="header-user">
          <span>{user?.nome}</span>

          <button type="button" className="text-button" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>

      <nav className="bottom-navigation">
        <Link to="/">Início</Link>

        <Link to="/profile">Perfil</Link>
      </nav>
    </div>
  );
}

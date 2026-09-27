import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute() {
  const { signedIn, loading } = useAuth();

  if (loading) {
    return (
      <main className="loading-screen">
        <p>Carregando...</p>
      </main>
    );
  }

  if (!signedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

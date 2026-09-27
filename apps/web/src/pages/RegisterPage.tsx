import { type FormEvent, useState } from "react";

import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../services/api";

type RegisterRole = "DOADOR" | "FAMILIA" | "ONG";

export function RegisterPage() {
  const { register, signedIn } = useAuth();

  const navigate = useNavigate();

  const [tipo, setTipo] = useState<RegisterRole>("DOADOR");

  const [nome, setNome] = useState("");

  const [email, setEmail] = useState("");

  const [senha, setSenha] = useState("");

  const [numeroIntegrantes, setNumeroIntegrantes] = useState("1");

  const [nomeFantasia, setNomeFantasia] = useState("");

  const [cnpj, setCnpj] = useState("");

  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  if (signedIn) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      if (tipo === "DOADOR") {
        await register({
          tipo: "DOADOR",
          nome,
          email,
          senha,
        });
      }

      if (tipo === "FAMILIA") {
        await register({
          tipo: "FAMILIA",
          nome,
          email,
          senha,

          numeroIntegrantes: Number(numeroIntegrantes),
        });
      }

      if (tipo === "ONG") {
        await register({
          tipo: "ONG",
          nome,
          email,
          senha,
          nomeFantasia,
          cnpj,
        });
      }

      navigate("/");
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Não foi possível criar sua conta.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card register-card">
        <div className="brand-mark">ANAMÃ</div>

        <h1>Criar conta</h1>

        <p>Escolha como você deseja participar da plataforma.</p>

        <div className="role-selector">
          <button
            type="button"
            className={tipo === "DOADOR" ? "role-card active" : "role-card"}
            onClick={() => setTipo("DOADOR")}
          >
            <strong>Quero ajudar</strong>

            <span>Quero fazer doações.</span>
          </button>

          <button
            type="button"
            className={tipo === "FAMILIA" ? "role-card active" : "role-card"}
            onClick={() => setTipo("FAMILIA")}
          >
            <strong>Preciso de ajuda</strong>

            <span>Quero solicitar auxílio.</span>
          </button>

          <button
            type="button"
            className={tipo === "ONG" ? "role-card active" : "role-card"}
            onClick={() => setTipo("ONG")}
          >
            <strong>Sou uma instituição</strong>

            <span>Represento uma ONG.</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            {tipo === "ONG" ? "Nome do responsável" : "Nome"}

            <input
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              minLength={2}
              maxLength={100}
              required
            />
          </label>

          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={150}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              minLength={8}
              maxLength={72}
              required
            />
            <small>Use pelo menos 8 caracteres.</small>
          </label>

          {tipo === "FAMILIA" && (
            <label>
              Número de integrantes
              <input
                type="number"
                min="1"
                step="1"
                value={numeroIntegrantes}
                onChange={(event) => setNumeroIntegrantes(event.target.value)}
                required
              />
            </label>
          )}

          {tipo === "ONG" && (
            <>
              <label>
                Nome fantasia
                <input
                  type="text"
                  value={nomeFantasia}
                  onChange={(event) => setNomeFantasia(event.target.value)}
                  minLength={2}
                  maxLength={120}
                  required
                />
              </label>

              <label>
                CNPJ
                <input
                  type="text"
                  value={cnpj}
                  onChange={(event) => setCnpj(event.target.value)}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </label>

              <div className="info-box">
                O cadastro da ONG ficará pendente até ser analisado pelo
                administrador.
              </div>
            </>
          )}

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="auth-footer">
          Já possui uma conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}

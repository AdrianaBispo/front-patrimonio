import { useState } from "react";
import LoadingUI from "../../../../shared/components/LoadingUi";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import ErrorLabel from "../../../../shared/components/ErrorLabel";
import { toast } from "react-toastify";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login, error, isLoading, inputsErrors } = useLogin();
  const navigate = useNavigate();

  async function logar(e) {
    e.preventDefault();
    try {
      const result = await login({ email, password: senha });
      if (result) {
        navigate("/users");
      }
    } catch (e) {
      toast.error(error);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-bg-primary">
      <div className="flex min-h-full flex-col justify-center px-6 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="rounded-md bg-secondary p-2 ring-1 ring-white/10 text-white max-w-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
          </div>

          <h2 className="mt-10 text-2xl text-left font-bold tracking-tight text-text-primary">
            Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={logar} className="space-y-6">
            <div>
              <label htmlFor="user">Usuário</label>

              <div className="mt-2">
                <input
                  id="user"
                  type="email"
                  maxLength={20}
                  className="input-utilities"
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {inputsErrors?.email && (
                <ErrorLabel>{inputsErrors.email}</ErrorLabel>
              )}
            </div>

            <div>
              <label htmlFor="password">Senha</label>

              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  maxLength={20}
                  className="input-utilities"
                  placeholder="******"
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
              {inputsErrors?.password && (
                <ErrorLabel>{inputsErrors.password}</ErrorLabel>
              )}
            </div>

            <div className="text-sm text-right">
              <Link
                to="/auth/forgot-password"
                className="text-secondary hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>

            <div>
              <button
                type="submit"
                className="btn-primary w-full"
                onClick={logar}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-bg-primary border-t-transparent" />
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:block bg-cover bg-center bg-[url(https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png)]" />
    </div>
  );
}

export default LoginPage;

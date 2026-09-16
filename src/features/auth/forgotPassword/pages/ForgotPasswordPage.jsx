import { Link } from "react-router-dom";
import { useForgotPassword } from "../hooks/useForgotError";

function ForgotPasswordPage() {
  const { email, setEmail, errors, submitLoading, changePassword } = useForgotPassword();

async function handleSubmit(e) {
    e.preventDefault();
    await changePassword({ email });
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
              strokeWidth="1.5"
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
          <h2 className="mt-10 text-2xl text-left font-bold tracking-tight text-bold text-text-primary">
            Recuperar Senha
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="user">E-mail</label>
              <div className="mt-2">
                <input
                  id="user"
                  type="email"
                  maxLength={256}
                  className="input-utilities"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {errors?.email && (
                <span className="text-sm text-red-500 mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-bg-primary border-t-transparent" />
                  </div>
                ) : (
                  "Recuperar Acesso"
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                  />
                </svg>
                Voltar ao Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-[url(https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png)] hidden lg:block" />
    </div>
  );
}

export default ForgotPasswordPage;
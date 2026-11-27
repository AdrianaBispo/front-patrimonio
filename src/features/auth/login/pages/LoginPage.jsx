import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import ErrorLabel from "../../../../shared/components/ErrorLabel";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, inputsErrors } = useLogin();
  const navigate = useNavigate();
  const { t } = useTranslation();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const result = await login({ email, password });
      if (!result) return;
      navigate("/users");
    } catch (err) {
      toast.error(t(err?.message) ?? t("errors.authError"));
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-bg-primary lg:grid-cols-2">
      <div className="flex min-h-full flex-col justify-center px-6 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="max-w-10 rounded-md bg-secondary p-2 text-white ring-1 ring-white/10">
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

          <h2 className="mt-10 text-left text-2xl font-bold tracking-tight text-text-primary">
            {t("auth.login.title")}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="email">{t("auth.login.email")}</label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  maxLength={255}
                  className="input-utilities"
                  placeholder={t("auth.login.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {inputsErrors?.email && (
                <ErrorLabel>{t(inputsErrors.email)}</ErrorLabel>
              )}
            </div>

            <div>
              <label htmlFor="password">{t("auth.login.password")}</label>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  maxLength={255}
                  className="input-utilities"
                  placeholder={t("auth.login.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {inputsErrors?.password && (
                <ErrorLabel>{t(inputsErrors.password)}</ErrorLabel>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-bg-primary border-t-transparent" />
                  </div>
                ) : (
                  t("auth.login.submit")
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden bg-cover bg-center bg-[url(https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png)] lg:block" />
    </div>
  );
}

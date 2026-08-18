import { useEffect, useState } from "react";
import LoadingUI from "../../../shared/ui/LoadingUi";

function LoginPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const image = new Image();

    image.src =
      "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png";

    image.onload = () => {
      setLoading(false);
    };

    image.onerror = () => {
      setLoading(false);
    };
  }, []);

  if (loading) {
    return <LoadingUI/>
     
  }

  return (
    <div class="grid grid-cols-2 min-h-screen bg-bg-primary">
      <div class="flex min-h-full flex-col justify-center px-6 py-12">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <div class="rounded-md bg-secondary p-2 ring-1 ring-white/10 text-white max-w-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
          </div>
          <h2 class="mt-10 text-2xl text-left font-bold tracking-tight text-bold text-text-primary">
            Login
          </h2>
        </div>
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" class="space-y-6">
            <div>
              <label for="user">Usuário</label>
              <div class="mt-2">
                <input
                  id="user"
                  type="email"
                  max={20}
                  className="input-utilities"
                  placeholder="name@example.com"
                  required
                ></input>
              </div>
            </div>
            <div>
              <label for="password">Senha</label>
              <div class="mt-2">
                <input
                  id="password"
                  type="text"
                  maxLength={20}
                  className="input-utilities"
                  placeholder="******"
                />
              </div>
            </div>

            <div class="text-sm text-right">
              <a href="/forgot-password" class="text-secondary hover:underline">
                Esqueci minha senha
              </a>
            </div>

            <div>
              <button type="submit" className="btn-primary w-full">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="bg-[url(https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png)]"></div>
    </div>
  );
}

export default Login;

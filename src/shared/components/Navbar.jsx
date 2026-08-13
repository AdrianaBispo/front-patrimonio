export default function NavBar() {
  return (
    <nav>
      <header class="bg-primary-600 text-slate p-4 bg-bg-primary border-gray-200 border-b">
        <div class="flex items-center gap-3">
          <div class="flex w-8 h-8 items-center justify-center rounded-lg bg-primary text-white ring-1 ring-white/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
          </div>

          <h1 class="text-sm font-bold text-text-primary">
            Gestão de Inventário
          </h1>
        </div>
      </header>
    </nav>
  );
}

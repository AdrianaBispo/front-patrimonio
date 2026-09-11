import { useNavigate } from "react-router-dom";
import Cards from "../../../shared/components/Cards";

export default function EquipamentosListaPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9 flex justify-between">
        <h3 className=" text-primary/80 mb-2">Equipamentos</h3>
        <button
          class="flex justify-center gap-2 items-center rounded-md bg-primary px-8 py-1.5 text-sm/6 font-semibold text-white hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary/65"
          onClick={() => navigate("cadastrar")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="3"
            stroke="currentColor"
            class="size-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Adicionar
        </button>
      </div>

      <div className="flex justify-between gap-7 mb-9">
        <Cards
          title="Total de Clientes"
          value={50}
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200">
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
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
            </div>
          }
        />
        <Cards
          title="ACTIVE ON SHIFT"
          value={50}
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200">
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
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
            </div>
          }
        />
        <Cards
          title="ON LEAVE"
          value={50}
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
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
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
            </div>
          }
        />
      </div>

      {/* Table */}

      <div className="overflow-hidden  border-border rounded-2xl shadow-md">
        {/* Pesquisa */}

        <div className="bg-bg-secondary r-50 px-3 py-3">
          <div className="relative w-full max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>

            <input
              type="text"
              placeholder="Pesquisar item..."
              class="px-1.5"
              className="input-utilities w-full pl-10 pr-2 py-2 bg-bg-primary"
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center text-on-surface-variant transition-colors hover:text-secondary"
              title="Escanear código de barras"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#1f1f1f"
              >
                <path d="M40-120v-200h80v120h120v80H40Zm680 0v-80h120v-120h80v200H720ZM160-240v-480h80v480h-80Zm120 0v-480h40v480h-40Zm120 0v-480h80v480h-80Zm120 0v-480h120v480H520Zm160 0v-480h40v480h-40Zm80 0v-480h40v480h-40ZM40-640v-200h200v80H120v120H40Zm800 0v-120H720v-80h200v200h-80Z" />
              </svg>
            </button>
          </div>
        </div>

        <table className="min-w-full divide-y divide-border">
          <thead className=" text-center text-xs font-medium tracking-wider text-text-primary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Categoria
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-white">
            {[1, 2, 3].map((item) => (
              <tr key={item}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 rounded-full bg-gray-200"></div>

                    <div className="ml-4">
                      <div className="text-sm font-medium text-text-primary">
                        DJI Matrice 300 RTK
                      </div>
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-text-primary">
                    DJI Matrice 300 RTK
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex rounded-full bg-active px-3 py-0.5 text-xs font-semibold leading-5">
                    EQ-7724-A
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm text-text-primary/60">
                  Active
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

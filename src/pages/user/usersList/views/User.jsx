import EditButton from "../../../../shared/components/EditButton";
import DeleteButton from "../../../../shared/components/DeleteButton";

export default function User() {
  return (
    <div className="rounded-lg p-6">
      <div className="flex justify-between">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Usuários</h2>
        <button class="flex justify-center gap-2 items-center rounded-md bg-primary px-8 py-1.5 text-sm/6 font-semibold text-white hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary/65">
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

      {/* Pesquisa */}
      <div className="mb-4">
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
            placeholder="Pesquisar usuário..."
            className="input-utilities w-full pl-10"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Cargo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                E-mail
              </th>
              <th className="px-6 py-3"></th>
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
                        Jane Cooper
                      </div>
                      <div className="text-sm text-text-primary/60">
                        jane.cooper@example.com
                      </div>
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-text-primary">
                    Regional Paradigm Technician
                  </div>

                  <div className="text-sm text-text-primary/60">
                    Optimization
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex rounded-full bg-active px-3 py-0.5 text-xs font-semibold leading-5 text-white">
                    Active
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm text-text-primary/60">
                  Admin
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm text-text-primary/60">
                  jane.cooper@example.com
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <EditButton />
                    <DeleteButton />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

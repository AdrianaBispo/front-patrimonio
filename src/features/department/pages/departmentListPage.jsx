import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";

import EditButton from "../../../shared/components/EditButton";
import DeleteButton from "../../../shared/components/DeleteButton";
import ErrorDialog from "../../../shared/components/ErrorDialog";
import { useList } from "../../user/hooks/useListHook";

export default function DepartmentListPage() {
  const navigate = useNavigate();
  const [showPopUp, setShowPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9 flex justify-between">
        <h3 className=" text-primary/80 mb-2">Departamentos</h3>
        <button
          className="flex justify-center gap-2 items-center rounded-md bg-primary px-8 py-1.5 text-sm/6 font-semibold text-white hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary/65"
          onClick={() => navigate("cadastrar")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            class="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Adicionar
        </button>
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
              placeholder="Pesquisar Departamento..."
              class="px-1.5"
              className="input-utilities w-full pl-10 pr-2 py-2 bg-bg-primary"
            />
          </div>
        </div>

        <table className="min-w-full divide-y divide-border justify-around">
          <thead className=" text-center text-xs font-medium tracking-wider text-text-primary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Gerente
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-white">
            {[1, 2, 3].map((item) => (
              <tr key={item}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-text-primary">
                    DJI Matrice 300 RTK
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-text-primary">
                    DJI Matrice 300 RTK
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <EditButton onClick={() => navigate(`editar/${item.id}`)} />
                    <DeleteButton onClick={() => setShowPopUp(true)} />{" "}
                    <ErrorDialog
                      showPopUp={showPopUp}
                      title="Desativar Departamento"
                      isLoading={isLoading}
                      message={
                        <>
                          Tem certeza que deseja desativar esta Departamento?
                          <br />
                          Essa aÃ§Ã£o nÃ£o poderÃ¡ ser desfeita.
                        </>
                      }
                      onConfirm={async () => {
                        try {
                          await deactivateUser(item.id);
                          toast.success("Desativado com sucesso!");
                        } catch (error) {
                          toast.error(error);
                        }
                        setShowPopUp(false);
                      }}
                      onClose={() => setShowPopUp(false)}
                    />
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

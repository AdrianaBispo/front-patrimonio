import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import EditButton from "../../../shared/components/EditButton";
import Pagination from "../../../shared/components/Pagination";
import { useEquipamentoHook } from "../hooks/useEquipamentoHook";

const POR_PAGINA = 10;

const paginacaoInicial = {
  currentPage: 1,
  lastPage: 1,
  total: 0,
  from: 0,
  to: 0,
};

function extrairPaginacao(result) {
  if (result?.meta && Array.isArray(result?.data)) {
    return {
      items: result.data,
      currentPage: result.meta.current_page ?? 1,
      lastPage: result.meta.last_page ?? 1,
      total: result.meta.total ?? result.data.length,
      from: result.meta.from ?? 0,
      to: result.meta.to ?? 0,
    };
  }

  const paginator =
    result?.equipamentos?.current_page != null
      ? result.equipamentos
      : result?.data?.current_page != null
        ? result.data
        : result;

  if (Array.isArray(paginator?.data)) {
    const items = paginator.data;
    return {
      items,
      currentPage: paginator.current_page ?? 1,
      lastPage: paginator.last_page ?? 1,
      total: paginator.total ?? items.length,
      from: paginator.from ?? (items.length ? 1 : 0),
      to: paginator.to ?? items.length,
    };
  }

  const listaDireta = Array.isArray(result?.equipamentos)
    ? result.equipamentos
    : Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result)
        ? result
        : [];

  return {
    items: listaDireta,
    currentPage: 1,
    lastPage: 1,
    total: listaDireta.length,
    from: listaDireta.length ? 1 : 0,
    to: listaDireta.length,
  };
}

export default function EquipamentosListaPage() {
  const navigate = useNavigate();
  const { listarEquipamentos, isLoading } = useEquipamentoHook();
  const [listEquipamentos, setListEquipamentos] = useState([]);
  const [paginacao, setPaginacao] = useState(paginacaoInicial);
  const [valueFilter, setValueFilter] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("nome");

  const carregarPagina = async (termo, campoFiltro, pageNumber) => {
    try {
      const termoLimpo = termo.trim();
      const result = await listarEquipamentos(
        pageNumber,
        POR_PAGINA,
        campoFiltro === "nome" ? termoLimpo : "",
        campoFiltro === "serie" ? termoLimpo : "",
      );

      const pagina = extrairPaginacao(result);
      setListEquipamentos(pagina.items);
      setPaginacao(pagina);
    } catch (e) {
      toast.error(e?.message ?? "Ocorreu um erro ao obter os equipamentos");
    }
  };

  useEffect(() => {
    carregarPagina("", "nome", 1);
  }, []);

  const handleSearch = () => {
    carregarPagina(valueFilter, tipoFiltro, 1);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9 flex justify-between">
        <h3 className="text-primary/80 mb-2">Equipamentos</h3>
        <button
          type="button"
          className="flex justify-center gap-2 items-center rounded-md bg-primary px-8 py-1.5 text-sm/6 font-semibold text-white hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary/65"
          onClick={() => navigate("cadastrar")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            className="size-4"
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

      <div className="overflow-hidden border-border rounded-2xl shadow-md">
        {/* Pesquisa */}

        <div className="bg-bg-secondary r-50 px-3 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center max-w-xl">
            <select
              aria-label="Tipo de filtro"
              className="input-utilities sm:w-36 bg-bg-primary py-2"
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
            >
              <option value="nome">Nome</option>
              <option value="serie">Série</option>
            </select>

            <div className="relative flex-1">
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
                placeholder={
                  tipoFiltro === "serie"
                    ? "Pesquisar por série..."
                    : "Pesquisar por nome..."
                }
                className="input-utilities w-full pl-10 pr-2 py-2 bg-bg-primary"
                value={valueFilter}
                onChange={(e) => setValueFilter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>
          </div>
        </div>

        <table className="min-w-full divide-y divide-border justify-around">
          <thead className="text-center text-xs font-medium tracking-wider text-text-primary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Série
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Status
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
                  </div>
                </td>
              </tr>
            ) : listEquipamentos.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-sm text-text-primary/70"
                >
                  Nenhum equipamento encontrado.
                </td>
              </tr>
            ) : (
              listEquipamentos.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-text-primary">
                      {item.id}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-text-primary">
                      {item.nome}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-text-primary">
                      {item.serie}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-text-primary">
                      {item.usuario_nome ?? "-"}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-active px-3 py-0.5 text-xs font-semibold leading-5 text-white">
                      {item.status_nome ?? "-"}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <EditButton
                        onClick={() =>
                          navigate(`editar/${item.id}`, {
                            state: { equipamento: item },
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={paginacao.currentPage}
          lastPage={paginacao.lastPage}
          total={paginacao.total}
          from={paginacao.from}
          to={paginacao.to}
          isLoading={isLoading}
          onPageChange={(page) => carregarPagina(valueFilter, tipoFiltro, page)}
        />
      </div>
    </div>
  );
}

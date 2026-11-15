import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

import EditButton from "../../../shared/components/EditButton";
import Pagination from "../../../shared/components/Pagination";
import { useCadastroCategoriaHook } from "../hooks/useCadastroCategoriaHook";

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

  const paginator = result?.data?.current_page != null ? result.data : result;
  const items = Array.isArray(paginator?.data) ? paginator.data : [];

  return {
    items,
    currentPage: paginator?.current_page ?? 1,
    lastPage: paginator?.last_page ?? 1,
    total: paginator?.total ?? items.length,
    from: paginator?.from ?? (items.length ? 1 : 0),
    to: paginator?.to ?? items.length,
  };
}

export default function CategoriaListaPage() {
  const navigate = useNavigate();
  const { getCategoria, isLoading } = useCadastroCategoriaHook();
  const [listCategoria, setListCategoria] = useState([]);
  const [paginacao, setPaginacao] = useState(paginacaoInicial);
  const [valueFilterCategoria, setValueFilterCategoria] = useState("");

  const carregarPagina = async (filterValue, pageNumber) => {
    try {
      const result = await getCategoria(filterValue, null, pageNumber, POR_PAGINA);
      const pagina = extrairPaginacao(result);
      setListCategoria(pagina.items);
      setPaginacao(pagina);
    } catch (e) {
      const message =
        e?.response?.data?.message ?? "Ocorreu um erro ao obter os dados";
      toast.error(message);
    }
  };

  useEffect(() => {
    carregarPagina("", 1);
  }, []);

  const filterCategoria = () => {
    carregarPagina(valueFilterCategoria, 1);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9 flex justify-between">
        <h3 className="text-primary/80 mb-2">Categorias</h3>
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
              placeholder="Pesquisar categoria..."
              className="input-utilities w-full pl-10 pr-2 py-2 bg-bg-primary"
              value={valueFilterCategoria}
              onChange={(e) => setValueFilterCategoria(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  filterCategoria();
                }
              }}
            />
          </div>
        </div>

        <table className="min-w-full divide-y divide-border justify-around">
          <thead className="text-center text-xs font-medium tracking-wider text-text-primary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                Tipo
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-6 py-10">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
                  </div>
                </td>
              </tr>
            ) : listCategoria.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-sm text-text-primary/70"
                >
                  Nenhuma categoria encontrada.
                </td>
              </tr>
            ) : (
              listCategoria.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-text-primary">
                      {item.nome}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-text-primary">
                      {item.tipo_nome}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <EditButton onClick={() => navigate(`editar/${item.id}`)} />
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
          onPageChange={(page) => carregarPagina(valueFilterCategoria, page)}
        />
      </div>
    </div>
  );
}

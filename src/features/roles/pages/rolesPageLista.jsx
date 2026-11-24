import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import Pagination from "../../../shared/components/Pagination";
import { useRoleHook } from "../hooks/useRoleHook";

const POR_PAGINA = 10;

const paginacaoInicial = {
  currentPage: 1,
  lastPage: 1,
  total: 0,
  from: 0,
  to: 0,
};

function extrairItens(resposta) {
  if (resposta?.meta && Array.isArray(resposta?.data)) {
    return {
      items: resposta.data,
      serverSide: true,
      currentPage: resposta.meta.current_page ?? 1,
      lastPage: resposta.meta.last_page ?? 1,
      total: resposta.meta.total ?? resposta.data.length,
      from: resposta.meta.from ?? 0,
      to: resposta.meta.to ?? 0,
    };
  }

  const paginador =
    resposta?.roles?.current_page != null
      ? resposta.roles
      : resposta?.data?.current_page != null
        ? resposta.data
        : resposta?.current_page != null
          ? resposta
          : null;

  if (Array.isArray(paginador?.data)) {
    return {
      items: paginador.data,
      serverSide: true,
      currentPage: paginador.current_page ?? 1,
      lastPage: paginador.last_page ?? 1,
      total: paginador.total ?? paginador.data.length,
      from: paginador.from ?? (paginador.data.length ? 1 : 0),
      to: paginador.to ?? paginador.data.length,
    };
  }

  const items = Array.isArray(resposta)
    ? resposta
    : Array.isArray(resposta?.roles)
      ? resposta.roles
      : Array.isArray(resposta?.data)
        ? resposta.data
        : [];

  return { items, serverSide: false };
}

function paginarLocal(items, pagina, porPagina) {
  const total = items.length;
  const lastPage = Math.max(1, Math.ceil(total / porPagina) || 1);
  const currentPage = Math.min(Math.max(pagina, 1), lastPage);
  const inicio = (currentPage - 1) * porPagina;
  const fatia = items.slice(inicio, inicio + porPagina);

  return {
    items: fatia,
    currentPage,
    lastPage,
    total,
    from: fatia.length ? inicio + 1 : 0,
    to: fatia.length ? inicio + fatia.length : 0,
  };
}

export default function RolesPageLista() {
  const { listarRoles, isLoading } = useRoleHook();
  const [roles, setRoles] = useState([]);
  const [todosRoles, setTodosRoles] = useState([]);
  const [serverSide, setServerSide] = useState(false);
  const [paginacao, setPaginacao] = useState(paginacaoInicial);

  const aplicarPaginaLocal = useCallback((items, pagina) => {
    const resultado = paginarLocal(items, pagina, POR_PAGINA);
    setRoles(resultado.items);
    setPaginacao(resultado);
  }, []);

  const carregarPagina = useCallback(
    async (pagina) => {
      try {
        if (!serverSide && todosRoles.length > 0) {
          aplicarPaginaLocal(todosRoles, pagina);
          return;
        }

        const resposta = await listarRoles(pagina, POR_PAGINA);
        const resultado = extrairItens(resposta);

        if (resultado.serverSide) {
          setServerSide(true);
          setTodosRoles([]);
          setRoles(resultado.items);
          setPaginacao({
            currentPage: resultado.currentPage,
            lastPage: resultado.lastPage,
            total: resultado.total,
            from: resultado.from,
            to: resultado.to,
          });
          return;
        }

        setServerSide(false);
        setTodosRoles(resultado.items);
        aplicarPaginaLocal(resultado.items, pagina);
      } catch (error) {
        toast.error(
          error?.message ?? "Ocorreu um erro ao carregar os perfis de acesso",
        );
      }
    },
    [aplicarPaginaLocal, listarRoles, serverSide, todosRoles],
  );

  useEffect(() => {
    let ativo = true;

    (async () => {
      try {
        const resposta = await listarRoles(1, POR_PAGINA);
        if (!ativo) return;

        const resultado = extrairItens(resposta);

        if (resultado.serverSide) {
          setServerSide(true);
          setTodosRoles([]);
          setRoles(resultado.items);
          setPaginacao({
            currentPage: resultado.currentPage,
            lastPage: resultado.lastPage,
            total: resultado.total,
            from: resultado.from,
            to: resultado.to,
          });
          return;
        }

        setServerSide(false);
        setTodosRoles(resultado.items);
        aplicarPaginaLocal(resultado.items, 1);
      } catch (error) {
        if (!ativo) return;
        toast.error(
          error?.message ?? "Ocorreu um erro ao carregar os perfis de acesso",
        );
      }
    })();

    return () => {
      ativo = false;
    };
  }, [aplicarPaginaLocal, listarRoles]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-9">
        <h3 className="mb-2 text-primary/80">Perfis de Acesso</h3>
        <p>Lista dos roles cadastrados no sistema.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border-border shadow-md">
        <table className="min-w-full divide-y divide-border">
          <thead className="text-xs font-medium tracking-wider text-text-primary">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Nome</th>
              <th className="px-6 py-3 text-left">Guard</th>
              <th className="px-6 py-3 text-left">Permissões</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
                  </div>
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-text-primary/70"
                >
                  Nenhum perfil de acesso encontrado.
                </td>
              </tr>
            ) : (
              roles.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-text-primary">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {item.name ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-text-primary">
                    {item.guard_name ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">
                    {Array.isArray(item.permissions)
                      ? item.permissions.length
                      : "-"}
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
          onPageChange={carregarPagina}
        />
      </div>
    </div>
  );
}

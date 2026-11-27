import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import Pagination from "../../../shared/components/Pagination";
import { useEquipmentHistoryHook } from "../hooks/useEquipmentHistoryHook";

const POR_PAGINA = 10;

const paginacaoInicial = {
  currentPage: 1,
  lastPage: 1,
  total: 0,
  from: 0,
  to: 0,
};

function extrairPaginacao(resposta) {
  if (resposta?.meta && Array.isArray(resposta?.data)) {
    return {
      items: resposta.data,
      currentPage: resposta.meta.current_page ?? 1,
      lastPage: resposta.meta.last_page ?? 1,
      total: resposta.meta.total ?? resposta.data.length,
      from: resposta.meta.from ?? 0,
      to: resposta.meta.to ?? 0,
    };
  }

  const historicos = resposta?.historic_equipaments ?? resposta;
  const paginador =
    historicos?.current_page != null
      ? historicos
      : historicos?.data?.current_page != null
        ? historicos.data
        : null;

  if (Array.isArray(paginador?.data)) {
    return {
      items: paginador.data,
      currentPage: paginador.current_page ?? 1,
      lastPage: paginador.last_page ?? 1,
      total: paginador.total ?? paginador.data.length,
      from: paginador.from ?? (paginador.data.length ? 1 : 0),
      to: paginador.to ?? paginador.data.length,
    };
  }

  const items = Array.isArray(historicos)
    ? historicos
    : Array.isArray(historicos?.data)
      ? historicos.data
      : [];

  return {
    items,
    currentPage: 1,
    lastPage: 1,
    total: items.length,
    from: items.length ? 1 : 0,
    to: items.length,
  };
}

function formatarData(data) {
  if (!data) return "-";

  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) return data;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(valor);
}

export default function EquipmentHistoryListPage() {
  const { t } = useTranslation();
  const { listHistory, isLoading } = useEquipmentHistoryHook();
  const [historicos, setHistoricos] = useState([]);
  const [paginacao, setPaginacao] = useState(paginacaoInicial);

  const loadPage = useCallback(
    async (pagina) => {
      try {
        const resposta = await listHistory(pagina, POR_PAGINA);
        const resultado = extrairPaginacao(resposta);
        setHistoricos(resultado.items);
        setPaginacao(resultado);
      } catch (error) {
        toast.error(t(error?.message) ?? t("errors.equipmentHistoryError"));
      }
    },
    [listHistory, t],
  );

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-9">
        <h3 className="mb-2 text-primary/80">Histórico de Equipamentos</h3>
      </div>

      <div className="overflow-hidden rounded-2xl border-border shadow-md">
        <table className="min-w-full divide-y divide-border">
          <thead className="text-xs font-medium tracking-wider text-text-primary">
            <tr>
              <th className="px-6 py-3 text-left">Data/Hora</th>
              <th className="px-6 py-3 text-left">Equipamento</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Usuário</th>
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
            ) : historicos.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-text-primary/70"
                >
                  Nenhum histórico de equipamento encontrado.
                </td>
              </tr>
            ) : (
              historicos.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-text-primary">
                    {formatarData(item.date_time)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {item.equipament_nome ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-success/15 px-3 py-0.5 text-xs font-semibold leading-5 text-success">
                      {item.status_nome ?? "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">
                    {item.user_nome ?? "-"}
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
          onPageChange={loadPage}
        />
      </div>
    </div>
  );
}

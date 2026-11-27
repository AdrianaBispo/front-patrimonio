import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import Pagination from "../../../shared/components/Pagination";
import { useEquipmentHistoryHook } from "../hooks/useEquipmentHistoryHook";

const PER_PAGE = 10;

function formatarData(data, locale, emptyValue) {
  if (!data) return emptyValue;

  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) return data;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(valor);
}

export default function EquipmentHistoryListPage() {
  const { t, i18n } = useTranslation();
  const { listHistory, isLoading, paginator } = useEquipmentHistoryHook();
  const [historicos, setHistoricos] = useState([]);
  const emptyValue = t("equipmentHistory.list.emptyValue");

  const loadPage = useCallback(
    async (pagina) => {
      try {
        const result = await listHistory(paginator.currentPage, PER_PAGE);
        setHistoricos(result.data);
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
        <h3 className="mb-2 text-primary/80">
          {t("equipmentHistory.list.title")}
        </h3>
      </div>

      <div className="overflow-hidden rounded-2xl border-border shadow-md">
        <table className="min-w-full divide-y divide-border">
          <thead className="text-xs font-medium tracking-wider text-text-primary">
            <tr>
              <th className="px-6 py-3 text-left">
                {t("equipmentHistory.list.dateTime")}
              </th>
              <th className="px-6 py-3 text-left">
                {t("equipmentHistory.list.equipment")}
              </th>
              <th className="px-6 py-3 text-left">
                {t("equipmentHistory.list.status")}
              </th>
              <th className="px-6 py-3 text-left">
                {t("equipmentHistory.list.user")}
              </th>
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
                  {t("equipmentHistory.list.empty")}
                </td>
              </tr>
            ) : (
              historicos.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-text-primary">
                    {formatarData(
                      item.date_time,
                      i18n.language === "en" ? "en-US" : "pt-BR",
                      emptyValue,
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {item.equipament_nome ?? emptyValue}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-success/15 px-3 py-0.5 text-xs font-semibold leading-5 text-success">
                      {item.status_nome ?? emptyValue}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">
                    {item.user_nome ?? emptyValue}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={paginator.currentPage}
          lastPage={paginator.lastPage}
          total={paginator.total}
          from={paginator.from}
          to={paginator.to}
          isLoading={isLoading}
          onPageChange={loadPage}
        />
      </div>
    </div>
  );
}

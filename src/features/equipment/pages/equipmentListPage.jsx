import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import EditButton from "../../../shared/components/EditButton";
import Pagination from "../../../shared/components/Pagination";
import { useEquipmentListHook } from "../hooks/useEquipmentListHook";

const PER_PAGE = 10;

export default function EquipmentListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { listEquipments, isLoading, paginator } = useEquipmentListHook();
  const [equipments, setEquipments] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const emptyValue = t("equipment.list.emptyValue");

  const loadPage = useCallback(
    async (pageNumber) => {
      try {
        const result = await listEquipments(
          pageNumber,
          PER_PAGE,
          filterValue,
        );
        setEquipments(result?.data ?? []);
      } catch (err) {
        toast.error(t(err?.message) ?? t("errors.equipmentError"));
      }
    },
    [filterValue, listEquipments, t],
  );

  useEffect(() => {
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    loadPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-9 flex justify-between gap-2">
        <h3 className="mb-2 text-primary/80">{t("equipment.list.title")}</h3>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-1.5 text-sm/6 font-semibold text-white hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary/65"
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
          {t("equipment.list.add")}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border-border shadow-md">
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
              placeholder={t("equipment.list.searchPlaceholder")}
              className="input-utilities w-full bg-bg-primary py-2 pl-10 pr-12"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center text-text-primary/70 transition-colors hover:text-secondary"
              title={t("equipment.list.searchBarcode")}
              aria-label={t("equipment.list.searchBarcode")}
              onClick={handleSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                className="size-5"
                fill="currentColor"
              >
                <path d="M40-120v-200h80v120h120v80H40Zm680 0v-80h120v-120h80v200H720ZM160-240v-480h80v480h-80Zm120 0v-480h40v480h-40Zm120 0v-480h80v480h-80Zm120 0v-480h120v480H520Zm160 0v-480h40v480h-40Zm80 0v-480h40v480h-40ZM40-640v-200h200v80H120v120H40Zm800 0v-120H720v-80h200v200h-80Z" />
              </svg>
            </button>
          </div>
        </div>

        <table className="min-w-full divide-y divide-border">
          <thead className="text-xs font-medium tracking-wider text-text-primary">
            <tr>
              <th className="px-6 py-3 text-left">{t("equipment.list.name")}</th>
              <th className="px-6 py-3 text-left">
                {t("equipment.list.category")}
              </th>
              <th className="px-6 py-3 text-left">
                {t("equipment.list.serial")}
              </th>
              <th className="px-6 py-3 text-left">{t("equipment.list.user")}</th>
              <th className="px-6 py-3 text-left">
                {t("equipment.list.status")}
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
            ) : equipments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-sm text-text-primary/70"
                >
                  {t("equipment.list.empty")}
                </td>
              </tr>
            ) : (
              equipments.map((item) => (
                <tr key={item.eqi_id ?? item.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-text-primary">
                      {item.eqi_name ?? item.eqi_nome ?? item.nome ?? emptyValue}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-text-primary">
                      {item.categoria_nome ?? item.categoria?.nome ?? emptyValue}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-text-primary">
                      {item.eqi_serie ?? item.serie ?? emptyValue}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-text-primary">
                      {item.usuario_nome ?? emptyValue}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-success/15 px-3 py-0.5 text-xs font-semibold leading-5 text-success">
                      {item.status_nome ?? item.status?.nome ?? emptyValue}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <EditButton
                        onClick={() =>
                          navigate(`editar/${item.eqi_id ?? item.id}`, {
                            state: { equipment: item },
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

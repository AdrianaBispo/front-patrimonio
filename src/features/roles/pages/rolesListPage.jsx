import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import Pagination from "../../../shared/components/Pagination";
import EditButton from "../../../shared/components/EditButton";
import { useRoleListHook } from "../hooks/useRoleListHook";

const PER_PAGE = 10;

export default function RolesListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { listRoles, isLoading, paginator } = useRoleListHook();
  const [roles, setRoles] = useState([]);
  const emptyValue = t("role.list.emptyValue");

  const loadPage = useCallback(
    async (pageNumber) => {
      try {
        const result = await listRoles(pageNumber, PER_PAGE);
        setRoles(result?.data ?? []);
      } catch (err) {
        toast.error(t(err?.message) ?? t("errors.roleError"));
      }
    },
    [listRoles, t],
  );

  useEffect(() => {
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-9 flex justify-between gap-2">
        <h3 className="mb-2 text-primary/80">{t("role.list.title")}</h3>
        <button
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
          {t("role.list.add")}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border-border shadow-md">
        <table className="min-w-full divide-y divide-border">
          <thead className="text-xs font-medium tracking-wider text-text-primary">
            <tr>
              <th className="px-6 py-3 text-left">{t("role.list.name")}</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={2} className="px-6 py-10">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
                  </div>
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-8 text-center text-sm text-text-primary/70"
                >
                  {t("role.list.empty")}
                </td>
              </tr>
            ) : (
              roles.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {item.name ?? emptyValue}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <EditButton
                        onClick={() => navigate(`editar/${item.id}`)}
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

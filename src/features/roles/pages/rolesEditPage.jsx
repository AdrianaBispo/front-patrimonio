import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { RoleForm } from "../components/RoleForm";
import { useRoleFormHook } from "../hooks/useRoleFormHook";

export default function RolesEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    loadRole,
    updateRole,
    isLoading,
    isLoadingData,
    inputsErrors,
  } = useRoleFormHook();

  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (!id) {
      navigate("/roles", { replace: true });
      return;
    }

    loadRole(id)
      .then((response) => {
        setName(response?.role?.name ?? "");

        const list = Array.isArray(response?.permissions)
          ? response.permissions
          : [];

        setPermissions(list);
        setSelectedPermissions(
          list
            .filter((item) => item.assigned)
            .map((item) => Number(item.id)),
        );
      })
      .catch((error) => {
        toast.error(t(error?.message) ?? t("errors.roleError"));
        navigate("/roles", { replace: true });
      });
  }, [id, loadRole, navigate, t]);

  function togglePermission(permissionId) {
    const value = Number(permissionId);
    setSelectedPermissions((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!id) return;

    try {
      const result = await updateRole(id, {
        permissions: selectedPermissions,
      });

      if (!result) return;

      toast.success(t("messages.roleUpdated"));
      navigate("/roles");
    } catch (error) {
      toast.error(t(error?.message) ?? t("errors.roleError"));
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-9 gap-2">
        <h3 className="mb-2 text-primary/80">{t("role.edit.title")}</h3>
      </div>

      <RoleForm
        name={name}
        nameReadOnly
        permissions={permissions}
        selectedPermissions={selectedPermissions}
        onTogglePermission={togglePermission}
        isLoading={isLoading}
        inputsErrors={inputsErrors}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}

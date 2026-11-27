import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { usePermission } from "../../permissions/hooks/usePermission";
import { RoleForm } from "../components/RoleForm";
import { useRoleFormHook } from "../hooks/useRoleFormHook";

export default function RolesCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { createRole, isLoading, inputsErrors } = useRoleFormHook();
  const {
    listPermissions,
    permissions,
    isLoading: isLoadingPermissions,
  } = usePermission();

  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    listPermissions().catch((error) => {
      toast.error(t(error?.message) ?? t("errors.permissionError"));
    });
  }, [listPermissions, t]);

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

    try {
      const result = await createRole({
        name: name.trim(),
        permissions: selectedPermissions,
      });

      if (!result) return;

      toast.success(t("messages.roleCreated"));
      navigate("/roles");
    } catch (error) {
      toast.error(t(error?.message) ?? t("errors.roleError"));
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-9 gap-2">
        <h3 className="mb-2 text-primary/80">{t("role.create.title")}</h3>
      </div>

      <RoleForm
        name={name}
        setName={setName}
        permissions={permissions}
        selectedPermissions={selectedPermissions}
        onTogglePermission={togglePermission}
        isLoadingPermissions={isLoadingPermissions}
        isLoading={isLoading}
        inputsErrors={inputsErrors}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}

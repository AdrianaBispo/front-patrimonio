import { useTranslation } from "react-i18next";
import ErrorLabel from "../../../shared/components/ErrorLabel";

export function RoleForm({
  name,
  setName,
  nameReadOnly = false,
  permissions = [],
  selectedPermissions = [],
  onTogglePermission,
  isLoadingPermissions = false,
  isLoading = false,
  inputsErrors = {},
  onSubmit,
  onCancel,
}) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="card overflow-hidden bg-bg-secondary px-4 py-3">
        <div className="mb-5 flex flex-col gap-5 md:flex-row">
          <div className="flex-1">
            <label htmlFor="name">{t("role.form.name")}</label>
            <input
              id="name"
              name="name"
              className="input-utilities"
              type="text"
              placeholder={t("role.form.namePlaceholder")}
              maxLength={255}
              value={name}
              onChange={(e) => setName?.(e.target.value)}
              disabled={nameReadOnly}
              readOnly={nameReadOnly}
              required={!nameReadOnly}
            />
            {inputsErrors?.name && (
              <ErrorLabel>{t(inputsErrors.name)}</ErrorLabel>
            )}
          </div>
        </div>

        <div className="mb-2">
          <h4 className="mb-3 font-bold">{t("role.form.permissions")}</h4>
          {inputsErrors?.permissions && (
            <ErrorLabel>{t(inputsErrors.permissions)}</ErrorLabel>
          )}

          {isLoadingPermissions ? (
            <div className="flex min-h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
            </div>
          ) : permissions.length === 0 ? (
            <p className="text-sm text-text-primary/70">
              {t("role.form.permissionsEmpty")}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {permissions.map((permission) => {
                const permissionId = Number(permission.id);
                const checked = selectedPermissions.includes(permissionId);

                return (
                  <label
                    key={permission.id}
                    htmlFor={`permission-${permission.id}`}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-white px-3 py-2"
                  >
                    <input
                      id={`permission-${permission.id}`}
                      type="checkbox"
                      className="size-4 accent-primary"
                      checked={checked}
                      onChange={() => onTogglePermission(permissionId)}
                    />
                    <span className="text-sm text-text-primary">
                      {permission.name}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-row justify-end gap-3">
        <button
          type="button"
          className="btn-secondary items-stretch"
          disabled={isLoading}
          onClick={onCancel}
        >
          {t("role.form.cancel")}
        </button>

        <button
          type="submit"
          className="btn-primary bg-primary px-8"
          disabled={isLoading || isLoadingPermissions}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-bg-primary border-t-transparent" />
            </div>
          ) : (
            t("role.form.save")
          )}
        </button>
      </div>
    </form>
  );
}

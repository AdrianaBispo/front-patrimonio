import { useTranslation } from "react-i18next";
import ErrorLabel from "../../../shared/components/ErrorLabel";
import { IMaskInput } from "react-imask";
import { phoneMaskOptions } from "../../../shared/utils/formatPhone";

export default function UserForm({
  nome,
  setNome,
  celular,
  setCelular,
  email,
  setEmail,
  roleId,
  setRoleId,
  password,
  setPassword,
  roles = [],
  inputsErrors = {},
  isLoading,
  isEditing = false,
  onSubmit,
  onCancel,
}) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="card overflow-hidden bg-bg-secondary px-4 py-3">
        <h4 className="mb-5 font-bold">{t("user.form.personalInfo")}</h4>

        <div className="mb-5 flex flex-col gap-5 md:flex-row">
          <div className="flex-1">
            <label htmlFor="nome">
              {t("user.form.name")} <span className="text-red-500">*</span>
            </label>
            <input
              id="nome"
              name="nome"
              className="input-utilities"
              type="text"
              maxLength={255}
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
            {inputsErrors.nome && (
              <ErrorLabel>{inputsErrors.nome}</ErrorLabel>
            )}
          </div>

          <div className="flex-1">
            <label htmlFor="celular">
              {t("user.form.phone")} <span className="text-red-500">*</span>
            </label>
            <IMaskInput
              mask={phoneMaskOptions.mask}
              unmask={true}
              id="celular"
              name="celular"
              className="input-utilities"
              type="tel"
              maxLength={20}
              value={celular}
              onAccept={(value) => setCelular(value)}
            />
            {inputsErrors.celular && (
              <ErrorLabel>{inputsErrors.celular}</ErrorLabel>
            )}
          </div>
        </div>

        <div className="mb-8">
          <label htmlFor="email">
            {t("user.form.email")} <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            className="input-utilities"
            type="email"
            maxLength={255}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {inputsErrors.email && (
            <ErrorLabel>{inputsErrors.email}</ErrorLabel>
          )}
        </div>

        <div className="mb-5 border-t border-border/60 pt-6">
          <h4 className="mb-5 font-bold">
            {t("user.form.securityCredentials")}
          </h4>

          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex-1">
              <label htmlFor="role_id">
                {t("user.form.accessProfile")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="role_id"
                name="role_id"
                className="input-utilities"
                value={roleId}
                onChange={(event) => setRoleId(event.target.value)}
                required
              >
                <option value="">{t("user.form.select")}</option>
                {roles.map((role) => (
                  <option key={role.id} value={String(role.id)}>
                    {role.name}
                  </option>
                ))}
              </select>
              {inputsErrors.role_id && (
                <ErrorLabel>{inputsErrors.role_id}</ErrorLabel>
              )}
            </div>

            <div className="flex-1">
              <label htmlFor="password">
                {isEditing
                  ? t("user.form.newPassword")
                  : t("user.form.password")}{" "}
                {!isEditing && <span className="text-red-500">*</span>}
              </label>
              <input
                id="password"
                name="password"
                className="input-utilities"
                type="password"
                minLength={8}
                value={password}
                placeholder={
                  isEditing
                    ? t("user.form.passwordKeepPlaceholder")
                    : t("user.form.passwordPlaceholder")
                }
                onChange={(event) => setPassword(event.target.value)}
              />
              {inputsErrors.password && (
                <ErrorLabel>{inputsErrors.password}</ErrorLabel>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          className="btn-secondary"
          disabled={isLoading}
          onClick={onCancel}
        >
          {t("user.form.cancel")}
        </button>
        <button
          type="submit"
          className="btn-primary bg-primary px-8"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-bg-primary border-t-transparent" />
          ) : isEditing ? (
            t("user.form.save")
          ) : (
            t("user.form.createUser")
          )}
        </button>
      </div>
    </form>
  );
}

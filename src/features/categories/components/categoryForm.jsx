import { useTranslation } from "react-i18next";
import ErrorLabel from "../../../shared/components/ErrorLabel";

export function CategoryForm({
  nome,
  setNome,
  tipo,
  setTipo,
  nota,
  setNota,
  isLoading,
  inputsErrors,
  onSubmit,
  onCancel,
}) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="overflow-hidden bg-bg-secondary px-4 py-3 card">
        <div className="flex flex-col mb-5 md:flex-row gap-5">
          <div className="flex-1">
            <label htmlFor="nome">{t("category.form.name")}</label>
            <input
              id="nome"
              name="nome"
              className="input-utilities"
              type="text"
              placeholder={t("category.form.namePlaceholder")}
              maxLength={70}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            {inputsErrors?.nome && (
              <ErrorLabel>{t(inputsErrors.nome)}</ErrorLabel>
            )}
          </div>

          <div className="flex-1">
            <label htmlFor="tipo">{t("category.form.type")}</label>
            <select
              id="tipo"
              name="tipo"
              className="input-utilities"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            >
              <option value="">{t("category.form.select")}</option>
              <option value="AC">{t("category.form.typeAccessory")}</option>
              <option value="AT">{t("category.form.typeAsset")}</option>
              <option value="CO">{t("category.form.typeConsumable")}</option>
              <option value="LI">{t("category.form.typeLicense")}</option>
              <option value="CP">{t("category.form.typeComponent")}</option>
            </select>
            {inputsErrors?.tipo && (
              <ErrorLabel>{t(inputsErrors.tipo)}</ErrorLabel>
            )}
          </div>
        </div>

        <div className="flex flex-col mb-5 md:flex-row gap-5">
          <div className="flex-1">
            <label htmlFor="nota">{t("category.form.note")}</label>
            <textarea
              id="nota"
              className="input-utilities"
              name="nota"
              rows={5}
              maxLength={500}
              placeholder={t("category.form.notePlaceholder")}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
            {inputsErrors?.nota && (
              <ErrorLabel>{t(inputsErrors.nota)}</ErrorLabel>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-3 justify-end mt-4">
        <button
          type="button"
          className="btn-secondary items-stretch"
          disabled={isLoading}
          onClick={onCancel}
        >
          {t("category.form.cancel")}
        </button>

        <button
          type="submit"
          className="btn-primary bg-primary px-8"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-bg-primary border-t-transparent" />
            </div>
          ) : (
            t("category.form.save")
          )}
        </button>
      </div>
    </form>
  );
}

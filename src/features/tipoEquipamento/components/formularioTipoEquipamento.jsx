import ErrorLabel from "../../../shared/components/ErrorLabel";

export function FormularioTipoEquipamento({
  nome,
  setNome,
  descricao,
  setDescricao,
  ativo,
  setAtivo,
  isLoading,
  inputsErrors,
  handleSubmit,
  navigate,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="overflow-hidden bg-bg-secondary px-4 py-3 card">
        <div className="flex flex-col mb-5 md:flex-row gap-5">
          <div className="flex-1">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              name="nome"
              className="input-utilities"
              type="text"
              placeholder="Nome"
              maxLength={70}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            {inputsErrors?.nome && <ErrorLabel>{inputsErrors.nome}</ErrorLabel>}
          </div>

          <div className="flex-1">
            <label htmlFor="ativo">Ativo</label>
            <select
              id="ativo"
              name="ativo"
              className="input-utilities"
              value={ativo ? "true" : "false"}
              onChange={(e) => setAtivo(e.target.value === "true")}
            >
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
            {inputsErrors?.ativo && <ErrorLabel>{inputsErrors.ativo}</ErrorLabel>}
          </div>
        </div>

        <div className="flex flex-col mb-5">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            className="input-utilities"
            rows={5}
            maxLength={150}
            placeholder="Descrição do tipo de equipamento"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
          {inputsErrors?.descricao && (
            <ErrorLabel>{inputsErrors.descricao}</ErrorLabel>
          )}
        </div>
      </div>

      <div className="flex flex-row gap-3 justify-end mt-4">
        <button
          type="button"
          className="btn-secondary items-stretch"
          onClick={() => navigate(-1)}
        >
          Cancelar
        </button>

        <button type="submit" className="btn-primary bg-primary px-8">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-bg-primary border-t-transparent" />
            </div>
          ) : (
            "Salvar"
          )}
        </button>
      </div>
    </form>
  );
}
import ErrorLabel from "../../../shared/components/ErrorLabel";


export function FormularioEquipamento({
  nome,
  setNome,
  serie,
  setSerie,
  statusId,
  setStatusId,
  usuarioId,
  setUsuarioId,
  descricao,
  setDescricao,
  imagemUrl,
  setImagemUrl,
  listaStatus = [],
  listaUsuarios = [],
  isLoading,
  inputsErrors,
  handleSubmit,
  navigate,
  selectedImage,
  handleChangeImage,
  submitLabel = "Salvar",
}) {

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr] items-stretch">
        {/* Área da imagem (envio definido como null por enquanto) */}

        <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-4">
          <div className="flex gap-2 items-center">
            <div className="text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
            </div>

            <p className="font-bold">Imagem do Equipamento</p>
          </div>
          <a
            className="cursor-pointer  flex flex-1 flex-col
                items-center justify-center
                rounded-lg border border-dashed
                border-gray-300
                "
            onClick={() => document.getElementById('image-input').click()}
          >
            <div className={`flex flex-1 flex-col items-center justify-center w-full h-full ${selectedImage ? '' : 'bg-[#f8f6f3]'}`}>
              <input
                type="file"
                id="image-input"
                accept="image/*"
                onChange={handleChangeImage}
                className=" flex flex-1 flex-col
                cursor-pointer
                hidden hover:opacity-70 transition-opacity w-full h-full color-black"
              />
              <div className={`mb-3 text-4xl ${selectedImage ? 'opacity-100' : 'opacity-20'}`}>
                {selectedImage ? (
                  <img src={selectedImage} alt="Imagem do equipamento" className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-[#f8f6f3]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    </svg>
                    </div>
                )}
              </div>
            </div>
          </a>
          <div className="mt-4">
            <label htmlFor="imagem_url">URL da imagem</label>
            <input
              id="imagem_url"
              name="imagem_url"
              className="input-utilities"
              type="url"
              maxLength={255}
              placeholder="https://exemplo.com/equipamento.png"
              value={imagemUrl}
              onChange={(e) => setImagemUrl(e.target.value)}
            />
            {inputsErrors?.imagem_url && (
              <ErrorLabel>{inputsErrors.imagem_url}</ErrorLabel>
            )}
          </div>
        </div>

        {/* Informações do equipamento */}
        <div className="overflow-hidden bg-bg-secondary px-4 py-3 card">
          <div className="flex gap-2 items-center mb-4">
            <div className="text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                />
              </svg>
            </div>

            <p className="font-bold">Informações do Equipamento</p>
          </div>

          <div className="flex flex-col mb-5 md:flex-row gap-5">
            <div className="flex-1">
              <label htmlFor="nome">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                id="nome"
                name="nome"
                className="input-utilities"
                type="text"
                placeholder="Ex: Notebook Dell"
                maxLength={255}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              {inputsErrors?.nome && <ErrorLabel>{inputsErrors.nome}</ErrorLabel>}
            </div>

            <div className="flex-1">
              <label htmlFor="serie">
                Número de Série <span className="text-red-500">*</span>
              </label>
              <input
                id="serie"
                name="serie"
                className="input-utilities"
                type="text"
                inputMode="numeric"
                placeholder="Ex: 123456"
                maxLength={255}
                value={serie}
                onChange={(e) => setSerie(e.target.value.replace(/\D/g, ""))}
              />
              {inputsErrors?.serie && <ErrorLabel>{inputsErrors.serie}</ErrorLabel>}
            </div>
          </div>

          <div className="flex flex-col mb-5 md:flex-row gap-5">
            <div className="flex-1">
              <label htmlFor="status_id">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status_id"
                name="status_id"
                className="input-utilities"
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
              >
                <option value="">Selecione</option>
                {listaStatus.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.nome}
                  </option>
                ))}
              </select>
              {inputsErrors?.status_id && (
                <ErrorLabel>{inputsErrors.status_id}</ErrorLabel>
              )}
            </div>

            <div className="flex-1">
              <label htmlFor="usuario_id">
                Usuário Responsável <span className="text-red-500">*</span>
              </label>
              <select
                id="usuario_id"
                name="usuario_id"
                className="input-utilities"
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value)}
              >
                <option value="">Selecione</option>
                {listaUsuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nome}
                  </option>
                ))}
              </select>
              {inputsErrors?.usuario_id && (
                <ErrorLabel>{inputsErrors.usuario_id}</ErrorLabel>
              )}
            </div>
          </div>

          <div className="flex flex-col mb-5">
            <label htmlFor="descricao">
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descricao"
              name="descricao"
              className="input-utilities"
              rows={5}
              maxLength={255}
              placeholder="Insira especificações detalhadas, observações sobre o estado ou requisitos operacionais..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            {inputsErrors?.descricao && (
              <ErrorLabel>{inputsErrors.descricao}</ErrorLabel>
            )}
          </div>
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

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary bg-primary px-8"
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-bg-primary border-t-transparent" />
            </div>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}

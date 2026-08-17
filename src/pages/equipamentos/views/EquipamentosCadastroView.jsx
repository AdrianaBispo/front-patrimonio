import { useNavigate } from "react-router-dom";

export default function EquipamentoCadastroView() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9">
        <h3 className=" text-primary/80 mb-2">Cadastrar Equipamento</h3>
        <p>
          Inicializar um novo equipamento no sistema central de gerenciamento de
          inventário.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]  items-stretch">
        {/* upload da imagem */}
        <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-4">
          <div class="flex gap-2">
            <div class="text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
            </div>

            <p className="font-bold">Imagem do Equipamento</p>
          </div>

          <div className="mt-2 flex flex-1">
            <label
              htmlFor="equipment-photo"
              className="
              flex flex-1 cursor-pointer flex-col
              items-center justify-center
              rounded-lg border border-dashed
              border-gray-300
              bg-[#f8f6f3]
              px-4 text-center
              transition hover:border-cyan-400
            "
            >
              <div className="mb-3 text-4xl opacity-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>

              <p className="text-[11px] leading-4 text-gray-500">
                Click or drag to upload high-resolution asset image
              </p>

              <span className="mt-1 text-[10px] text-gray-400">
                JPG, PNG up to 10MB
              </span>

              <input
                id="equipment-photo"
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Informações do equipamento */}
        <div class="bg-bg-secondary card">
          <div class="flex gap-2">
            <div class="text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>

            <p className="font-bold">Informações do Equipamento</p>
          </div>
          <div className="flex flex-col mb-5 md:flex-row gap-5">
            <div className="flex-1">
              <label>Nome</label>
              <input
                className="input-utilities"
                type="text"
                placeholder="e.g. Caterpillar 320 GC"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="serie">Numero de Série</label>
              <input
                id="serie"
                className="input-utilities"
                type="text"
                placeholder="SN-XXXX-XXXX-XXXX"
              />
            </div>
          </div>
          <div className="flex flex-col mb-5 md:flex-row gap-5">
            <div className="flex-1">
              <label htmlFor="cargo">Fornedor</label>
              <select id="cargo" name="cargo" className="input-utilities">
                <option value="">Selecione</option>
                <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col mb-5 md:flex-row gap-5">
            <div className="flex-1">
              <label>Descrição</label>
              <textarea
                className="input-utilities"
                type="text"
                placeholder="Insira especificações detalhadas, observações sobre o estado ou requisitos operacionais..."
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-row gap-3 justify-end mt-4">
        <button
          type="button"
          className="btn-secondary items-stretch"
          onClick={() => navigate(-1)}
        >
          Cancelar
        </button>
        <button type="button" className="btn-primary bg-primary px-8">
          Criar Equipamento
        </button>
      </div>
    </div>
  );
}

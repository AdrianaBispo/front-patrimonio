import { useNavigate } from "react-router-dom";

export default function FornecedorCadastroView() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9">
        <h3 className=" text-primary/80 mb-2">Novo Fornecedor</h3>
        <p>
        Adicionar um novo fornecedor à sua cadeia de suprimentos de equipamentos.
        </p>
      </div>

      <div className="overflow-hidden bg-bg-secondary px-4 py-3 card">
        <div class="flex gap-2 mb-5 mt-5 ">
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
                d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
              />
            </svg>
          </div>

          <p className="font-bold">Perfil</p>
        </div>
        <div className="flex flex-col mb-5 md:flex-row gap-5">
          <div className="flex-1">
            <label htmlFor="nomeEmpresa">Razão Social</label>
            <input id="nomeEmpresa" className="input-utilities" type="text" placeholder="Empresa" />
          </div>
          <div className="flex-1">
            <label htmlFor="cnpj">CNPJ</label>
            <input
              id="cnpj"
              className="input-utilities"
              type="text"
              placeholder="00.000.000/0000-00"
            />
          </div>
        </div>

        <div className="flex flex-col mb-5 md:flex-row gap-5">
          <div className="flex-1">
            <label htmlFor="site">Site da Empresa</label>
            <input
              id="site"
              className="input-utilities"
              type="text"
              placeholder="https://www.example.com"
            />
          </div>
        </div>

        <div class="border border-border/60 mt-6 mb-9"></div>
        <div>
          <div class="flex gap-2 mb-5 mt-5 ">
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
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
            </div>

            <p className="font-bold">Contato</p>
          </div>

          <div className="flex flex-col mb-5 md:flex-row gap-5">
            <div className="flex-1">
              <label htmlFor="pessoa">Pessoa para contato</label>
              <input
                id="pessoa"
                className="input-utilities"
                type="text"
                placeholder="Nome"
              />
            </div>
          </div>

          <div className="flex flex-col mb-5 md:flex-row gap-5">
            <div className="flex-1">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                className="input-utilities"
                type="email"
                placeholder="e-mail"
              />
            </div>

            <div className="flex-1">
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                className="input-utilities"
                type="text"
                placeholder="(00) 00000-0000"
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
          Criar Fornecedor
        </button>
      </div>
    </div>
  );
}

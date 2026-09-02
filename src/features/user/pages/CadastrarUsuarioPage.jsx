import { useNavigate } from "react-router-dom";

export default function CadastrarUserPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9">
        <h3 className=" text-primary/80 mb-2">Register New User</h3>
        <p>
          Create credentials and define access levels for a new team member.
          Ensure all personal <br />
          details match official identification for inventory accountability.
        </p>
      </div>

      <div className="overflow-hidden bg-bg-secondary px-4 py-3 card">
        <div class="flex gap-2 mb-5 mt-5 ">
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

          <p className="font-bold">Personal Information</p>
        </div>
        <div className="flex flex-col mb-5 md:flex-row gap-5">
          <div className="flex-1">
            <label>Nome</label>
            <input className="input-utilities" type="text" placeholder="Nome" />
          </div>
        </div>

        <div className="flex flex-col mb-5 md:flex-row gap-5">
          <div className="flex-1">
            <label>Celular</label>
            <input
              className="input-utilities"
              type="text"
              placeholder="Celular"
            />
          </div>

          <div className="flex-1">
            <label>E-mail</label>

            <input
              className="input-utilities"
              type="email"
              placeholder="E-mail"
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
                stroke-width="2"
                stroke="currentColor"
                class="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>

            <p className="font-bold">Security Credentials</p>
          </div>

          <div className="flex flex-col mb-5 md:flex-row gap-5">
            <div className="flex-1">
              <label htmlFor="cargo">Perfil de Acesso</label>

              <select id="cargo" name="cargo" className="input-utilities">
                <option value="">Selecione</option>
                <option value="volvo">Administrador</option>
                <option value="saab">Técnico</option>
                <option value="mercedes">Usuário Comum</option>
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="cargo">Departamento</label>
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
              <label>Temporary Password</label>
              <input
                className="input-utilities"
                type="password"
                placeholder="password"
              />
            </div>
          </div>
        </div>

        <div class="flex  items-center gap-2 border border-transparent rounded-md px-4 py-4">
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
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          </div>
          <p>
            Passwords must be at least 12 characters and contain a mix of
            uppercase letters, numbers, and symbols for enterprise-grade
            security.
          </p>
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
          Criar Usuário
        </button>
      </div>
    </div>
  );
}

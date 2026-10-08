import { useNavigate } from "react-router-dom";

export default function CadastrarUserPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9">
        <h3 className="text-primary/80 mb-2">Cadastrar Novo Usuário</h3>
        <p>
          Crie as credenciais e defina os níveis de acesso para um novo membro
          da equipe. <br />
          Certifique-se de que todos os dados pessoais correspondam à
          identificação oficial para controle do inventário.
        </p>
      </div>

      <div className="overflow-hidden bg-bg-secondary px-4 py-3 card">
        <div className="flex gap-2 mb-5 mt-5">
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
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>

          <p className="font-bold">Informações Pessoais</p>
        </div>

        <div className="flex flex-col mb-5 md:flex-row gap-5">
          <div className="flex-1">
            <label>Nome</label>
            <input
              className="input-utilities"
              type="text"
              placeholder="Nome"
            />
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

        <div className="border border-border/60 mt-6 mb-9"></div>

        <div>
          <div className="flex gap-2 mb-5 mt-5">
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
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>

            <p className="font-bold">Credenciais de Segurança</p>
          </div>

          <div className="flex flex-col mb-5 md:flex-row gap-5">
            <div className="flex-1">
              <label htmlFor="perfil">Perfil de Acesso</label>

              <select
                id="perfil"
                name="perfil"
                className="input-utilities"
              >
                <option value="">Selecione</option>
                <option value="administrador">Administrador</option>
                <option value="tecnico">Técnico</option>
                <option value="usuario">Usuário Comum</option>
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="departamento">Departamento</label>

              <select
                id="departamento"
                name="departamento"
                className="input-utilities"
              >
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
              <label>Senha Temporária</label>
              <input
                className="input-utilities"
                type="password"
                placeholder="Digite a senha"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border border-transparent rounded-md px-4 py-4">
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
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          </div>

          <p>
            A senha deve ter pelo menos 12 caracteres e conter uma combinação
            de letras maiúsculas, números e símbolos para garantir segurança
            de nível empresarial.
          </p>
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
          type="button"
          className="btn-primary bg-primary px-8"
        >
          Criar Usuário
        </button>
      </div>
    </div>
  );
}
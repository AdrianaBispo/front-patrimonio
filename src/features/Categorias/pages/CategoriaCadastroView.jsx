import { useNavigate } from "react-router-dom";

export default function CadastrarCategoriaPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9">
        <h3 className="text-primary/80 mb-2">Cadastrar Nova Categoria</h3>
      </div>

      <div className="overflow-hidden bg-bg-secondary px-4 py-3 card">
        <div className="flex flex-col mb-5 md:flex-row gap-5">
          <div className="flex-1">
            <label>Nome</label>
            <input className="input-utilities" type="text" placeholder="Nome" />
          </div>

          <div className="flex-1">
            <label htmlFor="perfil">Tipo</label>

            <select id="perfil" name="perfil" className="input-utilities">
              <option value="">Selecione</option>
              <option value="AC">Acessório</option>
              <option value="AT">Ativo</option>
              <option value="CO">Consumível</option>
              <option value="LI">Licença</option>
              <option value="CP">Componente</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col mb-5 md:flex-row gap-5">
          <div className="flex-1">
            <label>Nota</label>
            <textarea
              className="input-utilities"
              name="comentario"
              rows="5"
              cols="40"
              maxlength="500"
              placeholder="Adicionar uma nota..."
            ></textarea>
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

        <button type="button" className="btn-primary bg-primary px-8">
          Salvar
        </button>
      </div>
    </div>
  );
}

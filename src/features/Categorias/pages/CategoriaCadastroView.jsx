import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCadastroCategoriaHook } from "../hooks/useCadastroCategoriaHook";
import ErrorLabel from "../../../shared/components/ErrorLabel";
import { toast } from "react-toastify";

export default function CadastrarCategoriaPage() {
  const navigate = useNavigate();
  const { cadastro, error, inputsErrors, isLoading } =
    useCadastroCategoriaHook();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [nota, setNota] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const sucesso = await cadastro({
        nome,
        tipo,
        nota,
      });

      if (!sucesso) return;

      toast.success("Registro salvo!");
      navigate("/categorias");
    } catch (e) {
      toast.error(e?.message ?? error ?? "Não foi possível cadastrar a categoria");
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9">
        <h3 className="text-primary/80 mb-2">Cadastrar Nova Categoria</h3>
      </div>

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
              {inputsErrors?.nome && (
                <ErrorLabel>{inputsErrors.nome}</ErrorLabel>
              )}
            </div>

            <div className="flex-1">
              <label htmlFor="tipo">Tipo</label>
              <select
                id="tipo"
                name="tipo"
                className="input-utilities"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="AC">Acessório</option>
                <option value="AT">Ativo</option>
                <option value="CO">Consumível</option>
                <option value="LI">Licença</option>
                <option value="CP">Componente</option>
              </select>
              {inputsErrors?.tipo && (
                <ErrorLabel>{inputsErrors.tipo}</ErrorLabel>
              )}
            </div>
          </div>

          <div className="flex flex-col mb-5 md:flex-row gap-5">
            <div className="flex-1">
              <label htmlFor="nota">Nota</label>
              <textarea
                id="nota"
                className="input-utilities"
                name="nota"
                rows={5}
                maxLength={500}
                placeholder="Adicionar uma nota..."
                value={nota}
                onChange={(e) => setNota(e.target.value)}
              />
            </div>
            {inputsErrors?.nota && <ErrorLabel>{inputsErrors.nota}</ErrorLabel>}
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
    </div>
  );
}

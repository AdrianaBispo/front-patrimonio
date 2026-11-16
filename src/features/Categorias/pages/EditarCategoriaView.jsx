import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormularioCategoria } from "../components/FormularioCategoria";
import { useCadastroCategoriaHook } from "../hooks/useCadastroCategoriaHook";

export default function EditarCategoriaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [nota, setNota] = useState("");

  const { getCategoria, editarCategoria, error, inputsErrors, isLoading } =
    useCadastroCategoriaHook();

  useEffect(() => {
    const getCategoriaById = async () => {
      if (!id) return;

      try {
        const categoriaById = await getCategoria(nome,id);
        setNome(categoriaById.data[0].nome);
        setNota(categoriaById.data[0].nota ?? "");
        setTipo(categoriaById.data[0].tipo);
      } catch (error) {
        console.error("Erro ao buscar categoria:", error);
      }
    };

    getCategoriaById();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const sucesso = await editarCategoria({
        id,
        nome,
        tipo,
        nota: nota,
      });
      toast.success("Registro salvo!");
      navigate(-1);
    } catch (e) {
      toast.error(error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9">
        <h3 className="text-primary/80 mb-2">Editar Categoria</h3>
      </div>
      <FormularioCategoria
        nome={nome}
        setNome={setNome}
        tipo={tipo}
        setTipo={setTipo}
        nota={nota}
        setNota={setNota}
        isLoading={isLoading}
        inputsErrors={inputsErrors}
        handleSubmit={handleSubmit}
        navigate={navigate}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { FormularioCategoria } from "../components/FormularioCategoria";
import { useCadastroCategoriaHook } from "../hooks/useCadastroCategoriaHook";

export default function EditarCategoriaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [nota, setNota] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  const { getCategoria, editarCategoria, error, inputsErrors, isLoading } =
    useCadastroCategoriaHook();

  useEffect(() => {
    const getCategoriaById = async () => {
      if (!id) {
        navigate("/categorias", { replace: true });
        return;
      }

      setIsLoadingData(true);

      try {
        const categoriaById = await getCategoria("", id);
        const item = Array.isArray(categoriaById?.data)
          ? categoriaById.data[0]
          : Array.isArray(categoriaById)
            ? categoriaById[0]
            : categoriaById;

        if (!item) {
          throw new Error("Categoria não encontrada");
        }

        setNome(item.nome ?? "");
        setNota(item.nota ?? "");
        setTipo(item.tipo ?? "");
      } catch (err) {
        toast.error(
          err?.message ?? error ?? "Não foi possível carregar a categoria",
        );
        navigate("/categorias", { replace: true });
      } finally {
        setIsLoadingData(false);
      }
    };

    getCategoriaById();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!id) return;

    try {
      const sucesso = await editarCategoria(id, {
        nome,
        tipo,
        nota,
      });

      if (!sucesso) return;

      toast.success("Registro salvo!");
      navigate("/categorias");
    } catch (err) {
      toast.error(err?.message ?? error ?? "Não foi possível editar a categoria");
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
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

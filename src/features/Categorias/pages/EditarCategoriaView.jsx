import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormularioCategoria } from "../components/FormularioCategoria";
import { useCadastroCategoriaHook } from "../hooks/useCadastroCategoriaHook";

export default function EditarCategoriaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [nota, setNota] = useState("");
  
  const { cadastro, error, inputsErrors, isLoading } =
    useCadastroCategoriaHook();

  async function handleSubmit(e) {
    e.preventDefault();
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

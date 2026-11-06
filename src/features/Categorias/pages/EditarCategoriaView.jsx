import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

export default function EditarCategoriaPage() {
  const { id } = useParams();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [nota, setNota] = useState("");

  return(
  <div className="max-w-7xl mx-auto">
    <div className="gap-2 mb-9">
      <h3 className="text-primary/80 mb-2">Editar Categoria</h3>
    </div>
  </div>
  );
}

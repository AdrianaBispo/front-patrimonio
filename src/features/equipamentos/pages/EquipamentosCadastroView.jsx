import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormularioEquipamento } from "../components/FormularioEquipamento";
import { useEquipamentoHook } from "../hooks/useEquipamentoHook";

export default function EquipamentoCadastroView() {
  const navigate = useNavigate();
  const {
    cadastrarEquipamento,
    carregarOpcoesFormulario,
    listaStatus,
    listaUsuarios,
    isLoading,
    isLoadingOpcoes,
    inputsErrors,
  } = useEquipamentoHook();

  const [nome, setNome] = useState("");
  const [serie, setSerie] = useState("");
  const [statusId, setStatusId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    const carregar = async () => {
      try {
        await carregarOpcoesFormulario();
      } catch (err) {
        toast.error(err?.message ?? "Ocorreu um erro ao carregar os dados");
      }
    };

    carregar();
  }, [carregarOpcoesFormulario]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const result = await cadastrarEquipamento({
        nome,
        serie,
        status_id: statusId,
        usuario_id: usuarioId,
        descricao,
        imagem_url: null,
      });

      if (!result) return;

      toast.success("Equipamento cadastrado com sucesso!");
      navigate(-1);
    } catch (err) {
      toast.error(err?.message ?? "Ocorreu um erro ao cadastrar o equipamento");
    }
  }

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file.size >= 5 * 1024 * 1024) {
      toast.error('Arquivo inválido. Por favor, selecione uma imagem menor que 5MB.');
      return;
    }
    else if (file.size > 0 && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file));
    } else {
      setSelectedImage(null);
      toast.error('Arquivo inválido. Por favor, selecione uma imagem válida.');
    }
  };

  if (isLoadingOpcoes) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9">
        <h3 className="text-primary/80 mb-2">Cadastrar Equipamento</h3>
        <p>
          Inicializar um novo equipamento no sistema central de gerenciamento de
          inventário.
        </p>
      </div>

      <FormularioEquipamento
        nome={nome}
        setNome={setNome}
        serie={serie}
        setSerie={setSerie}
        statusId={statusId}
        setStatusId={setStatusId}
        usuarioId={usuarioId}
        setUsuarioId={setUsuarioId}
        descricao={descricao}
        setDescricao={setDescricao}
        listaStatus={listaStatus}
        listaUsuarios={listaUsuarios}
        isLoading={isLoading}
        inputsErrors={inputsErrors}
        handleSubmit={handleSubmit}
        navigate={navigate}
        submitLabel="Criar Equipamento"
        selectedImage={selectedImage}
        handleChangeImage={handleChangeImage}
      />
    </div>
  );
}

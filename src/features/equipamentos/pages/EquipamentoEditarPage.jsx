import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FormularioEquipamento } from "../components/FormularioEquipamento";
import { useEquipamentoHook } from "../hooks/useEquipamentoHook";

function extrairListaEquipamentos(result) {
  if (Array.isArray(result?.equipamentos)) return result.equipamentos;
  if (Array.isArray(result?.equipamentos?.data)) return result.equipamentos.data;
  if (Array.isArray(result?.data?.data)) return result.data.data;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result)) return result;
  return [];
}

export default function EquipamentoEditarPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    listarEquipamentos,
    carregarOpcoesFormulario,
    editarEquipamento,
    listaStatus,
    listaUsuarios,
    isLoading,
    inputsErrors,
  } = useEquipamentoHook();

  const [nome, setNome] = useState("");
  const [serie, setSerie] = useState("");
  const [statusId, setStatusId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemAtual, setImagemAtual] = useState(null);
  const [imagemFile, setImagemFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      if (!id) return;

      try {
        const [, listaRes] = await Promise.all([
          carregarOpcoesFormulario(),
          listarEquipamentos(1, 0),
        ]);

        const lista = extrairListaEquipamentos(listaRes);
        const registro =
          lista.find((item) => String(item.id) === String(id)) ??
          location.state?.equipamento ??
          null;

        if (!registro) {
          toast.error("Equipamento não encontrado");
          navigate(-1);
          return;
        }

        setNome(registro.nome ?? "");
        setSerie(String(registro.serie ?? ""));
        setStatusId(
          registro.status_id != null ? String(registro.status_id) : "",
        );
        setUsuarioId(
          registro.usuario_id != null ? String(registro.usuario_id) : "",
        );
        setDescricao(registro.descricao ?? "");
        setImagemAtual(registro.imagem_url ?? null);
        setSelectedImage(registro.imagem_url ?? null);
      } catch (err) {
        toast.error(err?.message ?? "Ocorreu um erro ao carregar o equipamento");
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [id, carregarOpcoesFormulario, listarEquipamentos, navigate, location.state]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!id) return;

    try {
      const result = await editarEquipamento(id, {
        nome,
        serie,
        status_id: statusId,
        usuario_id: usuarioId,
        descricao,
        imagem_url: imagemAtual,
        imagem_file: imagemFile,
      });

      if (!result) return;

      toast.success("Equipamento atualizado com sucesso!");
      navigate(-1);
    } catch (err) {
      toast.error(err?.message ?? "Ocorreu um erro ao atualizar o equipamento");
    }
  }

  const handleChangeImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedImage(imagemAtual);
      setImagemFile(null);
      return;
    }

    if (file.size >= 5 * 1024 * 1024) {
      toast.error("Arquivo inválido. Por favor, selecione uma imagem menor que 5MB.");
      return;
    }

    const tipoOk =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png";

    if (file.size > 0 && tipoOk) {
      setSelectedImage(URL.createObjectURL(file));
      setImagemFile(file);
    } else {
      setSelectedImage(imagemAtual);
      setImagemFile(null);
      toast.error("Selecione uma imagem JPG ou PNG válida.");
    }
  };

  if (carregando) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-9 gap-2">
        <h3 className="mb-2 text-primary/80">Editar Equipamento</h3>
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
        submitLabel="Salvar"
        selectedImage={selectedImage}
        handleChangeImage={handleChangeImage}
      />
    </div>
  );
}

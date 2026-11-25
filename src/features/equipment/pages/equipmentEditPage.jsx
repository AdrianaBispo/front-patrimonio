import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { EquipmentForm } from "../components/EquipmentForm";
import { useEquipmentHook } from "../hooks/useEquipmentHook";

function extrairListaEquipamentos(result) {
  if (result?.meta && Array.isArray(result?.data)) {
    return result.data;
  }

  const paginator =
    result?.equipamentos?.current_page != null
      ? result.equipamentos
      : result?.data?.current_page != null
        ? result.data
        : null;

  if (Array.isArray(paginator?.data)) {
    return paginator.data;
  }

  if (Array.isArray(result?.equipamentos)) return result.equipamentos;
  if (Array.isArray(result?.equipamentos?.data)) return result.equipamentos.data;
  if (Array.isArray(result?.data?.data)) return result.data.data;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result)) return result;
  return [];
}

function mesmoEquipamento(item, id) {
  if (!item || id == null) return false;
  const alvo = String(id);
  return String(item.eqi_id ?? item.id ?? "") === alvo;
}

function valorCampo(registro, ...chaves) {
  for (const chave of chaves) {
    const valor = registro?.[chave];
    if (valor != null && valor !== "") return valor;
  }
  return "";
}

export default function EquipmentEditPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    listEquipment,
    loadFormOptions,
    updateEquipment,
    listaStatus,
    listaUsuarios,
    listaCategorias,
    listaTipos,
    isLoading,
    inputsErrors,
  } = useEquipmentHook();

  const [nome, setNome] = useState("");
  const [serie, setSerie] = useState("");
  const [statusId, setStatusId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [tipoEquipamentoId, setEquipmentTypeId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemAtual, setImagemAtual] = useState(null);
  const [imagemFile, setImagemFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      if (!id) return;

      setCarregando(true);

      try {
        const doState = location.state?.equipamento;
        const doClique = mesmoEquipamento(doState, id) ? doState : null;

        let registro = doClique;

        if (!registro) {
          const [, listaRes] = await Promise.all([
            loadFormOptions(),
            listEquipment(1, 0),
          ]);
          const lista = extrairListaEquipamentos(listaRes);
          registro = lista.find((item) => mesmoEquipamento(item, id)) ?? null;
        } else {
          await loadFormOptions();
        }

        if (!registro) {
          toast.error("Equipamento não encontrado");
          navigate("/equipamentos", { replace: true });
          return;
        }

        // Campos conforme retorno da API
        setNome(String(valorCampo(registro, "eqi_name", "eqi_nome", "nome")));
        setSerie(String(valorCampo(registro, "eqi_serie", "serie")));
        setStatusId(String(valorCampo(registro, "eqi_status_id", "status_id")));
        setCategoriaId(
          String(valorCampo(registro, "categoria_id", "eqi_categoria_id")),
        );
        setEquipmentTypeId(
          String(
            valorCampo(registro, "tipo_equipamento_id", "eqi_tipo_equipamento_id"),
          ),
        );
        setUsuarioId(String(valorCampo(registro, "usuario_id")));
        setDescricao(
          String(valorCampo(registro, "eqi_descricao", "descricao")),
        );

        const imagem = valorCampo(registro, "imagem_url") || null;
        setImagemAtual(imagem);
        setSelectedImage(imagem);
      } catch (err) {
        toast.error(err?.message ?? "Ocorreu um erro ao carregar o equipamento");
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!id) return;

    try {
      const result = await updateEquipment(
        id,
        {
          eqi_name: nome,
          eqi_descricao: descricao,
          eqi_serie: serie,
          eqi_status_id: statusId,
          categoria_id: categoriaId,
          tipo_equipamento_id: tipoEquipamentoId,
          usuario_id: usuarioId,
          imagem_url: imagemAtual,
        },
        imagemFile,
      );

      if (!result) return;

      toast.success("Equipamento atualizado com sucesso!");
      navigate("/equipamentos");
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

      <EquipmentForm
        nome={nome}
        setNome={setNome}
        serie={serie}
        setSerie={setSerie}
        statusId={statusId}
        setStatusId={setStatusId}
        categoriaId={categoriaId}
        setCategoriaId={setCategoriaId}
        tipoEquipamentoId={tipoEquipamentoId}
        setEquipmentTypeId={setEquipmentTypeId}
        usuarioId={usuarioId}
        setUsuarioId={setUsuarioId}
        descricao={descricao}
        setDescricao={setDescricao}
        listaStatus={listaStatus}
        listaCategorias={listaCategorias}
        listaTipos={listaTipos}
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

import { useCallback, useState } from "react";
import axios from "axios";
import { z } from "zod";
import equipamentService from "../services/equipamentService";
import statusService from "../../status/services/statusService";
import userService from "../../user/services/userService";
import categoriaService from "../../Categorias/services/categoriaService";
import { tipoEquipamentoService } from "../../tipoEquipamento/services/tipoEquipamentoService";
import { Status } from "../../status/types/status.types";
import { UsuarioParaSelecao } from "../../user/types/user";
import { Equipamento } from "../types/equipament.type";
import { EquipamentoError } from "../types/equipamentoError.types";
import historicoEquipamentoService from "../../historicoEquipamentos/services/historicoEquipamentoService";

export type OpcaoSelect = {
  id: string | number;
  nome: string;
};

const equipamentoSchema = z.object({
  eqi_name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(255, "Nome deve ter no máximo 255 caracteres"),
  eqi_descricao: z
    .string()
    .trim()
    .min(1, "Descrição é obrigatória")
    .max(255, "Descrição deve ter no máximo 255 caracteres"),
  eqi_serie: z
    .string()
    .trim()
    .min(1, "Número de série é obrigatório")
    .max(255, "Número de série deve ter no máximo 255 caracteres")
    .regex(/^\d+$/, "Número de série deve conter apenas dígitos"),
  eqi_status_id: z.coerce
    .number({ error: "Status é obrigatório" })
    .int("Status inválido")
    .positive("Status é obrigatório"),
  categoria_id: z.coerce
    .number({ error: "Categoria é obrigatória" })
    .int("Categoria inválida")
    .positive("Categoria é obrigatória"),
  tipo_equipamento_id: z.coerce
    .number({ error: "Tipo de equipamento é obrigatório" })
    .int("Tipo de equipamento inválido")
    .positive("Tipo de equipamento é obrigatório"),
  imagem_url: z
    .union([z.string(), z.null(), z.undefined()])
    .optional()
    .transform((val) => {
      if (val == null) return null;
      const trimmed = String(val).trim();
      return trimmed.length > 0 ? trimmed : null;
    }),
  usuario_id: z
    .string()
    .trim()
    .min(1, "Usuário é obrigatório")
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      "Usuário inválido"
    ),
});

function extrairLista(resposta: unknown, chaves: string[] = []): Record<string, unknown>[] {
  if (Array.isArray(resposta)) return resposta as Record<string, unknown>[];
  if (!resposta || typeof resposta !== "object") return [];

  const obj = resposta as Record<string, unknown>;
  for (const chave of chaves) {
    if (Array.isArray(obj[chave])) {
      return obj[chave] as Record<string, unknown>[];
    }
  }

  if (obj.data && typeof obj.data === "object") {
    if (Array.isArray(obj.data)) return obj.data as Record<string, unknown>[];
    const dataObj = obj.data as Record<string, unknown>;
    if (Array.isArray(dataObj.data)) return dataObj.data as Record<string, unknown>[];
  }

  return [];
}

function extrairMensagemHttp(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const serverMessage = err.response?.data?.message;
    if (typeof serverMessage === "string" && serverMessage.trim()) {
      return serverMessage;
    }

    switch (err.response?.status) {
      case 400:
        return "Status ou usuário inexistente";
      case 401:
        return "Sessão expirada ou não autenticada";
      case 403:
        return "Você não tem permissão para realizar esta ação";
      case 404:
        return "Equipamento não encontrado";
      case 422:
        return "Dados inválidos. Verifique os campos informados";
      case 500:
        return "Ocorreu um erro interno no servidor";
      default:
        return fallback;
    }
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
}

export function useEquipamentoHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOpcoes, setIsLoadingOpcoes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputsErrors, setInputsErrors] = useState<EquipamentoError>({});
  const [listaStatus, setListaStatus] = useState<Status[]>([]);
  const [listaUsuarios, setListaUsuarios] = useState<UsuarioParaSelecao[]>([]);
  const [listaCategorias, setListaCategorias] = useState<OpcaoSelect[]>([]);
  const [listaTipos, setListaTipos] = useState<OpcaoSelect[]>([]);

  const listarEquipamentos = useCallback(async (
    page = 1,
    perPage = 0,
    nome = "",
    serie = "",
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await equipamentService.getAllEquipamentos(
        page,
        perPage,
        nome,
        serie,
      );
      return result;
    } catch (err) {
      const message = extrairMensagemHttp(err, "Ocorreu um erro ao carregar os equipamentos");
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const buscarEquipamentos = useCallback(async (
    nome = "",
    serie = "",
    pagina = 1,
    porPagina = 0,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await equipamentService.searchEquipamentos(
        nome,
        serie,
        pagina,
        porPagina,
      );
      return result;
    } catch (err) {
      const message = extrairMensagemHttp(err, "Ocorreu um erro ao buscar os equipamentos");
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const carregarOpcoesFormulario = useCallback(async () => {
    setIsLoadingOpcoes(true);
    setError(null);

    try {
      const [statusRes, usuariosRes, categoriasRes, tiposRes] = await Promise.all([
        statusService.listarStatus(),
        userService.listarUsuarios(),
        categoriaService.getCategoria("", null, 1, 0),
        tipoEquipamentoService.getTipoEquipamento("", "", 1),
      ]);

      const rawStatus = extrairLista(statusRes, ["status", "statuses", "data"]);
      const statusFormatados: Status[] = rawStatus
        .filter((item) => item?.id != null)
        .map((item) => ({
          id: Number(item.id),
          nome: String(item.nome ?? item.name ?? item.descricao ?? `Status #${item.id}`),
        }));

      const rawUsuarios = extrairLista(usuariosRes, ["users", "usuarios", "data"]);
      const usuariosFormatados: UsuarioParaSelecao[] = rawUsuarios
        .filter((item) => item?.id != null)
        .map((item) => ({
          id: String(item.id),
          nome: String(item.nome ?? item.name ?? item.email ?? item.id),
        }));

      const rawCategorias = extrairLista(categoriasRes, [
        "categorias",
        "categoria",
        "data",
      ]);
      const categoriasFormatadas: OpcaoSelect[] = rawCategorias
        .filter((item) => item?.id != null)
        .map((item) => ({
          id: item.id as string | number,
          nome: String(item.nome ?? item.name ?? `Categoria #${item.id}`),
        }));

      const rawTipos = extrairLista(tiposRes, [
        "tipo_equipamentos",
        "tipos",
        "data",
      ]);
      const tiposFormatados: OpcaoSelect[] = rawTipos
        .filter((item) => item?.id != null)
        .map((item) => ({
          id: item.id as string | number,
          nome: String(item.nome ?? item.name ?? `Tipo #${item.id}`),
        }));

      setListaStatus(statusFormatados);
      setListaUsuarios(usuariosFormatados);
      setListaCategorias(categoriasFormatadas);
      setListaTipos(tiposFormatados);

      return {
        listaStatus: statusFormatados,
        listaUsuarios: usuariosFormatados,
        listaCategorias: categoriasFormatadas,
        listaTipos: tiposFormatados,
      };
    } catch (err) {
      const message = extrairMensagemHttp(
        err,
        "Ocorreu um erro ao carregar as opções do formulário",
      );
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoadingOpcoes(false);
    }
  }, []);

  const mapearErroCampo = (campo: string): keyof EquipamentoError => {
    const mapa: Record<string, keyof EquipamentoError> = {
      eqi_name: "nome",
      eqi_nome: "nome",
      eqi_descricao: "descricao",
      eqi_serie: "serie",
      eqi_status_id: "status_id",
      image: "imagem_file",
      imagem: "imagem_file",
    };
    return mapa[campo] ?? (campo as keyof EquipamentoError);
  };

  const validarEFormatar = (dados: unknown): Equipamento | null => {
    const validar = equipamentoSchema.safeParse(dados);
    if (!validar.success) {
      const fieldErrors = z.flattenError(validar.error).fieldErrors;
      const errors: EquipamentoError = {};
      Object.entries(fieldErrors).forEach(([campo, mensagens]) => {
        const mensagem = mensagens?.[0];
        if (mensagem) {
          errors[mapearErroCampo(campo)] = mensagem;
        }
      });
      setInputsErrors(errors);
      return null;
    }

    setInputsErrors({});
    return {
      eqi_name: validar.data.eqi_name,
      eqi_descricao: validar.data.eqi_descricao,
      eqi_serie: validar.data.eqi_serie,
      eqi_status_id: validar.data.eqi_status_id,
      categoria_id: validar.data.categoria_id,
      tipo_equipamento_id: validar.data.tipo_equipamento_id,
      imagem_url: validar.data.imagem_url ?? null,
      usuario_id: validar.data.usuario_id,
    };
  };

  const tratarErroApi = (err: unknown, fallback: string): never | undefined => {
    if (axios.isAxiosError(err) && err.response?.status === 422) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors && typeof apiErrors === "object") {
        const errors: EquipamentoError = {};
        Object.entries(apiErrors).forEach(([campo, valor]) => {
          const mensagem = Array.isArray(valor) ? valor[0] : valor;
          if (typeof mensagem === "string") {
            errors[mapearErroCampo(campo)] = mensagem;
          }
        });
        if (Object.keys(errors).length > 0) {
          setInputsErrors(errors);
          return undefined;
        }
      }
    }

    const message = extrairMensagemHttp(err, fallback);
    setError(message);
    throw new Error(message);
  };

  const extrairUrlImagem = (resposta: unknown): string | null => {
    if (!resposta || typeof resposta !== "object") return null;
    const data = resposta as Record<string, unknown>;
    const nested =
      data.data && typeof data.data === "object"
        ? (data.data as Record<string, unknown>)
        : null;

    const url =
      data.imagepath ??
      data.image_path ??
      data.url ??
      data.imagem_url ??
      data.path ??
      nested?.imagepath ??
      nested?.url ??
      null;

    return url != null ? String(url) : null;
  };

  const uploadImage = useCallback(async (arquivo: File | null | undefined) => {
    if (!(arquivo instanceof File)) {
      setInputsErrors({ imagem_file: "A imagem é obrigatória" });
      return undefined;
    }

    try {
      const result = await equipamentService.uploadImage(arquivo);
      const url = extrairUrlImagem(result);
      if (!url) {
        throw new Error("Upload da imagem não retornou URL");
      }
      return url;
    } catch (err) {
      return tratarErroApi(err, "Erro ao fazer upload da imagem");
    }
  }, []);

  const cadastrarEquipamento = useCallback(
    async (dados: unknown, imagemFile?: File | null) => {
      setIsLoading(true);
      setError(null);

      const payload = validarEFormatar(dados);
      if (!payload) {
        setIsLoading(false);
        return undefined;
      }

      const imagemUrl = await uploadImage(imagemFile);
      if (!imagemUrl) {
        setIsLoading(false);
        return undefined;
      }

      const equipamento: Equipamento = {
        ...payload,
        imagem_url: imagemUrl,
      };

      try {
        const result = await equipamentService.createEquipamento(equipamento);
        const equipamentId = String(
          result?.eqi_id ?? result?.id ?? result?.data?.eqi_id ?? result?.data?.id ?? "",
        );
        const statusId = String(
          result?.eqi_status_id ??
            result?.status_id ??
            equipamento.eqi_status_id,
        );
        const userId = String(
          result?.usuario_id ?? equipamento.usuario_id,
        );

        if (equipamentId) {
          await historicoEquipamentoService.inserirHistorico(
            equipamentId,
            statusId,
            userId,
          );
        }

        return result;
      } catch (err) {
        return tratarErroApi(err, "Ocorreu um erro ao cadastrar o equipamento");
      } finally {
        setIsLoading(false);
      }
    },
    [uploadImage],
  );

  const editarEquipamento = useCallback(
    async (id: string | number, dados: unknown, imagemFile?: File | null) => {
      setIsLoading(true);
      setError(null);

      const payload = validarEFormatar(dados);
      if (!payload) {
        setIsLoading(false);
        return undefined;
      }

      let imagemUrl = payload.imagem_url;
      if (imagemFile instanceof File) {
        const uploaded = await uploadImage(imagemFile);
        if (!uploaded) {
          setIsLoading(false);
          return undefined;
        }
        imagemUrl = uploaded;
      }

      const equipamento: Equipamento = {
        ...payload,
        imagem_url: imagemUrl,
      };

      try {
        const result = await equipamentService.updateEquipamento(id, equipamento);
        const equipamentId = String(result?.eqi_id ?? result?.id ?? id);
        const statusId = String(
          result?.eqi_status_id ??
            result?.status_id ??
            equipamento.eqi_status_id,
        );
        const userId = String(
          result?.usuario_id ?? equipamento.usuario_id,
        );

        await historicoEquipamentoService.inserirHistorico(
          equipamentId,
          statusId,
          userId,
        );

        return result;
      } catch (err) {
        return tratarErroApi(err, "Ocorreu um erro ao atualizar o equipamento");
      } finally {
        setIsLoading(false);
      }
    },
    [uploadImage],
  );

  return {
    listarEquipamentos,
    buscarEquipamentos,
    carregarOpcoesFormulario,
    cadastrarEquipamento,
    editarEquipamento,
    listaStatus,
    listaUsuarios,
    listaCategorias,
    listaTipos,
    isLoading,
    isLoadingOpcoes,
    error,
    inputsErrors,
  };
}

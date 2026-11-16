import { useCallback, useState } from "react";
import axios from "axios";
import { z } from "zod";
import equipamentService from "../services/equipamentService";
import statusService from "../../status/services/statusService";
import userService from "../../user/services/userService";
import { Status } from "../../status/types/status.types";
import { UsuarioParaSelecao } from "../../user/types/user";
import { Equipamento } from "../types/equipament.type";
import { EquipamentoError } from "../types/equipamentoError.types";
import historicoEquipamentoService from "../../historicoEquipamentos/services/historicoEquipamentoService";

const equipamentoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(255, "Nome deve ter no máximo 255 caracteres"),
  descricao: z
    .string()
    .trim()
    .min(1, "Descrição é obrigatória")
    .max(255, "Descrição deve ter no máximo 255 caracteres"),
  serie: z
    .string()
    .trim()
    .min(1, "Número de série é obrigatório")
    .max(255, "Número de série deve ter no máximo 255 caracteres")
    .regex(/^\d+$/, "Número de série deve conter apenas dígitos"),
  status_id: z.coerce
    .number({ error: "Status é obrigatório" })
    .int("Status inválido")
    .positive("Status é obrigatório"),
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
      const [statusRes, usuariosRes] = await Promise.all([
        statusService.listarStatus(),
        userService.listarUsuarios(),
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

      setListaStatus(statusFormatados);
      setListaUsuarios(usuariosFormatados);

      return {
        listaStatus: statusFormatados,
        listaUsuarios: usuariosFormatados,
      };
    } catch (err) {
      const message = extrairMensagemHttp(err, "Ocorreu um erro ao carregar status e usuários");
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoadingOpcoes(false);
    }
  }, []);

  const validarEFormatar = (dados: unknown): Equipamento | null => {
    const validar = equipamentoSchema.safeParse(dados);
    if (!validar.success) {
      const fieldErrors = z.flattenError(validar.error).fieldErrors;
      const errors: EquipamentoError = {};
      Object.entries(fieldErrors).forEach(([campo, mensagens]) => {
        const mensagem = mensagens?.[0];
        if (mensagem) {
          errors[campo as keyof EquipamentoError] = mensagem;
        }
      });
      setInputsErrors(errors);
      return null;
    }

    setInputsErrors({});
    return {
      ...validar.data,
      imagem_url: validar.data.imagem_url ?? null,
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
            errors[campo as keyof EquipamentoError] = mensagem;
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

  const resolverImagem = useCallback(
    async (
      dados: Record<string, unknown>,
      payload: Equipamento,
      obrigatoria: boolean,
    ) => {
      const arquivo = dados.imagem_file;

      if (!(arquivo instanceof File)) {
        if (obrigatoria && !payload.imagem_url) {
          setInputsErrors({ imagem_file: "A imagem é obrigatória" });
          return undefined;
        }
        return payload;
      }

      try {
        const image = await equipamentService.uploadImage(arquivo);
        const url =
          image?.url ??
          image?.imagem_url ??
          image?.path ??
          image?.data?.url ??
          null;
        if (!url) {
          throw new Error("Upload da imagem não retornou URL");
        }
        payload.imagem_url = String(url);
        return payload;
      } catch (err) {
        return tratarErroApi(err, "Erro ao fazer upload da imagem");
      }
    },
    [],
  );

  const cadastrarEquipamento = useCallback(async (dados: unknown) => {
    setIsLoading(true);
    setError(null);

    const payload = validarEFormatar(dados);
    if (!payload) {
      setIsLoading(false);
      return undefined;
    }

    const dadosObj =
      dados && typeof dados === "object" ? (dados as Record<string, unknown>) : {};
    const payloadComImagem = await resolverImagem(dadosObj, payload, true);
    if (!payloadComImagem) {
      setIsLoading(false);
      return undefined;
    }

    try {
      const result = await equipamentService.createEquipamento(payloadComImagem);
      await historicoEquipamentoService.inserirHistorico(
        result.id,
        payloadComImagem.status_id.toString(),
        payloadComImagem.usuario_id.toString(),
      );
      return result;
    } catch (err) {
      return tratarErroApi(err, "Ocorreu um erro ao cadastrar o equipamento");
    } finally {
      setIsLoading(false);
    }
  }, [resolverImagem]);

  const editarEquipamento = useCallback(async (id: string | number, dados: unknown) => {
    setIsLoading(true);
    setError(null);

    const payload = validarEFormatar(dados);
    if (!payload) {
      setIsLoading(false);
      return undefined;
    }

    const dadosObj =
      dados && typeof dados === "object" ? (dados as Record<string, unknown>) : {};
    const payloadComImagem = await resolverImagem(dadosObj, payload, false);
    if (!payloadComImagem) {
      setIsLoading(false);
      return undefined;
    }

    try {
      const result = await equipamentService.updateEquipamento(id, payloadComImagem);
      await historicoEquipamentoService.inserirHistorico(
        result.id,
        payloadComImagem.status_id.toString(),
        payloadComImagem.usuario_id.toString(),
      );
      return result;
    } catch (err) {
      return tratarErroApi(err, "Ocorreu um erro ao atualizar o equipamento");
    } finally {
      setIsLoading(false);
    }
  }, [resolverImagem]);

  return {
    listarEquipamentos,
    buscarEquipamentos,
    carregarOpcoesFormulario,
    cadastrarEquipamento,
    editarEquipamento,
    listaStatus,
    listaUsuarios,
    isLoading,
    isLoadingOpcoes,
    error,
    inputsErrors,
  };
}

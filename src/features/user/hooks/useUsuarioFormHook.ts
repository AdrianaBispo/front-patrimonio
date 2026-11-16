import { useCallback, useState } from "react";
import axios from "axios";
import { z } from "zod";

import userService from "../services/userService";
import {
  Role,
  User,
  UsuarioFormData,
  UsuarioFormErrors,
} from "../types/user";

const camposBase = {
  nome: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(255, "Nome deve ter no máximo 255 caracteres"),
  celular: z
    .string()
    .trim()
    .min(1, "Celular é obrigatório")
    .max(20, "Celular deve ter no máximo 20 caracteres"),
  email: z
    .string()
    .trim()
    .min(1, "E-mail é obrigatório")
    .email("Informe um e-mail válido")
    .max(255, "E-mail deve ter no máximo 255 caracteres"),
};

const cadastroSchema = z.object({
  ...camposBase,
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
  role_id: z.string().min(1, "Perfil de acesso é obrigatório"),
});

const edicaoSchema = z.object({
  ...camposBase,
  password: z
    .string()
    .refine(
      (senha) => senha.length === 0 || senha.length >= 8,
      "A senha deve ter pelo menos 8 caracteres",
    )
    .optional(),
  role_id: z.string().optional(),
});

function mensagemErro(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;

    if (error.response?.status === 401) return "Sessão expirada";
    if (error.response?.status === 403) {
      return "Você não tem permissão para realizar esta ação";
    }
    if (error.response?.status === 404) return "Usuário não encontrado";
  }

  return fallback;
}

export function useUsuarioFormHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputsErrors, setInputsErrors] = useState<UsuarioFormErrors>({});
  const [roles, setRoles] = useState<Role[]>([]);

  const carregarRoles = useCallback(async () => {
    setIsLoadingData(true);
    setError(null);

    try {
      const result = await userService.listarRoles();
      setRoles(result);
      return result;
    } catch (err) {
      const message = mensagemErro(err, "Não foi possível carregar os perfis");
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const carregarUsuario = useCallback(async (id: string): Promise<User> => {
    setIsLoadingData(true);
    setError(null);

    try {
      const [usuario, listaRoles] = await Promise.all([
        userService.buscarUsuario(id),
        userService.listarRoles(),
      ]);

      if (!usuario) throw new Error("Usuário não encontrado");
      setRoles(listaRoles);
      return usuario;
    } catch (err) {
      const message =
        err instanceof Error && err.message === "Usuário não encontrado"
          ? err.message
          : mensagemErro(err, "Não foi possível carregar o usuário");
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const validar = (
    dados: UsuarioFormData,
    edicao: boolean,
  ): UsuarioFormData | null => {
    const result = (edicao ? edicaoSchema : cadastroSchema).safeParse(dados);

    if (!result.success) {
      const errors: UsuarioFormErrors = {};
      result.error.issues.forEach((issue) => {
        const campo = issue.path[0] as keyof UsuarioFormData;
        if (!errors[campo]) errors[campo] = issue.message;
      });
      setInputsErrors(errors);
      return null;
    }

    setInputsErrors({});
    return result.data;
  };

  const tratarErroApi = (err: unknown, fallback: string) => {
    if (axios.isAxiosError(err) && err.response?.status === 422) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors && typeof apiErrors === "object") {
        const errors: UsuarioFormErrors = {};
        Object.entries(apiErrors).forEach(([campoApi, valor]) => {
          const campo = campoApi === "roles" ? "role_id" : campoApi;
          const message = Array.isArray(valor) ? valor[0] : valor;
          if (typeof message === "string") {
            errors[campo as keyof UsuarioFormErrors] = message;
          }
        });
        if (Object.keys(errors).length) {
          setInputsErrors(errors);
          return undefined;
        }
      }
    }

    const message = mensagemErro(err, fallback);
    setError(message);
    throw new Error(message);
  };

  const cadastrarUsuario = useCallback(async (dados: UsuarioFormData) => {
    setIsLoading(true);
    setError(null);

    const payload = validar(dados, false);
    if (!payload) {
      setIsLoading(false);
      return undefined;
    }

    try {
      return await userService.cadastrarUsuario(payload);
    } catch (err) {
      return tratarErroApi(err, "Não foi possível cadastrar o usuário");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const editarUsuario = useCallback(
    async (id: string, dados: UsuarioFormData) => {
      setIsLoading(true);
      setError(null);

      const payload = validar(dados, true);
      if (!payload) {
        setIsLoading(false);
        return undefined;
      }

      try {
        return await userService.editarUsuario(id, payload);
      } catch (err) {
        return tratarErroApi(err, "Não foi possível editar o usuário");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    carregarRoles,
    carregarUsuario,
    cadastrarUsuario,
    editarUsuario,
    roles,
    isLoading,
    isLoadingData,
    error,
    inputsErrors,
  };
}

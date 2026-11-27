import { useCallback, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { UserExpiredException, UserNotFoundException, UserErrorException } from "../exceptions/userExceptions";

import userService from "../services/userService";
import {
  Role,
  User,
  UsuarioFormData,
  UsuarioFormErrors,
} from "../types/user.types";

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
  role_id: z.string().min(1, "Perfil de acesso é obrigatório"),
});

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return new UserExpiredException().message;
    }

    else if (error.response?.status === 403) {
      return new UserNotFoundException().message;
    }
    else {
      return new UserErrorException().message;
    }
  }
  else {
    return new UserErrorException().message;
  }
}

export function useUserFormHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputsErrors, setInputsErrors] = useState<UsuarioFormErrors>({});
  const [roles, setRoles] = useState<Role[]>([]);

  const loadRoles = useCallback(async () => {
    setIsLoadingData(true);
    setError(null);

    try {
      const result = await userService.listRoles();
      setRoles(result);
      return result;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const loadUser = useCallback(
    async (
      id: string,
    ): Promise<{ usuario: User; roles: Role[] }> => {
      setIsLoadingData(true);
      setError(null);

      try {
        const [resultUser, listaRoles] = await Promise.all([
          userService.getUser(id),
          userService.listRoles(),
        ]);
        const usuario = resultUser[0];
        setRoles(listaRoles);
        return { usuario, roles: listaRoles };
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoadingData(false);
      }
    },
    [],
  );

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


  const createUser = useCallback(async (dados: UsuarioFormData) => {
    setIsLoading(true);
    setError(null);

    const payload = validar(dados, false);
    if (!payload) {
      setIsLoading(false);
      return undefined;
    }

    try {
      return await userService.createUser(payload);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(
    async (id: string, dados: UsuarioFormData) => {
      setIsLoading(true);
      setError(null);

      const payload = validar(dados, true);
      if (!payload) {
        setIsLoading(false);
        return undefined;
      }

      try {
        return await userService.updateUser(id, payload);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    loadRoles,
    loadUser,
    createUser,
    updateUser,
    roles,
    isLoading,
    isLoadingData,
    error,
    inputsErrors,
  };
}

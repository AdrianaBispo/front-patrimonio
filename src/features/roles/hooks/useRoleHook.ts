import { useCallback, useState } from "react";
import axios from "axios";

import roleService from "../services/roleService";
import { CreateRolePayload, UpdateRolePayload } from "../types/role.types";

function getErrorMessage(
  error: unknown,
  fallback = "Ocorreu um erro ao carregar os perfis de acesso",
): string {
  if (axios.isAxiosError(error)) {
    const mensagem = error.response?.data?.message;
    if (typeof mensagem === "string" && mensagem.trim()) {
      return mensagem;
    }

    if (error.response?.status === 401) {
      return "Sessão expirada ou não autenticada";
    }

    if (error.response?.status === 403) {
      return "Você não tem permissão para esta operação nos perfis";
    }

    if (error.response?.status === 404) {
      return "Perfil de acesso não encontrado";
    }

    if (error.response?.status === 422) {
      return "Dados inválidos para o perfil de acesso";
    }
  }

  return fallback;
}

export function useRoleHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRoles = useCallback(async (page = 1, perPage = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      return await roleService.listRoles(page, perPage);
    } catch (err) {
      const mensagem = getErrorMessage(err);
      setError(mensagem);
      throw new Error(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRole = useCallback(async (payload: CreateRolePayload) => {
    setIsLoading(true);
    setError(null);

    try {
      return await roleService.createRole(payload);
    } catch (err) {
      const mensagem = getErrorMessage(
        err,
        "Ocorreu um erro ao criar o perfil de acesso",
      );
      setError(mensagem);
      throw new Error(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRolePermissions = useCallback(async (id: string | number) => {
    setIsLoadingData(true);
    setError(null);

    try {
      return await roleService.getRolePermissions(id);
    } catch (err) {
      const mensagem = getErrorMessage(
        err,
        "Ocorreu um erro ao carregar as permissões do perfil",
      );
      setError(mensagem);
      throw new Error(mensagem);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const updateRole = useCallback(
    async (id: string | number, payload: UpdateRolePayload) => {
      setIsLoading(true);
      setError(null);

      try {
        return await roleService.updateRole(id, payload);
      } catch (err) {
        const mensagem = getErrorMessage(
          err,
          "Ocorreu um erro ao atualizar o perfil de acesso",
        );
        setError(mensagem);
        throw new Error(mensagem);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    listRoles,
    createRole,
    getRolePermissions,
    updateRole,
    isLoading,
    isLoadingData,
    error,
  };
}

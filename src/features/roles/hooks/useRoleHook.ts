import { useCallback, useState } from "react";
import axios from "axios";

import roleService from "../services/roleService";
import { CreateRolePayload, UpdateRolePayload } from "../types/role.types";

function obterMensagemErro(
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

  const listarRoles = useCallback(async (page = 1, perPage = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      return await roleService.listarRoles(page, perPage);
    } catch (err) {
      const mensagem = obterMensagemErro(err);
      setError(mensagem);
      throw new Error(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const criarRole = useCallback(async (payload: CreateRolePayload) => {
    setIsLoading(true);
    setError(null);

    try {
      return await roleService.criarRole(payload);
    } catch (err) {
      const mensagem = obterMensagemErro(
        err,
        "Ocorreu um erro ao criar o perfil de acesso",
      );
      setError(mensagem);
      throw new Error(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const buscarPermissoesRole = useCallback(async (id: string | number) => {
    setIsLoadingData(true);
    setError(null);

    try {
      return await roleService.buscarPermissoesRole(id);
    } catch (err) {
      const mensagem = obterMensagemErro(
        err,
        "Ocorreu um erro ao carregar as permissões do perfil",
      );
      setError(mensagem);
      throw new Error(mensagem);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const atualizarRole = useCallback(
    async (id: string | number, payload: UpdateRolePayload) => {
      setIsLoading(true);
      setError(null);

      try {
        return await roleService.atualizarRole(id, payload);
      } catch (err) {
        const mensagem = obterMensagemErro(
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
    listarRoles,
    criarRole,
    buscarPermissoesRole,
    atualizarRole,
    isLoading,
    isLoadingData,
    error,
  };
}

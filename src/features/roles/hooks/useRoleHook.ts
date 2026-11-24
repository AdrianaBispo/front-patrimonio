import { useCallback, useState } from "react";
import axios from "axios";

import roleService from "../services/roleService";

function obterMensagemErro(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const mensagem = error.response?.data?.message;
    if (typeof mensagem === "string" && mensagem.trim()) {
      return mensagem;
    }

    if (error.response?.status === 401) {
      return "Sessão expirada ou não autenticada";
    }

    if (error.response?.status === 403) {
      return "Você não tem permissão para consultar os perfis";
    }
  }

  return "Ocorreu um erro ao carregar os perfis de acesso";
}

export function useRoleHook() {
  const [isLoading, setIsLoading] = useState(false);
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

  return {
    listarRoles,
    isLoading,
    error,
  };
}

import { useCallback, useState } from "react";
import axios from "axios";

import permissionService from "../services/permissionService";
import { Permission } from "../types/permission.types";

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
      return "Você não tem permissão para consultar as permissões";
    }
  }

  return "Ocorreu um erro ao carregar as permissões";
}

export function usePermission() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissoes, setPermissoes] = useState<Permission[]>([]);

  const listarPermissoes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await permissionService.listarPermissoes();
      setPermissoes(result);
      return result;
    } catch (err) {
      const mensagem = obterMensagemErro(err);
      setError(mensagem);
      throw new Error(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    listarPermissoes,
    permissoes,
    isLoading,
    error,
  };
}

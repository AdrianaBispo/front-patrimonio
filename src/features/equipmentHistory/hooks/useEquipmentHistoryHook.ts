import { useCallback, useState } from "react";
import axios from "axios";
import equipmentHistoryService from "../services/equipmentHistoryService";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const mensagem = error.response?.data?.message;
    if (typeof mensagem === "string" && mensagem.trim()) {
      return mensagem;
    }

    if (error.response?.status === 401) {
      return "Sessão expirada ou não autenticada";
    }

    if (error.response?.status === 403) {
      return "Você não tem permissão para consultar o histórico";
    }
  }

  return "Ocorreu um erro ao carregar o histórico de equipamentos";
}

export function useEquipmentHistoryHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listHistory = useCallback(async (page = 1, perPage = 0) => {
    setIsLoading(true);
    setError(null);

    try {
      return await equipmentHistoryService.listHistory(page, perPage);
    } catch (err) {
      const mensagem = getErrorMessage(err);
      setError(mensagem);
      throw new Error(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { listHistory, isLoading, error };
}

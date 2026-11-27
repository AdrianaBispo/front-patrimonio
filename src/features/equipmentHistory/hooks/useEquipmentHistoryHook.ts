import { useCallback, useState } from "react";
import axios from "axios";
import equipmentHistoryService from "../services/equipmentHistoryService";
import {
  EquipmentHistoryErrorException,
  EquipmentHistoryExpiredException,
  EquipmentHistoryForbiddenException,
} from "../exceptions/equipmentHistoryExceptions";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return new EquipmentHistoryExpiredException().message;
    }

    if (error.response?.status === 403) {
      return new EquipmentHistoryForbiddenException().message;
    }
  }

  return new EquipmentHistoryErrorException().message;
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

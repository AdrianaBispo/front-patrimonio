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
  const [paginator, setPaginator] = useState<{ currentPage: number, lastPage: number, total: number, from: number, to: number }>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const listHistory = useCallback(async (page = 1, perPage = 0) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await equipmentHistoryService.listHistory(page, perPage);
      const history = result?.historic_equipaments ?? result;
     
      setPaginator({
        currentPage: history?.current_page ?? 1,
        lastPage: history?.last_page ?? 1,
        total: history?.total ?? 0,
        from: history?.from ?? 0,
        to: history?.to ?? 0,
      });
      return history;
    } catch (err) {
      const mensagem = getErrorMessage(err);
      setError(mensagem);
      throw new Error(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { listHistory, isLoading, error, paginator };
}

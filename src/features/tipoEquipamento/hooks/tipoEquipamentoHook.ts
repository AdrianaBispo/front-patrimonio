import { useState, useCallback } from "react";
import axios from "axios";
import { TipoEquipamento } from "../types/tipoEquipamento.types";
import { tipoEquipamentoService } from "../services/tipoEquipamentoService";

export function useTipoEquipamentoHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRegisters = useCallback(async (): Promise<TipoEquipamento[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const result: TipoEquipamento[] = await tipoEquipamentoService.getTipoEquipamento();
      return result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Ocorreu um erro interno no servidor";
        setError(message);
      } else {
        setError("Ocorreu um erro ao obter os dados");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deactivateTipoEquipamento = async (idTipoEquipamento: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await tipoEquipamentoService.deleteTipoEquipamento(idTipoEquipamento);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Ocorreu um erro interno no servidor";
        setError(message);
      } else {
        setError("Ocorreu um erro ao obter os dados");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const searchTipoEquipamento = async (name: string, id:string | null) => {
    setIsLoading(true);
    setError(null);

    try {
     const result: TipoEquipamento[] = await tipoEquipamentoService.getTipoEquipamento(name, id);
     return result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Ocorreu um erro interno no servidor";
        setError(message);
      } else {
        setError("Ocorreu um erro ao obter os dados");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  return { getRegisters, deactivateTipoEquipamento, searchTipoEquipamento, isLoading, error };
}

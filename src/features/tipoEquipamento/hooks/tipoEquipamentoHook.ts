import { useState, useCallback } from "react";
import axios from "axios";
import { TipoEquipamento } from "../types/tipoEquipamento.types";
import { tipoEquipamentoService } from "../services/tipoEquipamentoService";
import { z } from "zod";
import { TipoEquipamentoError } from "../types/tipoEquipamentoErro.types";

export function useTipoEquipamentoHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nome, setNome] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [ativo, setAtivo] = useState<boolean>(true);
  const [inputsErrors, setInputsErrors] = useState<Record<string, string>>({});

  const tipoEquipamentoSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório")
      .max(70, "Nome deve ter no máximo 70 caracteres"),
    descricao: z.string().min(1, "Descrição é obrigatória").
      max(150, "Descrição deve ter no máximo 150 caracteres"),
    ativo: z.boolean().default(true),
  });


  const getRegisters = useCallback(async (nomeFilter: string, idFilter: string): Promise<TipoEquipamento[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const result: TipoEquipamento[] = await tipoEquipamentoService.getTipoEquipamento(nomeFilter, idFilter);
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

  const searchTipoEquipamento = async (name: string, id: string | null) => {
    setIsLoading(true);
    setError(null);

    try {
      const result: TipoEquipamento[] = await tipoEquipamentoService.getTipoEquipamento(name, id ?? "");
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

  const cadastro = useCallback(async (tipoEquipamento: TipoEquipamento) => {
    setIsLoading(true);
    setError(null);
    const validar = tipoEquipamentoSchema.safeParse(tipoEquipamento);
    if (!validar.success) {
      const errors: TipoEquipamentoError = {};
      validar.error.issues.forEach((issue) => {
        const campo = issue.path[0] as keyof TipoEquipamentoError;
        errors[campo] = issue.message;
      });
      setInputsErrors(errors);
      setIsLoading(false);
      return;
    }
    try {
      const result = await tipoEquipamentoService.createTipoEquipamento(tipoEquipamento);
      return result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ?? "Ocorreu um erro interno no servidor";
        setError(message);
      } else {
        setError("Ocorreu um erro ao cadastrar o tipo de equipamento");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }

  }, []);

  return {cadastro, getRegisters, deactivateTipoEquipamento, searchTipoEquipamento, isLoading, error, inputsErrors };
};

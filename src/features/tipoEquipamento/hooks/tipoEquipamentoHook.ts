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
  const [nota, setNota] = useState<string>("");
  const [ativo, setAtivo] = useState<boolean>(true);
  const [inputsErrors, setInputsErrors] = useState<Record<string, string>>({});

  const tipoEquipamentoSchema = z.object({
    nome: z.string().trim().min(1, "Nome é obrigatório")
      .max(70, "Nome deve ter no máximo 70 caracteres"),
    nota: z.string().trim().min(1, "Nota é obrigatória")
      .max(150, "Nota deve ter no máximo 150 caracteres"),
    ativo: z.boolean(),
  });


  const getRegisters = useCallback(async (nomeFilter: string, idFilter: string, page = 1): Promise<TipoEquipamento[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const result: TipoEquipamento[] = await tipoEquipamentoService.getTipoEquipamento(nomeFilter, idFilter, page);
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

  const desactivateTipoEquipamento = async (idTipoEquipamento: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await tipoEquipamentoService.desactivateTipoEquipamento(idTipoEquipamento);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Ocorreu um erro interno no servidor";
        setError(message);
      } else {
        setError("Ocorreu um erro ao desativar o tipo de equipamento");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const activateTipoEquipamento = async (idTipoEquipamento: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await tipoEquipamentoService.activateTipoEquipamento(idTipoEquipamento);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Ocorreu um erro interno no servidor";
        setError(message);
      } else {
        setError("Ocorreu um erro ao ativar o tipo de equipamento");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const searchTipoEquipamento = async (name: string, id: string | null, page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const result: TipoEquipamento[] = await tipoEquipamentoService.getTipoEquipamento(name, id ?? "", page);
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
      const fieldErrors = z.flattenError(validar.error).fieldErrors;
      const errors: TipoEquipamentoError = {};
      Object.entries(fieldErrors).forEach(([campo, mensagens]) => {
        const mensagem = mensagens?.[0];
        if (mensagem) errors[campo as keyof TipoEquipamentoError] = mensagem;
      });
      setInputsErrors(errors);
      setIsLoading(false);
      return;
    }

    setInputsErrors({});

    try {
      const result = await tipoEquipamentoService.createTipoEquipamento(validar.data);
      return result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiErrors = error.response?.data?.errors;
        if (apiErrors && typeof apiErrors === "object") {
          const errors: TipoEquipamentoError = {};
          Object.entries(apiErrors).forEach(([campo, valor]) => {
            const mensagem = Array.isArray(valor) ? valor[0] : valor;
            if (typeof mensagem === "string") {
              errors[campo as keyof TipoEquipamentoError] = mensagem;
            }
          });
          if (Object.keys(errors).length > 0) {
            setInputsErrors(errors);
            return;
          }
        }
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

  const editar = useCallback(async (id: string, tipoEquipamento: TipoEquipamento) => {
    setIsLoading(true);
    setError(null);

    const validar = tipoEquipamentoSchema.safeParse(tipoEquipamento);
    if (!validar.success) {
      const fieldErrors = z.flattenError(validar.error).fieldErrors;
      const errors: TipoEquipamentoError = {};
      Object.entries(fieldErrors).forEach(([campo, mensagens]) => {
        const mensagem = mensagens?.[0];
        if (mensagem) errors[campo as keyof TipoEquipamentoError] = mensagem;
      });
      setInputsErrors(errors);
      setIsLoading(false);
      return;
    }

    setInputsErrors({});

    try {
      const result = await tipoEquipamentoService.updateTipoEquipamento(id, {
        id,
        ...validar.data,
      });
      return result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiErrors = error.response?.data?.errors;
        if (apiErrors && typeof apiErrors === "object") {
          const errors: TipoEquipamentoError = {};
          Object.entries(apiErrors).forEach(([campo, valor]) => {
            const mensagem = Array.isArray(valor) ? valor[0] : valor;
            if (typeof mensagem === "string") {
              errors[campo as keyof TipoEquipamentoError] = mensagem;
            }
          });
          if (Object.keys(errors).length > 0) {
            setInputsErrors(errors);
            return;
          }
        }
        const message = error.response?.data?.message ?? "Ocorreu um erro interno no servidor";
        setError(message);
      } else {
        setError("Ocorreu um erro ao editar o tipo de equipamento");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {cadastro, editar, getRegisters, desactivateTipoEquipamento, activateTipoEquipamento, searchTipoEquipamento, isLoading, error, inputsErrors };
};

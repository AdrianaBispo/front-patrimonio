import { useState, useCallback } from "react";
import axios from "axios";
import { EquipmentType } from "../types/equipmentType.types";
import { equipmentTypeService } from "../services/equipmentTypeService";
import { z } from "zod";
import { EquipmentTypeError } from "../types/equipmentTypeError.types";

export function useEquipmentTypeHook() {
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


  const getRegisters = useCallback(async (nomeFilter: string, idFilter: string, page = 1): Promise<EquipmentType[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const result: EquipmentType[] = await equipmentTypeService.getEquipmentTypes(nomeFilter, idFilter, page);
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

  const desactivateEquipmentType = async (idEquipmentType: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await equipmentTypeService.desactivateEquipmentType(idEquipmentType);
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

  const activateEquipmentType = async (idEquipmentType: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await equipmentTypeService.activateEquipmentType(idEquipmentType);
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

  const searchEquipmentType = async (name: string, id: string | null, page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const result: EquipmentType[] = await equipmentTypeService.getEquipmentTypes(name, id ?? "", page);
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

  const cadastro = useCallback(async (tipoEquipamento: EquipmentType) => {
    setIsLoading(true);
    setError(null);

    const validar = tipoEquipamentoSchema.safeParse(tipoEquipamento);
    if (!validar.success) {
      const fieldErrors = z.flattenError(validar.error).fieldErrors;
      const errors: EquipmentTypeError = {};
      Object.entries(fieldErrors).forEach(([campo, mensagens]) => {
        const mensagem = mensagens?.[0];
        if (mensagem) errors[campo as keyof EquipmentTypeError] = mensagem;
      });
      setInputsErrors(errors);
      setIsLoading(false);
      return;
    }

    setInputsErrors({});

    try {
      const result = await equipmentTypeService.createEquipmentType(validar.data);
      return result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiErrors = error.response?.data?.errors;
        if (apiErrors && typeof apiErrors === "object") {
          const errors: EquipmentTypeError = {};
          Object.entries(apiErrors).forEach(([campo, valor]) => {
            const mensagem = Array.isArray(valor) ? valor[0] : valor;
            if (typeof mensagem === "string") {
              errors[campo as keyof EquipmentTypeError] = mensagem;
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

  const editar = useCallback(async (id: string, tipoEquipamento: EquipmentType) => {
    setIsLoading(true);
    setError(null);

    const validar = tipoEquipamentoSchema.safeParse(tipoEquipamento);
    if (!validar.success) {
      const fieldErrors = z.flattenError(validar.error).fieldErrors;
      const errors: EquipmentTypeError = {};
      Object.entries(fieldErrors).forEach(([campo, mensagens]) => {
        const mensagem = mensagens?.[0];
        if (mensagem) errors[campo as keyof EquipmentTypeError] = mensagem;
      });
      setInputsErrors(errors);
      setIsLoading(false);
      return;
    }

    setInputsErrors({});

    try {
      const result = await equipmentTypeService.updateEquipmentType(id, {
        id,
        ...validar.data,
      });
      return result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiErrors = error.response?.data?.errors;
        if (apiErrors && typeof apiErrors === "object") {
          const errors: EquipmentTypeError = {};
          Object.entries(apiErrors).forEach(([campo, valor]) => {
            const mensagem = Array.isArray(valor) ? valor[0] : valor;
            if (typeof mensagem === "string") {
              errors[campo as keyof EquipmentTypeError] = mensagem;
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

  return {cadastro, editar, getRegisters, desactivateEquipmentType, activateEquipmentType, searchEquipmentType, isLoading, error, inputsErrors };
};

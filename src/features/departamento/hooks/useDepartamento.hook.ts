import { useState, useCallback } from "react";
import { z } from "zod";
import axios from "axios";
import { DepartamentoErroType } from "../types/depatamento.erro.types";
import { DepartamentoType } from "../types/departamento.types";
import departamentoService from "../services/departamentoService";
import authService from "../../auth/services/authService";

export function useDepartamentoHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputsErrors, setInputsErrors] = useState({} as DepartamentoErroType);
  const [nomeList, setNomeList] = useState<Map<number, string[]>>(new Map());

  const departamentoSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    gestor: z.string().min(1, "Gestor é obrigatório"),
    nota: z.string().min(1, "Nota é obrigatória"),
  });

  const getNomeList = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const result: Map<number, string[]> = await authService.getNomeList();
      setNomeList(result);
    } catch (error) {
      setError("Ocorreu um erro ao obter os dados");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cadastro = useCallback(async (departamento: DepartamentoType) => {
    setIsLoading(true);
    setError(null);

    const validar = departamentoSchema.safeParse(departamento);

    if (!validar.success) {
      const errors: DepartamentoErroType = {};

      validar.error.issues.forEach((issue) => {
        const campo = issue.path[0] as keyof DepartamentoErroType;
        errors[campo] = issue.message;
      });

      setInputsErrors(errors);
      setIsLoading(false);
      try {
        const result = await departamentoService.createDepartamento(departamento);
        return result;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message ??
            "Ocorreu um erro interno no servidor";
          setError(message);
        } else {
          setError("Ocorreu um erro ao cadastrar os dados");
        }
        throw error;
      } finally {
        setIsLoading(false);
        return;
      }
    }
    setInputsErrors({});
  }, []);

  return { cadastro, getNomeList, isLoading, error, inputsErrors, nomeList };
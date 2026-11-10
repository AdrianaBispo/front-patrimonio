import { useState, useCallback } from "react";
import { z } from "zod";
import axios from "axios";
import { DepartamentoErroType } from "../types/depatamento.erro.types";
import { DepartamentoType } from "../types/departamento.types";
import departamentoService from "../services/departamentoService";

export function useDepartamentoHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputsErrors, setInputsErrors] = useState({} as DepartamentoErroType);

  const departamentoSchema = z.object({});

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
}

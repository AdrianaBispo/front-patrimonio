import { useState, useCallback } from "react";
import { z } from "zod";
import { CategoriaType } from "../types/categoriaType";
import { CategoriaError } from "../types/categoriaError";
import categoriaService from "../services/categoriaService";
import axios from "axios";

export function useCadastroCategoriaHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputsErrors, setInputsErrors] = useState({} as CategoriaError);

  const cadastroSchema = z.object({
    nome: z
      .string()
      .min(1, "O nome é obrigatório")
      .max(70, "O nome deve ter no máximo 70 caracteres"),
    tipo: z
      .string()
      .min(1, "O tipo é obrigatório")
      .max(2, "O tipo deve ter no máximo 2 caracteres"),

    notas: z
      .string()
      .max(500, "O máximo de caracteres para o campo notas são 500 caracteres"),
  });

  const cadastro = useCallback(async (categoria: CategoriaType) => {
    setIsLoading(true);
    setError(null);

    const validar = cadastroSchema.safeParse(categoria);
    console.log(categoria);

    if (!validar.success) {
      const errors: CategoriaError = {};

      validar.error.issues.forEach((issue) => {
        const campo = issue.path[0] as keyof CategoriaError;
        errors[campo] = issue.message;
      });

      setInputsErrors(errors);
      setIsLoading(false);
      try {
        const result = await categoriaService.createCategoria(categoria);
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

  const editarCategoria = useCallback(
    async (id: string, categoria: CategoriaType) => {
      setIsLoading(true);
      setError(null);

      const validar = cadastroSchema.safeParse(categoria);
      console.log(categoria);

      if (!validar.success) {
        const errors: CategoriaError = {};

        validar.error.issues.forEach((issue) => {
          const campo = issue.path[0] as keyof CategoriaError;
          errors[campo] = issue.message;
        });

        setInputsErrors(errors);
        setIsLoading(false);
        try {
          const result = await categoriaService.updateCategoria(id, categoria);
          return result;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const message =
              error.response?.data?.message ??
              "Ocorreu um erro interno no servidor";
            setError(message);
          } else {
            setError("Ocorreu um erro ao atualizar os dados");
          }
          throw error;
        } finally {
          setIsLoading(false);
          return;
        }
      }
    },
    [],
  );

  const getCategoria = useCallback(async (nome: string, id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result: CategoriaType[] = await categoriaService.getCategoria(
        nome,
        id,
      );
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

  return { cadastro, editarCategoria, getCategoria, isLoading, error, inputsErrors };
}

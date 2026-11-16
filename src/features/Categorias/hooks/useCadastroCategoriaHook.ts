import { useState, useCallback } from "react";
import { z } from "zod";
import axios from "axios";

import { CategoriaType } from "../types/categoriaType";
import { CategoriaError } from "../types/categoriaError";
import categoriaService from "../services/categoriaService";

export function useCadastroCategoriaHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputsErrors, setInputsErrors] = useState({} as CategoriaError);

  const cadastroSchema = z.object({
    nome: z
      .string()
      .trim()
      .min(1, "O nome é obrigatório")
      .max(70, "O nome deve ter no máximo 70 caracteres"),
    tipo: z
      .string()
      .trim()
      .min(1, "O tipo é obrigatório")
      .max(2, "O tipo deve ter no máximo 2 caracteres"),
    nota: z
      .string()
      .max(500, "O máximo de caracteres para o campo nota são 500 caracteres")
      .optional(),
  });

  const tratarErroApi = (err: unknown, fallback: string) => {
    if (axios.isAxiosError(err)) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors && typeof apiErrors === "object") {
        const errors: CategoriaError = {};
        Object.entries(apiErrors).forEach(([campo, valor]) => {
          const mensagem = Array.isArray(valor) ? valor[0] : valor;
          if (typeof mensagem === "string") {
            errors[campo as keyof CategoriaError] = mensagem;
          }
        });
        if (Object.keys(errors).length > 0) {
          setInputsErrors(errors);
          return;
        }
      }

      const message =
        err.response?.data?.message ?? "Ocorreu um erro interno no servidor";
      setError(message);
      throw new Error(message);
    }

    setError(fallback);
    throw new Error(fallback);
  };

  const cadastro = useCallback(async (categoria: CategoriaType) => {
    setIsLoading(true);
    setError(null);

    const validar = cadastroSchema.safeParse(categoria);
    if (!validar.success) {
      const errors: CategoriaError = {};
      validar.error.issues.forEach((issue) => {
        const campo = issue.path[0] as keyof CategoriaError;
        if (!errors[campo]) errors[campo] = issue.message;
      });
      setInputsErrors(errors);
      setIsLoading(false);
      return undefined;
    }

    setInputsErrors({});

    try {
      return await categoriaService.createCategoria(validar.data);
    } catch (err) {
      return tratarErroApi(err, "Ocorreu um erro ao cadastrar os dados");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const editarCategoria = useCallback(
    async (id: string, categoria: CategoriaType) => {
      setIsLoading(true);
      setError(null);

      const validar = cadastroSchema.safeParse(categoria);
      if (!validar.success) {
        const errors: CategoriaError = {};
        validar.error.issues.forEach((issue) => {
          const campo = issue.path[0] as keyof CategoriaError;
          if (!errors[campo]) errors[campo] = issue.message;
        });
        setInputsErrors(errors);
        setIsLoading(false);
        return undefined;
      }

      setInputsErrors({});

      try {
        return await categoriaService.updateCategoria(id, validar.data);
      } catch (err) {
        return tratarErroApi(err, "Ocorreu um erro ao atualizar os dados");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getCategoria = useCallback(
    async (nome: string, id?: string | null, page = 1, perPage = 0) => {
      setIsLoading(true);
      setError(null);

      try {
        return await categoriaService.getCategoria(nome, id, page, perPage);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const message =
            err.response?.data?.message ??
            "Ocorreu um erro interno no servidor";
          setError(message);
          throw new Error(message);
        }
        setError("Ocorreu um erro ao obter os dados");
        throw new Error("Ocorreu um erro ao obter os dados");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    cadastro,
    editarCategoria,
    getCategoria,
    isLoading,
    error,
    inputsErrors,
  };
}

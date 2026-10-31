import { useState, useCallback } from "react";
import { z } from "zod";
import { CategoriaType } from "../types/categoriaType";
import { CategoriaError } from "../types/categoriaError";

export function useCadastroCategoriaHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputsErrors, setInputsErrors] = useState({} as CategoriaError);

  const cadastroSchema = z.object({
    nome: z.string().min(1, "O nome é obrigatório"),
    tipo: z.string().min(1, "O tipo é obrigatório"),
  });

  const cadastro = useCallback(async (categoria: CategoriaType) => {
    setIsLoading(true);
    setError(null);

    const validar = cadastroSchema.safeParse(categoria);

    if (!validar.success) {
      const errors: CategoriaError = {};

      validar.error.issues.forEach((issue) => {
        const campo = issue.path[0];
      });

      setInputsErrors(errors);
      setIsLoading(false);
      return;
    }
    setInputsErrors({});
  }, []);

  return { cadastro, isLoading, error, inputsErrors };
}

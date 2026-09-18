import { useState, useCallback } from "react";
import { authService } from "../../services/authService";
import axios from "axios";
import { LoginCredentials } from "../../types/auth.types";
import { z } from "zod";
import { LoginInputError } from "../loginInputError.type";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputsErrors, setInputsErrors] = useState({} as LoginInputError);

  const loginSchema = z.object({
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(8, "A senha deve ter pelo menos 8 caracteres"),
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    const validation = loginSchema.safeParse(credentials);
    if (!validation.success) {
      const errors: LoginInputError = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (field === "email" || field === "password") {
          errors[field] = issue.message;
        }
      });

      setInputsErrors(errors);
      setIsLoading(false);
      return;
    }
    try {
      const result = await authService.login(credentials);
      return result;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message ?? "Erro ao entrar.";
        setError(message);
      } else {
        setError("Erro ao entrar.");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, isLoading, error, inputsErrors};
}

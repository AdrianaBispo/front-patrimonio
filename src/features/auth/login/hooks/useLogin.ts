import { useState, useCallback } from "react";
import { authService } from "../../services/authService";
import axios from "axios";
import { LoginCredentials } from "../../types/auth.types";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.login(credentials);
      return result; 
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Erro ao entrar."
        : "Erro inesperado.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, isLoading, error };
}
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
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message ?? "Erro ao entrar.";
        setError(message);
      } 
      else {
        setError("Erro ao entrar.");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, isLoading, error };
}
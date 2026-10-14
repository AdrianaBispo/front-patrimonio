import { useState, useCallback } from "react";
import authService from "../../auth/services/authService";
import axios from "axios";
import { is } from "zod/v4/locales";
import { User } from "../types/user";

export function useList() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRegisters = useCallback(async (): Promise<User[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const result: User[] = await authService.listUsers();
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

  const deactivateUser = async (idUser: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.deactivateUser(idUser);
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
  return { getRegisters, deactivateUser, isLoading, error };
}

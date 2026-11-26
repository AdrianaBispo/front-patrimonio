import { useState, useCallback } from "react";
import authService from "../../auth/services/authService";
import axios from "axios";
import { User } from "../types/user.types";
import { UserExpiredException, UserNotFoundException, UserErrorException } from "../exceptions/userExceptions";

export function useList() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return new UserExpiredException().message;
      }
      else if (error.response?.status === 403) {
        return new UserNotFoundException().message;
      }
      else {
        return new UserErrorException().message;
      }
    }
  
    return new UserErrorException().message;
  }

  const getRegisters = useCallback(async (): Promise<User[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const result: User[] = await authService.listUsers();
      return result;
    } catch (error) {
        const message = getErrorMessage(error);
        setError(message);
        throw new Error(message);
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
      const message = getErrorMessage(error);
      setError(message);
      throw new Error(message);
  } finally {
    setIsLoading(false);
  }
};

  const searchUser = async (name: string, id:string | null) => {
    setIsLoading(true);
    setError(null);

    try {
     const result: User[] = await authService.filtertUsers(name, id);
     return result;
    } catch (error) {
        const message = getErrorMessage(error);
        setError(message);
        throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };
  return { getRegisters, deactivateUser, searchUser, isLoading, error };
}

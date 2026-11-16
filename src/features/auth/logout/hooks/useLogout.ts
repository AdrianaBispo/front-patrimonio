import { useCallback, useState } from "react";
import axios from "axios";
import authService from "../../services/authService";

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      return await authService.logout();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Não foi possível sair."
        : "Não foi possível sair.";

      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { logout, isLoading, error };
}

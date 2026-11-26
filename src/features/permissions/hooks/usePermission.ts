import { useCallback, useState } from "react";
import axios from "axios";

import permissionService from "../services/permissionService";
import { Permission } from "../types/permission.types";
import { PermissionExpiredException, PermissionForbiddenException, PermissionErrorException } from "../exceptions/permissionException";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return new PermissionExpiredException().message;
    }
    else if (error.response?.status === 403) {
      return new PermissionForbiddenException().message;
    }
    else {
      return new PermissionErrorException().message;
    }
  }

  return new PermissionErrorException().message;
}

export function usePermission() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const listPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await permissionService.listPermissions();
      setPermissions(result);
      return result;
    } catch (err) {
      const mensagem = getErrorMessage(err);
      setError(mensagem);
      throw new Error(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    listPermissions,
    permissions,
    isLoading,
    error,
  };
}

import { useCallback, useState } from "react";
import axios from "axios";

import roleService from "../services/roleService";
import { RolePaginator } from "../types/role.types";
import {
  RoleErrorException,
  RoleExpiredException,
  RoleForbiddenException,
} from "../exceptions/roleExceptions";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return new RoleExpiredException().message;
    }
    if (error.response?.status === 403) {
      return new RoleForbiddenException().message;
    }
  }

  return new RoleErrorException().message;
}

export function useRoleListHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginator, setPaginator] = useState<RolePaginator>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const listRoles = useCallback(async (page = 1, perPage = 0) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await roleService.listRoles(page, perPage);
      const roles = result?.roles ?? result;

      setPaginator({
        currentPage: roles?.current_page ?? 1,
        lastPage: roles?.last_page ?? 1,
        total: roles?.total ?? 0,
        from: roles?.from ?? 0,
        to: roles?.to ?? 0,
      });

      return roles;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { listRoles, isLoading, error, paginator };
}

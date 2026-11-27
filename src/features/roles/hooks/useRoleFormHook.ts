import { useCallback, useState } from "react";
import axios from "axios";
import { z } from "zod";

import roleService from "../services/roleService";
import {
  RoleFormData,
  RoleFormErrors,
  RolePermissionsResponse,
  UpdateRolePayload,
} from "../types/role.types";
import {
  RoleErrorException,
  RoleExpiredException,
  RoleForbiddenException,
  RoleNotFoundException,
} from "../exceptions/roleExceptions";

const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "role.validation.nameRequired")
    .max(255, "role.validation.nameMax"),
  permissions: z
    .array(z.number())
    .min(1, "role.validation.permissionsRequired"),
});

const updateRoleSchema = z.object({
  permissions: z
    .array(z.number())
    .min(1, "role.validation.permissionsRequired"),
});

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return new RoleExpiredException().message;
    }
    if (error.response?.status === 403) {
      return new RoleForbiddenException().message;
    }
    if (error.response?.status === 404) {
      return new RoleNotFoundException().message;
    }
  }

  return new RoleErrorException().message;
}

export function useRoleFormHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputsErrors, setInputsErrors] = useState<RoleFormErrors>({});

  const validateCreate = (data: RoleFormData): RoleFormData | null => {
    const result = createRoleSchema.safeParse(data);

    if (!result.success) {
      const errors: RoleFormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RoleFormErrors;
        if (!errors[field]) errors[field] = issue.message;
      });
      setInputsErrors(errors);
      return null;
    }

    setInputsErrors({});
    return result.data;
  };

  const validateUpdate = (
    data: UpdateRolePayload,
  ): UpdateRolePayload | null => {
    const result = updateRoleSchema.safeParse(data);

    if (!result.success) {
      const errors: RoleFormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RoleFormErrors;
        if (!errors[field]) errors[field] = issue.message;
      });
      setInputsErrors(errors);
      return null;
    }

    setInputsErrors({});
    return result.data;
  };

  const createRole = useCallback(async (data: RoleFormData) => {
    setIsLoading(true);
    setError(null);

    const payload = validateCreate(data);
    if (!payload) {
      setIsLoading(false);
      return undefined;
    }

    try {
      return await roleService.createRole(payload);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRole = useCallback(
    async (id: string | number, data: UpdateRolePayload) => {
      setIsLoading(true);
      setError(null);

      const payload = validateUpdate(data);
      if (!payload) {
        setIsLoading(false);
        return undefined;
      }

      try {
        return await roleService.updateRole(id, payload);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const loadRole = useCallback(
    async (id: string | number): Promise<RolePermissionsResponse> => {
      setIsLoadingData(true);
      setError(null);

      try {
        const result = await roleService.getRolePermissions(id);

        if (!result?.role) {
          throw new RoleNotFoundException();
        }

        return result;
      } catch (err) {
        const message =
          err instanceof RoleNotFoundException
            ? err.message
            : getErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoadingData(false);
      }
    },
    [],
  );

  return {
    createRole,
    updateRole,
    loadRole,
    isLoading,
    isLoadingData,
    error,
    inputsErrors,
  };
}

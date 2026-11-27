import { useState, useCallback } from "react";
import axios from "axios";
import { z } from "zod";

import { authService } from "../../services/authService";
import { LoginCredentials, LoginFormErrors } from "../../types/auth.types";
import {
  AuthErrorException,
  AuthExpiredException,
  AuthForbiddenException,
} from "../../exceptions/authExceptions";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "auth.validation.emailRequired")
    .email("auth.validation.emailInvalid"),
  password: z
    .string()
    .min(1, "auth.validation.passwordRequired")
    .min(8, "auth.validation.passwordMin"),
});

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return new AuthExpiredException().message;
    }
    if (error.response?.status === 403) {
      return new AuthForbiddenException().message;
    }
  }

  return new AuthErrorException().message;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputsErrors, setInputsErrors] = useState<LoginFormErrors>({});

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    const validation = loginSchema.safeParse(credentials);
    if (!validation.success) {
      const errors: LoginFormErrors = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormErrors;
        if (!errors[field]) errors[field] = issue.message;
      });
      setInputsErrors(errors);
      setIsLoading(false);
      return undefined;
    }

    setInputsErrors({});

    try {
      return await authService.login(validation.data);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, isLoading, error, inputsErrors };
}

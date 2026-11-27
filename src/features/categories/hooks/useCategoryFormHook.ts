import { useCallback, useState } from "react";
import axios from "axios";
import { z } from "zod";

import categoryService from "../services/categoryService";
import {
  Category,
  CategoryFormData,
  CategoryFormErrors,
} from "../types/category.types";
import {
  CategoryErrorException,
  CategoryExpiredException,
  CategoryForbiddenException,
  CategoryNotFoundException,
} from "../exceptions/categoryExceptions";

const categorySchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "category.validation.nameRequired")
    .max(70, "category.validation.nameMax"),
  tipo: z
    .string()
    .trim()
    .min(1, "category.validation.typeRequired")
    .max(2, "category.validation.typeMax"),
  nota: z.string().max(500, "category.validation.noteMax").optional(),
});

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return new CategoryExpiredException().message;
    }
    if (error.response?.status === 403) {
      return new CategoryForbiddenException().message;
    }
    if (error.response?.status === 404) {
      return new CategoryNotFoundException().message;
    }
  }

  return new CategoryErrorException().message;
}

export function useCategoryFormHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputsErrors, setInputsErrors] = useState<CategoryFormErrors>({});

  const validate = (data: CategoryFormData): CategoryFormData | null => {
    const result = categorySchema.safeParse(data);

    if (!result.success) {
      const errors: CategoryFormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CategoryFormErrors;
        if (!errors[field]) errors[field] = issue.message;
      });
      setInputsErrors(errors);
      return null;
    }

    setInputsErrors({});
    return result.data;
  };

  const createCategory = useCallback(async (data: CategoryFormData) => {
    setIsLoading(true);
    setError(null);

    const payload = validate(data);
    if (!payload) {
      setIsLoading(false);
      return undefined;
    }

    try {
      return await categoryService.createCategory(payload);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCategory = useCallback(
    async (id: string, data: CategoryFormData) => {
      setIsLoading(true);
      setError(null);

      const payload = validate(data);
      if (!payload) {
        setIsLoading(false);
        return undefined;
      }

      try {
        return await categoryService.updateCategory(id, payload);
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

  const loadCategory = useCallback(async (id: string): Promise<Category> => {
    setIsLoadingData(true);
    setError(null);

    try {
      const result = await categoryService.getCategory(id);
      const categories = result?.categorias ?? result;
      const category = categories?.data?.[0];

      if (!category) {
        throw new CategoryNotFoundException();
      }

      return category;
    } catch (err) {
      const message =
        err instanceof CategoryNotFoundException
          ? err.message
          : getErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  return {
    createCategory,
    updateCategory,
    loadCategory,
    isLoading,
    isLoadingData,
    error,
    inputsErrors,
  };
}

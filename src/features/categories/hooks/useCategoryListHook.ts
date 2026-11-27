import { useCallback, useState } from "react";
import axios from "axios";

import categoryService from "../services/categoryService";
import { CategoryPaginator } from "../types/category.types";
import {
  CategoryErrorException,
  CategoryExpiredException,
  CategoryForbiddenException,
} from "../exceptions/categoryExceptions";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return new CategoryExpiredException().message;
    }
    if (error.response?.status === 403) {
      return new CategoryForbiddenException().message;
    }
  }

  return new CategoryErrorException().message;
}

export function useCategoryListHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginator, setPaginator] = useState<CategoryPaginator>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const listCategories = useCallback(
    async (search = "", page = 1, perPage = 0) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await categoryService.getCategories(
          search,
          null,
          page,
          perPage,
        );
        const categories = result?.categorias ?? result;

        setPaginator({
          currentPage: categories?.current_page ?? 1,
          lastPage: categories?.last_page ?? 1,
          total: categories?.total ?? 0,
          from: categories?.from ?? 0,
          to: categories?.to ?? 0,
        });

        return categories;
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

  return { listCategories, isLoading, error, paginator };
}

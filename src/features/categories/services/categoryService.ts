import api from "../../../shared/api/axios";
import { CategoryFormData } from "../types/category.types";

export const categoryService = {
  async createCategory(category: CategoryFormData) {
    const { data } = await api.post(`/categoria/create`, category);
    return data;
  },

  async getCategories(
    searchFilter: string,
    idFilter?: string | null,
    page = 1,
    perPage = 0,
  ) {
    const { data } = await api.get(`/categoria/all`, {
      params: {
        search: searchFilter ?? "",
        id: idFilter ?? "",
        page,
        per_page: perPage,
      },
    });
    return data;
  },

  async getCategory(id: string) {
    const { data } = await api.get(`/categoria/all`, {
      params: { search: "", id, page: 1, per_page: 1 },
    });
    return data;
  },

  async updateCategory(id: string, category: CategoryFormData) {
    const { data } = await api.put(`/categoria/update/${id}`, category);
    return data;
  },
};

export default categoryService;

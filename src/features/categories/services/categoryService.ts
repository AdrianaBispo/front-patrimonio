import api from "../../../shared/api/axios";
import { CategoryType } from "../types/categoryType";

export const categoryService = {
  async createCategoria(categoria: CategoryType) {
    const { data } = await api.post(`/categoria/create`, categoria);
    return data;
  },

  async getCategories(nomeFilter: string, idFilter?: string | null, page = 1, perPage = 0) {
    const { data } = await api.get(`/categoria/all`, {
      params: { search: nomeFilter ?? "", id: idFilter ?? "", page, per_page: perPage },
    });
    return data;
  },

  async updateCategoria(id: string, categoria: CategoryType) {
    const { data } = await api.put(`/categoria/update/${id}`, categoria);
    return data;
  },
};

export default categoryService;

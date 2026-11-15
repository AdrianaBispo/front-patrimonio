import api from "../../../shared/api/axios";
import { CategoriaType } from "../types/categoriaType";

export const categoriaService = {
  async createCategoria(categoria: CategoriaType) {
    const { data } = await api.post(`/categoria/create`, categoria);
    return data;
  },

  async getCategoria(nomeFilter: string, idFilter?: string | null) {
    const { data } = await api.get(`/categoria/all`, {
      params: { search: `${nomeFilter}`, id: `${idFilter}` },
    });
    return data;
  },

  async updateCategoria(id: string, categoria: CategoriaType) {
    const { data } = await api.put(`/categoria/update/${id}`, categoria);
    return data;
  },
};

export default categoriaService;

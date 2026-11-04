import axios from "axios";
import { env } from "../../../config/env";
import { CategoriaType } from "../types/categoriaType";
const api = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const categoriaService = {
  async createCategoria(categoria: CategoriaType) {
    const { data } = await api.post(`/categoria/create`, categoria);
    return data;
  },
};

export default categoriaService;

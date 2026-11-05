import axios from "axios";
import { env } from "../../../config/env";
import { CategoriaType } from "../types/categoriaType";
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
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

  async getCategoria(){
    const { data } = await api.get(`/categoria/all`);
    return data;
  }
};

export default categoriaService;

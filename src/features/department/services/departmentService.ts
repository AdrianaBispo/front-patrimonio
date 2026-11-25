import axios from "axios";
import { env } from "../../../config/env";
import { DepartamentoType } from "../types/department.types";
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const departmentService = {
  async createDepartamento(departamento: DepartamentoType) {
    const { data } = await api.post(`/departamento/create`, departamento);
    return data;
  },

  async getDepartamento(nomeFilter: string, idFilter?: string | null) {
    const { data } = await api.get(`/departamento/all`, {
      params: { search: `${nomeFilter}`, id: `${idFilter}` },
    });
    return data;
  },

  async updateDepartamento(id: string, departamento: DepartamentoType) {
    const { data } = await api.put(`/departamento/update/${id}`, departamento);
    return data;
  },

  async desabilitarDepartamento(id: string){},
};

export default departmentService;

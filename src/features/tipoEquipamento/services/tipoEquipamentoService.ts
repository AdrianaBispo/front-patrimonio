import axios from "axios";
import {TipoEquipamento} from "../types/tipoEquipamento.types";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/tipo_equipamento",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const tipoEquipamentoService = {
  async createTipoEquipamento(tipoEquipamento: TipoEquipamento){
    const response = await api.post("/create", tipoEquipamento);
    return response.data;
  },

  async getTipoEquipamento(nomeFilter: string, idFilter: string, page = 1){
    const response = await api.get("/all", {
      params: { nomeFilter, idFilter, page },
    });
    return response.data;
  },

  async updateTipoEquipamento(id: string, tipoEquipamento: TipoEquipamento) {
    const response = await api.put(`/update/${id}`, tipoEquipamento);
    return response.data;
  },

  async desactivateTipoEquipamento(id: string){
    const response = await api.put(`/desactivate/${id}`);
    return response.data;
  },

  async activateTipoEquipamento(id: string){
    const response = await api.put(`/activate/${id}`);
    return response.data;
  }

}
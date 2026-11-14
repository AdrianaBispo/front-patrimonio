import axios from "axios";
import {TipoEquipamento} from "../types/tipoEquipamento.types";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const tipoEquipamentoService = {
  async createTipoEquipamento(tipoEquipamento: TipoEquipamento){
    const response = await api.post("/tipo-equipamento", tipoEquipamento);
    return response.data;
  },

  async getTipoEquipamento(nomeFilter: string, idFilter: string){
    const response = await api.get("/tipo-equipamento", {
      params: { nomeFilter, idFilter },
    });
    return response.data;
  },

  async updateTipoEquipamento(id: string, tipoEquipamento: TipoEquipamento) {},

  async deleteTipoEquipamento(id: string){}

}
import axios from "axios";
import { GestorType } from "../types/gestor.types";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const GestorService = {
  async createGestor(nome: string){},

  async getGestor(nomeFilter: string, idFilter: string): Promise<GestorType[]>{
    return (await api.get(`/gestor?nome=${nomeFilter}&id=${idFilter}`)).data;
  },

  async updateGestor(id: string, nome: string) {},

  async deleteGestor(id: string): Promise<void>{},

}
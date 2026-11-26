import { GestorType } from "../types/manager.types";
import api from "../../../shared/api/axios";


export const GestorService = {
  async createGestor(nome: string){},

  async getGestor(nomeFilter: string, idFilter: string): Promise<GestorType[]>{
    return (await api.get(`/gestor?nome=${nomeFilter}&id=${idFilter}`)).data;
  },

  async updateGestor(id: string, nome: string) {},

  async deleteGestor(id: string): Promise<void>{},

}
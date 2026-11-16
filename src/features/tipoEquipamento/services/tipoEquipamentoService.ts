import api from "../../../shared/api/axios";
import { TipoEquipamento } from "../types/tipoEquipamento.types";

export const tipoEquipamentoService = {
  async createTipoEquipamento(tipoEquipamento: TipoEquipamento) {
    const { data } = await api.post("/tipo_equipamento/create", tipoEquipamento);
    return data;
  },

  async getTipoEquipamento(nomeFilter: string, idFilter: string, page = 1) {
    const { data } = await api.get("/tipo_equipamento/all", {
      params: { nomeFilter, idFilter, page },
    });
    return data;
  },

  async updateTipoEquipamento(id: string, tipoEquipamento: TipoEquipamento) {
    const { data } = await api.put(
      `/tipo_equipamento/update/${id}`,
      tipoEquipamento,
    );
    return data;
  },

  async desactivateTipoEquipamento(id: string) {
    const { data } = await api.put(`/tipo_equipamento/desactivate/${id}`);
    return data;
  },

  async activateTipoEquipamento(id: string) {
    const { data } = await api.put(`/tipo_equipamento/activate/${id}`);
    return data;
  },
};

export default tipoEquipamentoService;

import api from "../../../shared/api/axios";
import { EquipmentType } from "../types/equipmentType.types";

export const equipmentTypeService = {
  async createEquipmentType(tipoEquipamento: EquipmentType) {
    const { data } = await api.post("/tipo_equipamento/create", tipoEquipamento);
    return data;
  },

  async getEquipmentTypes(nomeFilter: string, idFilter: string, page = 1) {
    const { data } = await api.get("/tipo_equipamento/all", {
      params: { nomeFilter, idFilter, page },
    });
    return data;
  },

  async updateEquipmentType(id: string, tipoEquipamento: EquipmentType) {
    const { data } = await api.put(
      `/tipo_equipamento/update/${id}`,
      tipoEquipamento,
    );
    return data;
  },

  async desactivateEquipmentType(id: string) {
    const { data } = await api.put(`/tipo_equipamento/desactivate/${id}`);
    return data;
  },

  async activateEquipmentType(id: string) {
    const { data } = await api.put(`/tipo_equipamento/activate/${id}`);
    return data;
  },
};

export default equipmentTypeService;

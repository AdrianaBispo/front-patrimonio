import api from "../../../shared/api/axios";
import { HistoricoEquipamento } from "../types/historicoEquipamento.types";

export const historicoEquipamentoService = {
  async listarHistoricos(page = 1, perPage = 0) {
    const params: Record<string, number> = {
      per_page: perPage,
    };

    if (perPage > 0) {
      params.page = page;
    }

    const { data } = await api.get("/historic_equipaments/all", { params });
    return data;
  },

  async inserirHistorico(historico: HistoricoEquipamento) {
    const { data } = await api.post("/historic_equipaments", historico);
    return data;
  },
};

export default historicoEquipamentoService;

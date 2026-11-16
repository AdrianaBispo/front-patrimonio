import api from "../../../shared/api/axios";

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
};

export default historicoEquipamentoService;

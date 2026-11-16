import api from "../../../shared/api/axios";
import { Equipamento } from "../types/equipament.type";

export const equipamentService = {
  async getAllEquipamentos(
    page = 1,
    perPage = 0,
    nome = "",
    serie = "",
  ) {
    const params: Record<string, string | number> = {
      per_page: perPage,
    };

    if (perPage > 0) {
      params.page = page;
    }

    const nomeFiltrado = nome.trim();
    const serieFiltrada = serie.trim();

    if (nomeFiltrado) {
      params.nome = nomeFiltrado;
    }

    if (serieFiltrada) {
      params.serie = serieFiltrada;
    }

    const { data } = await api.get("/equipaments/all", { params });
    return data;
  },

  async searchEquipamentos(
    name = "",
    serie = "",
    page = 1,
    perPage = 0,
  ) {
    const params: Record<string, string | number> = {
      per_page: perPage,
    };

    if (perPage > 0) {
      params.page = page;
    }

    const trimmedName = name.trim();
    const trimmedSerie = serie.trim();

    if (trimmedName) {
      params.name = trimmedName;
    } else if (trimmedSerie) {
      params.serie = trimmedSerie;
    }

    const { data } = await api.get("/equipaments/get", { params });
    return data;
  },

  async createEquipamento(equipamento: Equipamento) {
    const { data } = await api.post("/equipaments/create", equipamento);
    return data;
  },

  async updateEquipamento(id: string | number, equipamento: Equipamento) {
    const { data } = await api.put(`/equipaments/update/${id}`, equipamento);
    return data;
  },
};

export default equipamentService;

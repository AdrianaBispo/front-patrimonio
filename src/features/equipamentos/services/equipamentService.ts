import api from "../../../shared/api/axios";
import { Equipamento } from "../types/equipament.type";

function toApiPayload(equipamento: Equipamento) {
  // Backend de create/update ainda valida os nomes sem prefixo eqi_
  return {
    nome: equipamento.eqi_name,
    descricao: equipamento.eqi_descricao,
    serie: equipamento.eqi_serie,
    status_id: equipamento.eqi_status_id,
    categoria_id: equipamento.categoria_id,
    tipo_equipamento_id: equipamento.tipo_equipamento_id,
    usuario_id: equipamento.usuario_id,
    imagem_url: equipamento.imagem_url,
  };
}

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
    const { data } = await api.post(
      "/equipaments/create",
      toApiPayload(equipamento),
    );
    return data;
  },

  async updateEquipamento(id: string | number, equipamento: Equipamento) {
    const { data } = await api.put(
      `/equipaments/update/${id}`,
      toApiPayload(equipamento),
    );
    return data;
  },

  async uploadImage(image: File) {
    const formData = new FormData();
    formData.append("image", image);

    // Remove application/json padrão para o browser definir multipart + boundary.
    const { data } = await api.post("/equipaments/image-upload", formData, {
      transformRequest: [
        (payload, headers) => {
          if (payload instanceof FormData) {
            delete headers["Content-Type"];
          }
          return payload;
        },
      ],
    });
    return data;
  },
};

export default equipamentService;

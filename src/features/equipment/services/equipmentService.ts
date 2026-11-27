import api from "../../../shared/api/axios";
import { Equipment } from "../types/equipment.types";

function toApiPayload(equipment: Equipment) {
  return {
    nome: equipment.eqi_name,
    descricao: equipment.eqi_descricao,
    serie: equipment.eqi_serie,
    status_id: equipment.eqi_status_id,
    categoria_id: equipment.categoria_id,
    tipo_equipamento_id: equipment.tipo_equipamento_id,
    usuario_id: equipment.usuario_id,
    imagem_url: equipment.imagem_url,
  };
}

export const equipmentService = {
  async listEquipments(page = 1, perPage = 0, name = "", serial = "") {
    const params: Record<string, string | number> = {
      per_page: perPage,
    };

    if (perPage > 0) {
      params.page = page;
    }

    const trimmedName = name.trim();
    const trimmedSerial = serial.trim();

    if (trimmedName) {
      params.nome = trimmedName;
    }

    if (trimmedSerial) {
      params.serie = trimmedSerial;
    }

    const { data } = await api.get("/equipaments/all", { params });
    return data;
  },

  async searchEquipments(name = "", serial = "", page = 1, perPage = 0) {
    const params: Record<string, string | number> = {
      per_page: perPage,
    };

    if (perPage > 0) {
      params.page = page;
    }

    const trimmedName = name.trim();
    const trimmedSerial = serial.trim();

    if (trimmedName) {
      params.name = trimmedName;
    } else if (trimmedSerial) {
      params.serie = trimmedSerial;
    }

    const { data } = await api.get("/equipaments/get", { params });
    return data;
  },

  async createEquipment(equipment: Equipment) {
    const { data } = await api.post(
      "/equipaments/create",
      toApiPayload(equipment),
    );
    return data;
  },

  async updateEquipment(id: string | number, equipment: Equipment) {
    const { data } = await api.put(
      `/equipaments/update/${id}`,
      toApiPayload(equipment),
    );
    return data;
  },

  async uploadImage(image: File) {
    const formData = new FormData();
    formData.append("image", image);

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

export default equipmentService;

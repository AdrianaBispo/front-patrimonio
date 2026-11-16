import api from "../../../shared/api/axios";

export const statusService = {
  async listarStatus() {
    const { data } = await api.get("/status/all");
    return data;
  },
};

export default statusService;

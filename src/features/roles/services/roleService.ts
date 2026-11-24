import api from "../../../shared/api/axios";

export const roleService = {
  async listarRoles(page = 1, perPage = 10) {
    const params: Record<string, number> = {
      page,
      per_page: perPage,
    };

    const { data } = await api.get("/roles/all", { params });
    return data;
  },
};

export default roleService;

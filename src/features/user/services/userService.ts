import api from "../../../shared/api/axios";

export const userService = {
  async listarUsuarios() {
    const { data } = await api.get("/auth/users");
    return data;
  },
};

export default userService;
import api from "../../../shared/api/axios";
import { UsuarioFormData } from "../types/user.types";

export const userService = {
  async listUsers() {
    const { data } = await api.get("/auth/users");
    return data;
  },

  async getUser(id: string) {
    const { data } = await api.get("/auth/users", {
      params: { id },
    });

    return data;
  },

  async listRoles() {
    const { data } = await api.get("/roles/all");
    return Array.isArray(data) ? data : (data?.data ?? []);
  },

  async createUser(usuario: UsuarioFormData) {
    const { role_id, ...dados } = usuario;
    const { data } = await api.post("/auth/register", {
      ...dados,
      departamento_id: null,
      roles: role_id ? [Number(role_id)] : [],
    });
    return data;
  },

  async updateUser(id: string, usuario: UsuarioFormData) {
    const { role_id, password, ...dados } = usuario;
    const payload: Record<string, unknown> = {
      ...dados,
      departamento_id: null,
    };

    if (password?.trim()) {
      payload.password = password;
    }

    const { data } = await api.put(`/auth/users/${id}`, payload);
    return data;
  },
};

export default userService;

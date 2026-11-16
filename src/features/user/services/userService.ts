import api from "../../../shared/api/axios";
import { UsuarioFormData } from "../types/user";

export const userService = {
  async listarUsuarios() {
    const { data } = await api.get("/auth/users");
    return data;
  },

  async buscarUsuario(id: string) {
    const { data } = await api.get("/auth/users", {
      params: { id },
    });

    const usuarios = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];

    return usuarios.find((usuario) => String(usuario.id) === String(id)) ?? null;
  },

  async listarRoles() {
    const { data } = await api.get("/roles/all");
    return Array.isArray(data) ? data : (data?.data ?? []);
  },

  async cadastrarUsuario(usuario: UsuarioFormData) {
    const { role_id, ...dados } = usuario;
    const { data } = await api.post("/auth/register", {
      ...dados,
      roles: role_id ? [Number(role_id)] : [],
    });
    return data;
  },

  async editarUsuario(id: string, usuario: UsuarioFormData) {
    const { role_id, password, ...dados } = usuario;
    const payload: Record<string, unknown> = { ...dados };

    if (password?.trim()) {
      payload.password = password;
    }

    if (role_id) {
      payload.roles = [Number(role_id)];
    }

    const { data } = await api.put(`/auth/users/${id}`, payload);
    return data;
  },
};

export default userService;
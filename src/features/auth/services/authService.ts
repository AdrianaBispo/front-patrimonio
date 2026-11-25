import api from "../../../shared/api/axios";
import { LoginCredentials, AuthResult } from "../types/auth.types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },
  async me() {
    const { data } = await api.get("/auth/user");
    return data;
  },

  async logout() {
    const { data } = await api.post("/auth/logout");
    return data;
  },

  async listUsers() {
    const { data } = await api.get("/auth/users");
    return data;
  },

  async filtertUsers(nameFilter: string, idFilter?: string | null) {
    const { data } = await api.get(`/auth/users/`, {
      params: { name: `${nameFilter}`, id: `${idFilter}` },
    });
    return data;
  },

  async deactivateUser(id: string) {
    const { data } = await api.delete(`/auth/users/${id}`);
    return data;
  },

  async getNomeList() {
    const { data } = await api.get("/auth/users/nome-list");
    return data;
  },

  async getRefreshToken() {
    const { data } = await api.post("/auth/refresh");
    return data;
  },
};


export default authService;

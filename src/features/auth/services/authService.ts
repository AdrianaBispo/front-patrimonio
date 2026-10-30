import axios from "axios";
import { LoginCredentials, AuthResult } from "../types/auth.types";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },
  async me() {
    const { data } = await api.get("/auth/user");
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
};
export default authService;

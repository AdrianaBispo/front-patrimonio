import axios from "axios";
import { LoginCredentials, AuthResult } from "../types/auth.types";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
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

  async listUsers(){
    const {data} = await api.get("/auth/users");
    return data;
  },
  async deactivateUser(id: string) {
    const { data } = await api.delete(`auth/users/${id}`);
    return data;
  }
}
export default authService;
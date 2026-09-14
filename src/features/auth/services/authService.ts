import axios from "axios";
import { LoginCredentials, AuthResult } from "../types/auth.types";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },
};
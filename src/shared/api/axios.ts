import axios from "axios";
import { env } from "../../config/env";

const api = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let queue: Array<(ok: boolean) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // não tentar refresh na própria rota de refresh/login
    if (original.url?.includes("/auth/refresh") || original.url?.includes("/auth/login")) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push((ok) => (ok ? resolve(api(original)) : reject(error)));
      });
    }

    isRefreshing = true;
    try {
      await api.post("/auth/refresh"); // cookies HttpOnly
      queue.forEach((cb) => cb(true));
      queue = [];
      return api(original);
    } catch (e) {
      queue.forEach((cb) => cb(false));
      queue = [];
      window.location.href = "/auth";
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
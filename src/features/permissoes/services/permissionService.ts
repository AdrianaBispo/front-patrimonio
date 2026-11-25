import api from "../../../shared/api/axios";
import { Permission } from "../types/permission.types";

function normalizarLista(data: unknown): Permission[] {
  if (Array.isArray(data)) {
    return data as Permission[];
  }

  if (data && typeof data === "object") {
    const payload = data as Record<string, unknown>;
    if (Array.isArray(payload.permissions)) {
      return payload.permissions as Permission[];
    }
    if (Array.isArray(payload.data)) {
      return payload.data as Permission[];
    }
  }

  return [];
}

export const permissionService = {
  async listarPermissoes(): Promise<Permission[]> {
    const { data } = await api.get("/permissions/all");
    return normalizarLista(data);
  },
};

export default permissionService;

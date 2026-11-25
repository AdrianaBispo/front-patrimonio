import api from "../../../shared/api/axios";
import {
  CreateRolePayload,
  CreateRoleResponse,
  RolePermissionsResponse,
  UpdateRolePayload,
  UpdateRoleResponse,
} from "../types/role.types";

export const roleService = {
  async listRoles(page = 1, perPage = 10) {
    const params: Record<string, number> = {
      page,
      per_page: perPage,
    };

    const { data } = await api.get("/roles/all", { params });
    return data;
  },

  async createRole(payload: CreateRolePayload): Promise<CreateRoleResponse> {
    const { data } = await api.post<CreateRoleResponse>("/roles/create", {
      name: payload.name,
      permissions: payload.permissions,
    });
    return data;
  },

  async getRolePermissions(
    id: string | number,
  ): Promise<RolePermissionsResponse> {
    const { data } = await api.get<RolePermissionsResponse>(
      `/roles/${id}/permissions`,
    );
    return data;
  },

  async updateRole(
    id: string | number,
    payload: UpdateRolePayload,
  ): Promise<UpdateRoleResponse> {
    const { data } = await api.put<UpdateRoleResponse>(
      `/roles/update/${id}`,
      {
        permissions: payload.permissions,
      },
    );
    return data;
  },
};

export default roleService;

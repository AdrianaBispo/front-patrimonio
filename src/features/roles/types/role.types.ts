export type RolePermission = {
  id: number | string;
  name: string;
  assigned?: boolean;
};

export type Role = {
  id: number | string;
  name: string;
  guard_name?: string;
  permissions?: RolePermission[];
};

export type CreateRolePayload = {
  name: string;
  permissions: number[];
};

export type CreateRoleResponse = {
  message: string;
  role: Role;
};

export type RolePermissionsResponse = {
  role: Role;
  permissions: RolePermission[];
};

export type UpdateRolePayload = {
  permissions: number[];
};

export type UpdateRoleResponse = {
  message?: string;
  role?: Role;
};

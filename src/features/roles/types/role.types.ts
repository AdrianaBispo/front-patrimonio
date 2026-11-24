export type Role = {
  id: number | string;
  name: string;
  guard_name?: string;
  permissions?: Array<{
    id: number | string;
    name: string;
  }>;
};

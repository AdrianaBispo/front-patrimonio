export type User = {
  id: string;
  nome: string;
  celular: string | null;
  departamento_id?: string | null;
  departamento_name: string | null;
  cpf: string | null;
  email: string;
  status?: number | string;
  role_id?: number | string | null;
  role_name?: string | null;
};

export type UsuarioParaSelecao = Pick<User, "id" | "nome">;

export type Role = {
  id: number | string;
  name: string;
};

export type UsuarioFormData = {
  nome: string;
  celular: string;
  email: string;
  password?: string;
  role_id?: string;
};

export type UsuarioFormErrors = Partial<
  Record<keyof UsuarioFormData, string>
>;

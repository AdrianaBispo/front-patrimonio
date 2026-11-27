export type Category = {
  id?: string;
  nome?: string;
  nota?: string;
  tipo?: string;
  tipo_nome?: string;
};

export type CategoryFormData = {
  nome: string;
  tipo: string;
  nota?: string;
};

export type CategoryFormErrors = {
  id?: string;
  nome?: string;
  nota?: string;
  tipo?: string;
};

export type CategoryPaginator = {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number;
  to: number;
};

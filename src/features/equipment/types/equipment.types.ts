export type Equipment = {
  eqi_id?: string | number;
  id?: string | number;
  eqi_name: string;
  eqi_descricao: string;
  eqi_serie: string;
  eqi_status_id: number;
  categoria_id: number;
  tipo_equipamento_id: number;
  imagem_url: string | null;
  usuario_id: string;
  status_nome?: string;
  usuario_nome?: string;
  categoria_nome?: string;
  tipo_equipamento_nome?: string;
  created_at?: string;
  updated_at?: string;
};

export type EquipmentFormData = {
  eqi_name: string;
  eqi_descricao: string;
  eqi_serie: string;
  eqi_status_id: number | string;
  categoria_id: number | string;
  tipo_equipamento_id: number | string;
  imagem_url?: string | null;
  usuario_id: string;
};

export type EquipmentFormErrors = {
  nome?: string;
  descricao?: string;
  serie?: string;
  status_id?: string;
  categoria_id?: string;
  tipo_equipamento_id?: string;
  usuario_id?: string;
  imagem_url?: string;
  imagem_file?: string;
  image?: string;
};

export type EquipmentPaginator = {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number;
  to: number;
};

export type SelectOption = {
  id: string | number;
  nome: string;
};

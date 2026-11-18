export interface Equipamento {
  eqi_id?: string | number;
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
}

export interface Equipamento {
  id?: string | number;
  nome: string;
  descricao: string;
  serie: string;
  status_id: number;
  categoria_id: number;
  tipo_equipamento_id: number;
  imagem_url: string | null;
  usuario_id: string;
  status_nome?: string;
  usuario_nome?: string;
  categoria_nome?: string;
  tipo_equipamento_nome?: string;
}

export interface Equipamento {
  id?: string | number;
  nome: string;
  descricao: string;
  serie: string;
  status_id: number;
  imagem_url: string | null;
  usuario_id: string;
  status_nome?: string;
  usuario_nome?: string;
}

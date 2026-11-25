export interface HistoricoEquipamento {
  id: string;
  equipament_id?: string | number;
  status_id?: string | number;
  user_id?: string;
  date_time: string;
  equipament_nome: string;
  status_nome: string;
  user_nome: string;
}

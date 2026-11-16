import { Route, Routes } from "react-router-dom";
import HistoricoEquipamentosListaPage from "../../features/historicoEquipamentos/pages/HistoricoEquipamentosListaPage";

export default function HistoricoEquipamentoRoute() {
  return (
    <Routes>
      <Route index element={<HistoricoEquipamentosListaPage />} />
    </Routes>
  );
}

import { Routes, Route } from "react-router-dom";
import EquipamentosListaPage from "../../features/equipamentos/pages/EquipamentosListaPage";
import EquipamentoCadastroView from "../../features/equipamentos/pages/EquipamentosCadastroView";

export default function EquipamentoRoute() {
  return (
    <Routes>
      <Route index element={<EquipamentosListaPage />} />
      <Route path="/cadastrar" element={<EquipamentoCadastroView />} />
    </Routes>
  );
}

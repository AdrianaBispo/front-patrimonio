import { Routes, Route } from "react-router-dom";
import EquipamentosListaPage from "../../features/equipamentos/pages/EquipamentosListaPage";
import EquipamentoCadastroView from "../../features/equipamentos/pages/EquipamentosCadastroView";
import EquipamentoEditarPage from "../../features/equipamentos/pages/EquipamentoEditarPage";

export default function EquipamentoRoute() {
  return (
    <Routes>
      <Route index element={<EquipamentosListaPage />} />
      <Route path="/cadastrar" element={<EquipamentoCadastroView />} />
      <Route path="/editar/:id" element={<EquipamentoEditarPage />} />
    </Routes>
  );
}

import { Routes, Route } from "react-router-dom";
import EquipamentosLista from "./views/EquipamentosLista";
import EquipamentoCadastroView from "./views/EquipamentosCadastroView";

export default function EquipamentoRoute() {
  return (
    <Routes>
      <Route index element={<EquipamentosLista />} />
      <Route path="/cadastrar" element={<EquipamentoCadastroView />} />
    </Routes>
  );
}

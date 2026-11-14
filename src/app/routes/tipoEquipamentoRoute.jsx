import { Routes, Route } from "react-router-dom";
import TipoEquipamentoListaPage from "../../features/tipoEquipamento/pages/tipoEquipamentoListaPage";
import TipoEquipamentoCadastroPage from "../../features/tipoEquipamento/pages/tipoEquipamentoCadastroPage";

export default function TipoEquipamentoRoute() {
  return (
    <Routes>
      <Route index element={<TipoEquipamentoListaPage />} />
      <Route path="/cadastrar" element={<TipoEquipamentoCadastroPage />} />
    </Routes>
  );
}

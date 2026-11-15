import { Routes, Route } from "react-router-dom";
import TipoEquipamentoListaPage from "../../features/tipoEquipamento/pages/tipoEquipamentoListaPage";
import TipoEquipamentoCadastroPage from "../../features/tipoEquipamento/pages/tipoEquipamentoCadastroPage";
import TipoEquipamentoEditarPage from "../../features/tipoEquipamento/pages/tipoEquipamentoEditarPage";

export default function TipoEquipamentoRoute() {
  return (
    <Routes>
      <Route index element={<TipoEquipamentoListaPage />} />
      <Route path="/cadastrar" element={<TipoEquipamentoCadastroPage />} />
      <Route path="/editar/:id" element={<TipoEquipamentoEditarPage />} />
    </Routes>
  );
}

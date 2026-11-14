import { Routes, Route } from "react-router-dom";

export default function ColaboradorRoute() {
  return (
    <Routes>
      <Route index element={<TipoEquipamentoListaPage />} />
      <Route path="/cadastrar" element={<TipoEquipamentoCadastroPage />} />
    </Routes>
  );
}

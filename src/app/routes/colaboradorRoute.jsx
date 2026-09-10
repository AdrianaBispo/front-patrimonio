import { Routes, Route } from "react-router-dom";
import ColaboradorPage from "../../features/colaborador/pages/colaboradorPage";
import ColaboradorCadastroPage from "../../features/colaborador/pages/colaboradorCadastroPage";

export default function ColaboradorRoute() {
  return (
    <Routes>
      <Route index element={<ColaboradorPage />} />
      <Route path="/cadastrar" element={<ColaboradorCadastroPage />} />
    </Routes>
  );
}

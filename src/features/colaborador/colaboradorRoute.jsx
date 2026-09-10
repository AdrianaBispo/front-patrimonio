import { Routes, Route } from "react-router-dom";
import ColaboradorPage from "./views/colaboradorPage";
import ColaboradorCadastroPage from "./views/colaboradorCadastroPage";

export default function ColaboradorRoute() {
  return (
    <Routes>
      <Route index element={<ColaboradorPage />} />
      <Route path="/cadastrar" element={<ColaboradorCadastroPage />} />
    </Routes>
  );
}

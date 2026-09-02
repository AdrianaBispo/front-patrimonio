import { Routes, Route } from "react-router-dom";
import ColaboradorCadastroView from "./views/colaboradorCadastroView";
import ColaboradorPage from "./views/colaboradorPage";

export default function ColaboradorRoute() {
  return (
    <Routes>
      <Route index element={<ColaboradorPage />} />
      <Route path="/cadastrar" element={<ColaboradorCadastroView />} />
    </Routes>
  );
}

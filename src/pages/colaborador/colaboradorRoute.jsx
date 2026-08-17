import { Routes, Route } from "react-router-dom";
import ColaboradorView from "./views/ColaboradorView";
import ColaboradorCadastroView from "./views/colaboradorCadastroView";

export default function ColaboradorRoute() {
  return (
    <Routes>
      <Route index element={<ColaboradorView />} />
      <Route path="/cadastrar" element={<ColaboradorCadastroView />} />
    </Routes>
  );
}

import { Routes, Route } from "react-router-dom";
import FornecedorLista from "./views/FornecedorLista";
import FornecedorCadastroView from "./views/FornecedorCadastroView";

export default function FornecedorRoute() {
  return (
    <Routes>
      <Route index element={<FornecedorLista />} />
      <Route path="/cadastrar" element={<FornecedorCadastroView/>} />
    </Routes>
  );
}

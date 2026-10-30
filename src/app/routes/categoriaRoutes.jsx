import { Routes, Route } from "react-router-dom";
import CategoriaListaPage from "../../features/Categorias/pages/CategoriaListaPage";
import CadastrarCategoriaPage from "../../features/Categorias/pages/CategoriaCadastroView";

export default function CategoriaRoute() {
  return (
    <Routes>
      <Route index element={<CategoriaListaPage />} />
     <Route path="/cadastrar" element={<CadastrarCategoriaPage />} />
    </Routes>
  );
}

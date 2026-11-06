import { Routes, Route } from "react-router-dom";
import CategoriaListaPage from "../../features/Categorias/pages/CategoriaListaPage";
import CadastrarCategoriaPage from "../../features/Categorias/pages/CategoriaCadastroView";
import EditarCategoriaPage from "../../features/Categorias/pages/EditarCategoriaView";

export default function CategoriaRoute() {
  return (
    <Routes>
      <Route index element={<CategoriaListaPage />} />
      <Route path="/cadastrar" element={<CadastrarCategoriaPage />} />
      <Route path="/editar/:id" element={<EditarCategoriaPage />}></Route>
    </Routes>
  );
}

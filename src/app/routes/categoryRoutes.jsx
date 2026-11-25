import { Routes, Route } from "react-router-dom";
import CategoryListPage from "../../features/categories/pages/categoryListPage";
import CategoryCreatePage from "../../features/categories/pages/categoryCreatePage";
import CategoryEditPage from "../../features/categories/pages/categoryEditPage";

export default function CategoryRoute() {
  return (
    <Routes>
      <Route index element={<CategoryListPage />} />
      <Route path="/cadastrar" element={<CategoryCreatePage />} />
      <Route path="/editar/:id" element={<CategoryEditPage />}></Route>
    </Routes>
  );
}

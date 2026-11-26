import { Routes, Route } from "react-router-dom";
import UserListPage from "../../features/user/pages/UserListPage";
import UserCreatePage from "../../features/user/pages/UserCreatePage";
import UserEditPage from "../../features/user/pages/UserEditPage";

export default function UserRoute() {
  return (
    <Routes>
      {/* Rota padrão (Ex: /users) -> Lista de Usuários */}
      <Route index element={<UserListPage />} />

      <Route path="/cadastrar" element={<UserCreatePage />} />
      <Route path="/editar/:id" element={<UserEditPage />}></Route>
    </Routes>
  );
}
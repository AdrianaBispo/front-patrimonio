import { Routes, Route } from "react-router-dom";
import UserListView from "../../features/user/pages/userListPage";
import UserCreatePage from "../../features/user/pages/userCreatePage";
import UserEditPage from "../../features/user/pages/userEditPage";

export default function UserRoute() {
  return (
    <Routes>
      {/* Rota padrão (Ex: /users) -> Lista de Usuários */}
      <Route index element={<UserListView />} />

      <Route path="/cadastrar" element={<UserCreatePage />} />
      <Route path="/editar/:id" element={<UserEditPage />}></Route>
    </Routes>
  );
}
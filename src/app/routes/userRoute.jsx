import { Routes, Route } from "react-router-dom";
import UserListView from "../../features/user/pages/userListPage";
import CadastrarUserPage from "../../features/user/pages/CadastrarUsuarioPage";
import EditarUsuarioPage from "../../features/user/pages/EditarUsuarioPage";

export default function UserRoute() {
  return (
    <Routes>
      {/* Rota padrão (Ex: /users) -> Lista de Usuários */}
      <Route index element={<UserListView />} />

      <Route path="/cadastrar" element={<CadastrarUserPage />} />
      <Route path="/editar" element={<EditarUsuarioPage />}></Route>
    </Routes>
  );
}
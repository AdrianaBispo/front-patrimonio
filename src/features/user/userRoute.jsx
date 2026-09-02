import { Routes, Route } from "react-router-dom";
import CadastrarUser from "./usersList/pages/CadastrarUsuarioPage";
import UserListView from "./usersList/pages/userListPage";
import EditarUsuarioView from "./usersList/pages/EditarUsuarioPage";
import CadastrarUserPage from "./usersList/pages/CadastrarUsuarioPage";
import EditarUsuarioPage from "./usersList/pages/EditarUsuarioPage";

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
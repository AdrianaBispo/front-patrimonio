import { Routes, Route } from "react-router-dom";
import UserListView from "./pages/userListPage";
import CadastrarUserPage from "./pages/CadastrarUsuarioPage";
import EditarUsuarioPage from "./pages/EditarUsuarioPage";

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
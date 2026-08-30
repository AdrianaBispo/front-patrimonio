import { Routes, Route } from "react-router-dom";
import CadastrarUser from "./cadastro/views/CadastrarUser";
import UserListView from "./usersList/views/userList";
import EditarUsuarioView from "./usersList/views/EditarUsuario";

export default function UserRoute() {
  return (
    <Routes>
      {/* Rota padrão (Ex: /users) -> Lista de Usuários */}
      <Route index element={<UserListView />} />

      <Route path="/cadastrar" element={<CadastrarUser />} />
      <Route path="/editar" element={<EditarUsuarioView />}></Route>
    </Routes>
  );
}
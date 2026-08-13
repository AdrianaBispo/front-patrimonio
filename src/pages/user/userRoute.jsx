import { Routes, Route } from "react-router-dom";
import CadastrarUser from "./cadastro/views/CadastrarUser";
import UserListView from "./usersList/views/userList";

export default function UserRoute() {
  return (
    <Routes>
      {/* Rota padrão (Ex: /users) -> Lista de Usuários */}
      <Route index element={<UserListView />} />

      {/* Rota relativa (Ex: /users/cadastrar) -> Formulário de Cadastro */}
      <Route path="/cadastrar" element={<CadastrarUser />} />
    </Routes>
  );
}
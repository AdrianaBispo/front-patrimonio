import { Route, Routes } from "react-router-dom";

import RolesPageLista from "../../features/roles/pages/rolesPageLista";
import RolesCadastroPage from "../../features/roles/pages/rolesCadastroPage";
import RolesEditarPage from "../../features/roles/pages/rolesEditarPage";

export default function RoleRoute() {
  return (
    <Routes>
      <Route index element={<RolesPageLista />} />
      <Route path="cadastrar" element={<RolesCadastroPage />} />
      <Route path="editar/:id" element={<RolesEditarPage />} />
    </Routes>
  );
}

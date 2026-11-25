import { Route, Routes } from "react-router-dom";

import RolesListPage from "../../features/roles/pages/rolesListPage";
import RolesCreatePage from "../../features/roles/pages/rolesCreatePage";
import RolesEditPage from "../../features/roles/pages/rolesEditPage";

export default function RoleRoute() {
  return (
    <Routes>
      <Route index element={<RolesListPage />} />
      <Route path="cadastrar" element={<RolesCreatePage />} />
      <Route path="editar/:id" element={<RolesEditPage />} />
    </Routes>
  );
}

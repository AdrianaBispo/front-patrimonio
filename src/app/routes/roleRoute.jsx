import { Route, Routes } from "react-router-dom";

import RolesListPage from "../../features/roles/pages/RolesListPage";
import RolesCreatePage from "../../features/roles/pages/RolesCreatePage";
import RolesEditPage from "../../features/roles/pages/RolesEditPage";

export default function RoleRoute() {
  return (
    <Routes>
      <Route index element={<RolesListPage />} />
      <Route path="cadastrar" element={<RolesCreatePage />} />
      <Route path="editar/:id" element={<RolesEditPage />} />
    </Routes>
  );
}

import { Route, Routes } from "react-router-dom";

import RolesPageLista from "../../features/roles/pages/rolesPageLista";

export default function RoleRoute() {
  return (
    <Routes>
      <Route index element={<RolesPageLista />} />
    </Routes>
  );
}

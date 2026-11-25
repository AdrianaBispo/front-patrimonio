import { Route, Routes } from "react-router-dom";
import PermissionsPage from "../../features/permissoes/pages/permissionsPage";

export default function PermissionRoute() {
  return (
    <Routes>
      <Route index element={<PermissionsPage />} />
    </Routes>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App";
import AuthRoute from "./app/routes/authRoutes";
import UserRoute from "./app/routes/userRoute";
import EquipmentRoute from "./app/routes/equipmentRoute";
// import SupplierRoute from "./pages/fornecedor/SupplierRoute";
import CollaboratorRoute from "./app/routes/collaboratorRoute";
import { ToastContainer } from 'react-toastify';
import CategoryRoute from "./app/routes/categoryRoutes";
import EquipmentTypeRoute from "./app/routes/equipmentTypeRoute";
import EquipmentHistoryRoute from "./app/routes/equipmentHistoryRoute";
import RoleRoute from "./app/routes/roleRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRoute />} />
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="users/*" element={<UserRoute />} />
          <Route path="roles/*" element={<RoleRoute />} />
          <Route path="equipamentos/*" element={<EquipmentRoute />} />
          <Route path="categorias/*" element={<CategoryRoute/>}/>
          {/* <Route path="fornecedores/*" element={<SupplierRoute />} /> */}
          <Route path="colaboradores/*" element={<CollaboratorRoute />} />
          <Route path="categoria/*" element={<CategoryRoute/>}/>
          <Route path="tipo-equipamento/*" element={<EquipmentTypeRoute/>}/>
          <Route
            path="historico-equipamentos/*"
            element={<EquipmentHistoryRoute />}
          />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App";
import AuthRoute from "./app/routes/authRoutes";
import UserRoute from "./app/routes/userRoute";
import EquipamentoRoute from "./app/routes/equipamentoRoute";
// import FornecedorRoute from "./pages/fornecedor/FornecedorRoute";
import ColaboradorRoute from "./app/routes/colaboradorRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth/*" element={<AuthRoute />} />
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="users/*" element={<UserRoute />} />
          <Route path="equipamentos/*" element={<EquipamentoRoute />} />
           {/* <Route path="fornecedores/*" element={<FornecedorRoute />} /> */}
          <Route path="colaboradores/*" element={<ColaboradorRoute />} /> 
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

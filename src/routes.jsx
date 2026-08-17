import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App";
import AuthRoute from "./pages/auth/authRoutes";
import UserRoute from "./pages/user/userRoute";
import EquipamentoRoute from "./pages/equipamentos/equipamentoRoute";
import FornecedorRoute from "./pages/fornecedor/FornecedorRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas de Autenticação (sem o menu lateral do App) */}
        <Route path="/auth/*" element={<AuthRoute />} />

        {/* Layout Principal (Com SideMenu e Outlet) */}
        <Route path="/" element={<App />}>
          {/* Ao acessar "/", redireciona para "/users" */}
          <Route index element={<Navigate to="/users" replace />} />

          <Route path="users/*" element={<UserRoute />} />

          <Route path="equipamentos/*" element={<EquipamentoRoute />} />

          <Route path="fornecedores/*" element={<FornecedorRoute/>}/>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

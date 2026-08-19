import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../login/ui/LoginPage";
import ForgotPassword from "../login/ui/ForgotPasswordPage";

export default function AuthRoute() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

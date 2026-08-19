import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./login/pages/LoginPage";
import ForgotPasswordPage from "./forgotPassword/pages/ForgotPasswordPage";

export default function AuthRoute() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />}/>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    </Routes>
  );
}

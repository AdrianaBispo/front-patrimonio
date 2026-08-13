import { BrowserRouter, Routes, Route } from "react-router-dom";


import Login from "./login/views/Login";
import ForgotPassword from "./forgot_password/views/ForgotPassword";

export default function AuthRoute() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

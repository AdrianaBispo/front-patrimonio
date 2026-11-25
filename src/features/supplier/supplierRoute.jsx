import { Routes, Route } from "react-router-dom";
import SupplierList from "./views/SupplierList";
import SupplierCreateView from "./views/SupplierCreateView";

export default function SupplierRoute() {
  return (
    <Routes>
      <Route index element={<SupplierList />} />
      <Route path="/cadastrar" element={<SupplierCreateView/>} />
    </Routes>
  );
}

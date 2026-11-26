import { Routes, Route } from "react-router-dom";
import EquipmentListPage from "../../features/equipment/pages/EquipmentListPage";
import EquipmentCreatePage from "../../features/equipment/pages/EquipmentCreatePage";
import EquipmentEditPage from "../../features/equipment/pages/EquipmentEditPage";

export default function EquipmentRoute() {
  return (
    <Routes>
      <Route index element={<EquipmentListPage />} />
      <Route path="/cadastrar" element={<EquipmentCreatePage />} />
      <Route path="/editar/:id" element={<EquipmentEditPage />} />
    </Routes>
  );
}

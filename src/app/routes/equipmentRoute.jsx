import { Routes, Route } from "react-router-dom";
import EquipmentListPage from "../../features/equipment/pages/equipmentListPage";
import EquipmentCreatePage from "../../features/equipment/pages/equipmentCreatePage";
import EquipmentEditPage from "../../features/equipment/pages/equipmentEditPage";

export default function EquipmentRoute() {
  return (
    <Routes>
      <Route index element={<EquipmentListPage />} />
      <Route path="/cadastrar" element={<EquipmentCreatePage />} />
      <Route path="/editar/:id" element={<EquipmentEditPage />} />
    </Routes>
  );
}

import { Routes, Route } from "react-router-dom";
import EquipmentTypeListPage from "../../features/equipmentType/pages/equipmentTypeListPage";
import EquipmentTypeCreatePage from "../../features/equipmentType/pages/equipmentTypeCreatePage";
import EquipmentTypeEditPage from "../../features/equipmentType/pages/equipmentTypeEditPage";

export default function EquipmentTypeRoute() {
  return (
    <Routes>
      <Route index element={<EquipmentTypeListPage />} />
      <Route path="/cadastrar" element={<EquipmentTypeCreatePage />} />
      <Route path="/editar/:id" element={<EquipmentTypeEditPage />} />
    </Routes>
  );
}

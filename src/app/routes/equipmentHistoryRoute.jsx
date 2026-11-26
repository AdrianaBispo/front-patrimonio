import { Route, Routes } from "react-router-dom";
import EquipmentHistoryListPage from "../../features/equipmentHistory/pages/EquipmentHistoryListPage";

export default function EquipmentHistoryRoute() {
  return (
    <Routes>
      <Route index element={<EquipmentHistoryListPage />} />
    </Routes>
  );
}

import { Route, Routes } from "react-router-dom";
import EquipmentHistoryListPage from "../../features/equipmentHistory/pages/equipmentHistoryListPage";

export default function EquipmentHistoryRoute() {
  return (
    <Routes>
      <Route index element={<EquipmentHistoryListPage />} />
    </Routes>
  );
}

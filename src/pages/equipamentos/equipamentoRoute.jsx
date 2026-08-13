import { Routes, Route } from "react-router-dom";
import InventoryList from "./views/InventoryList.view";

export default function EquipamentoRoute() {
  return (
    <Routes>
      <Route index element={<InventoryList />} />
    </Routes>
  );
}
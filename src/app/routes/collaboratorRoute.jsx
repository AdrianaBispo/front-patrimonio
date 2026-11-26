import { Routes, Route } from "react-router-dom";
import CollaboratorPage from "../../features/collaborator/pages/CollaboratorPage";
import CollaboratorCreatePage from "../../features/collaborator/pages/CollaboratorCreatePage";

export default function CollaboratorRoute() {
  return (
    <Routes>
      <Route index element={<CollaboratorPage />} />
      <Route path="/cadastrar" element={<CollaboratorCreatePage />} />
    </Routes>
  );
}

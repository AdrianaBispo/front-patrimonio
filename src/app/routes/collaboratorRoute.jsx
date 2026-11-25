import { Routes, Route } from "react-router-dom";
import CollaboratorPage from "../../features/collaborator/pages/collaboratorPage";
import CollaboratorCreatePage from "../../features/collaborator/pages/collaboratorCreatePage";

export default function CollaboratorRoute() {
  return (
    <Routes>
      <Route index element={<CollaboratorPage />} />
      <Route path="/cadastrar" element={<CollaboratorCreatePage />} />
    </Routes>
  );
}

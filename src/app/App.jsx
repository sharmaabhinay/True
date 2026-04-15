import { Navigate, Route, Routes } from "react-router-dom";
import StorePage from "../pages/StorePage";
import AdminPage from "../pages/AdminPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StorePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

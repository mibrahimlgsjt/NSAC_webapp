import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AdminAnimalCreate from "../pages/AdminAnimalCreate.jsx";
import AdminAnimalEdit from "../pages/AdminAnimalEdit.jsx";
import AdminAnimals from "../pages/AdminAnimals.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import AdminFeedings from "../pages/AdminFeedings.jsx";
import AdminInventory from "../pages/AdminInventory.jsx";
import AdminInventoryCreate from "../pages/AdminInventoryCreate.jsx";
import AdminInventoryEdit from "../pages/AdminInventoryEdit.jsx";
import AdminMedical from "../pages/AdminMedical.jsx";
import AdminReports from "../pages/AdminReports.jsx";
import AnimalDetail from "../pages/AnimalDetail.jsx";
import AnimalDirectory from "../pages/AnimalDirectory.jsx";
import EmergencyReport from "../pages/EmergencyReport.jsx";
import FeedStatus from "../pages/FeedStatus.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import NewSighting from "../pages/NewSighting.jsx";
import SectorAnimals from "../pages/SectorAnimals.jsx";
import Sightings from "../pages/Sightings.jsx";
import SpeciesAnimals from "../pages/SpeciesAnimals.jsx";
import Volunteers from "../pages/Volunteers.jsx";

function AdminOnly({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/animals" element={<AnimalDirectory />} />
      <Route path="/animals/:id" element={<AnimalDetail />} />
      <Route path="/animals/species/:species" element={<SpeciesAnimals />} />
      <Route path="/animals/sector/:sector" element={<SectorAnimals />} />
      <Route path="/feed-status" element={<FeedStatus />} />
      <Route path="/sightings" element={<Sightings />} />
      <Route path="/sightings/new" element={<NewSighting />} />
      <Route path="/emergency" element={<EmergencyReport />} />
      <Route path="/volunteers" element={<Volunteers />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminOnly><AdminDashboard /></AdminOnly>} />
      <Route path="/admin/animals" element={<AdminOnly><AdminAnimals /></AdminOnly>} />
      <Route path="/admin/animals/new" element={<AdminOnly><AdminAnimalCreate /></AdminOnly>} />
      <Route path="/admin/animals/:id/edit" element={<AdminOnly><AdminAnimalEdit /></AdminOnly>} />
      <Route path="/admin/inventory" element={<AdminOnly><AdminInventory /></AdminOnly>} />
      <Route path="/admin/inventory/new" element={<AdminOnly><AdminInventoryCreate /></AdminOnly>} />
      <Route path="/admin/inventory/:id/edit" element={<AdminOnly><AdminInventoryEdit /></AdminOnly>} />
      <Route path="/admin/medical" element={<AdminOnly><AdminMedical /></AdminOnly>} />
      <Route path="/admin/reports" element={<AdminOnly><AdminReports /></AdminOnly>} />
      <Route path="/admin/feedings" element={<AdminOnly><AdminFeedings /></AdminOnly>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;

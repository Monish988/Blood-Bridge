import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login";
import Dashboard from "../Components/DashBoard/DashBoard";
import ProtectedRoute from "../Components/ProtectedRoute";
import Layout from "../Layout";
import Donor from "../Components/Donor/Donor";
import Inventory from "../Components/Inventory/Inventory";
import Request from "../Components/BloodRequests/Request";
import Hospital from "../Components/Hospitals/Hospital";
import SignUp from "../pages/Signup";
import DonorRegister from "../Components/Donor/DonorRegister";
const AppRoutes = () => (
<Routes>
  <Route path="/" element={<Navigate to="/login" />} />

  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<SignUp />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="donors" element={<Donor />} />
    <Route path="inventory" element={<Inventory />} />
    <Route path="requests" element={<Request />} />
    <Route path="hospitals" element={<Hospital />} />
    <Route path="register-donor" element={<DonorRegister />} />
  </Route>
</Routes>

  
);

export default AppRoutes;

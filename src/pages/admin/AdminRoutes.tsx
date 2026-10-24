import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { AdminAuthProvider, RequireAdmin } from "../../components/admin/AdminAuth";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";

const AdminRoutes: FC = () => (
  <AdminAuthProvider>
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path="*"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />
    </Routes>
  </AdminAuthProvider>
);

export default AdminRoutes;

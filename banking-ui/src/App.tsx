import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import RequireAuth from './pages/RequireAuth';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Protected Customer Route */}
        <Route
          path="/customer"
          element={
            <RequireAuth allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
            </RequireAuth>
          }
        />

        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <RequireAuth allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<h2>404 - Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
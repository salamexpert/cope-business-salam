import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components';
import {
  Login,
  SignUp,
  ForgotPassword,
  Dashboard,
  BuyServices,
  MyOrders,
  Wallet,
  Invoices,
  Reports,
  SupportTickets,
  Settings
} from './pages';
import {
  AdminDashboard,
  AdminClients,
  AdminTickets,
  AdminInvoices,
  AdminReports,
  AdminSettings
} from './pages/admin';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Client Dashboard routes (protected) */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRole="client">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/services" element={
            <ProtectedRoute allowedRole="client">
              <BuyServices />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/orders" element={
            <ProtectedRoute allowedRole="client">
              <MyOrders />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/wallet" element={
            <ProtectedRoute allowedRole="client">
              <Wallet />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/invoices" element={
            <ProtectedRoute allowedRole="client">
              <Invoices />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/reports" element={
            <ProtectedRoute allowedRole="client">
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/tickets" element={
            <ProtectedRoute allowedRole="client">
              <SupportTickets />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/settings" element={
            <ProtectedRoute allowedRole="client">
              <Settings />
            </ProtectedRoute>
          } />

          {/* Admin Dashboard routes (protected) */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/clients" element={
            <ProtectedRoute allowedRole="admin">
              <AdminClients />
            </ProtectedRoute>
          } />
          <Route path="/admin/tickets" element={
            <ProtectedRoute allowedRole="admin">
              <AdminTickets />
            </ProtectedRoute>
          } />
          <Route path="/admin/invoices" element={
            <ProtectedRoute allowedRole="admin">
              <AdminInvoices />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRole="admin">
              <AdminReports />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRole="admin">
              <AdminSettings />
            </ProtectedRoute>
          } />

          {/* Catch-all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

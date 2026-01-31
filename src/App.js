import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  Login,
  SignUp,
  ForgotPassword,
  Dashboard,
  BuyServices,
  MyOrders,
  Wallet,
  Invoices,
  SupportTickets,
  Settings
} from './pages';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<BuyServices />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/tickets" element={<SupportTickets />} />
        <Route path="/settings" element={<Settings />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

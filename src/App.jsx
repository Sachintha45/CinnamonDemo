import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Inventory from './pages/Inventory';
import Purchasing from './pages/Purchasing';
import Billing from './pages/Billing';
import Exports from './pages/Exports';
import PaymentGateway from './pages/PaymentGateway';
import HRPayroll from './pages/HRPayroll';
import Accounting from './pages/Accounting';
import './index.css';

function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/purchasing" element={<Purchasing />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/exports" element={<Exports />} />
        <Route path="/payments" element={<PaymentGateway />} />
        <Route path="/hr" element={<HRPayroll />} />
        <Route path="/accounting" element={<Accounting />} />
      </Routes>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          loggedIn ? <Navigate to="/" /> : <Login onLogin={() => setLoggedIn(true)} />
        } />
        <Route path="/*" element={
          loggedIn ? <AppLayout /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  );
}

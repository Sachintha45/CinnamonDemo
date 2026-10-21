import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, ShoppingCart, FileText,
  Landmark, LogOut, ChevronLeft, ChevronRight, Ship, Send, UserCog
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'User Management' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/purchasing', icon: ShoppingCart, label: 'Purchasing' },
  { to: '/billing', icon: FileText, label: 'Billing & Sales' },
  { to: '/exports', icon: Ship, label: 'Exports & Shipping' },
  { to: '/payments', icon: Send, label: 'Payment Gateway' },
  { to: '/hr', icon: UserCog, label: 'HR & Payroll' },
  { to: '/accounting', icon: Landmark, label: 'Accounting' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`bg-primary text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex items-center gap-3 border-b border-primary-light">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-primary-dark font-bold text-lg">C</span>
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-base font-bold leading-tight">Ceylon Cinnamon</h1>
            <p className="text-xs text-accent opacity-80">Export Management</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-primary-light p-4">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-primary-dark font-semibold text-sm">KP</span>
            </div>
            <div>
              <p className="text-sm font-medium">Kamal Perera</p>
              <p className="text-xs text-white/60">Admin</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm w-full"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && 'Collapse'}
        </button>
      </div>
    </aside>
  );
}

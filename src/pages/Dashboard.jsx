import { Package, TrendingUp, ShoppingCart, DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../components/StatCard';
import Header from '../components/Header';
import { inventory, purchases, salesInvoices, monthlyRevenue } from '../data/mockData';

export default function Dashboard() {
  const totalStock = inventory.reduce((acc, i) => acc + i.quantity, 0);
  const lowStockItems = inventory.filter(i => i.quantity <= i.minStock * 1.2);
  const pendingInvoices = salesInvoices.filter(i => i.status === 'Pending');
  const totalSales = salesInvoices.reduce((acc, i) => acc + i.total, 0);

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Dashboard" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Package} label="Total Inventory" value={`${totalStock.toLocaleString()} kg`} subtitle="Across all grades" color="primary" />
          <StatCard icon={TrendingUp} label="Total Sales (Oct)" value={`Rs. ${(totalSales / 1000000).toFixed(1)}M`} subtitle={`${salesInvoices.length} invoices`} color="success" />
          <StatCard icon={ShoppingCart} label="Purchases (Oct)" value={`${purchases.length} orders`} subtitle={`${purchases.reduce((a, p) => a + p.totalNet, 0).toLocaleString()} kg received`} color="info" />
          <StatCard icon={AlertTriangle} label="Low Stock Alerts" value={lowStockItems.length} subtitle="Items need restocking" color="warning" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Revenue vs Expenses (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#8B4513" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#DEB887" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Inventory by Grade</h3>
            <div className="space-y-3">
              {inventory.map(item => {
                const percentage = (item.quantity / Math.max(...inventory.map(i => i.quantity))) * 100;
                const isLow = item.quantity <= item.minStock * 1.2;
                return (
                  <div key={item.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.grade}</span>
                      <span className={`font-medium ${isLow ? 'text-danger' : 'text-gray-800'}`}>{item.quantity} {item.unit}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${isLow ? 'bg-danger' : 'bg-primary'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Recent Purchase Orders</h3>
            <div className="space-y-3">
              {purchases.slice(0, 4).map(po => (
                <div key={po.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{po.id} — {po.supplier}</p>
                    <p className="text-xs text-gray-500">{po.date} · {po.totalNet.toLocaleString()} kg net</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    po.status === 'Completed' ? 'bg-green-100 text-success' :
                    po.status === 'Pending Payment' ? 'bg-amber-100 text-warning' :
                    'bg-blue-100 text-info'
                  }`}>{po.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Pending Invoices</h3>
            <div className="space-y-3">
              {pendingInvoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{inv.id} — {inv.customer}</p>
                    <p className="text-xs text-gray-500">Due: {inv.dueDate}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">Rs. {inv.total.toLocaleString()}</span>
                </div>
              ))}
              {pendingInvoices.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No pending invoices</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

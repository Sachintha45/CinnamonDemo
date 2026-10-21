import { useState } from 'react';
import { Package, Plus, Edit2, AlertTriangle, Search, Filter, X } from 'lucide-react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { inventory as initialInventory } from '../data/mockData';

export default function Inventory() {
  const [inventory, setInventory] = useState(initialInventory);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ grade: '', quantity: '', unit: 'kg', location: 'Warehouse A', minStock: '', pricePerKg: '' });

  const filtered = inventory.filter(i => i.grade.toLowerCase().includes(search.toLowerCase()));
  const totalStock = inventory.reduce((a, i) => a + i.quantity, 0);
  const totalValue = inventory.reduce((a, i) => a + i.quantity * i.pricePerKg, 0);
  const lowStock = inventory.filter(i => i.quantity <= i.minStock * 1.2);

  const openNew = () => {
    setEditItem(null);
    setForm({ grade: '', quantity: '', unit: 'kg', location: 'Warehouse A', minStock: '', pricePerKg: '' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ grade: item.grade, quantity: item.quantity, unit: item.unit, location: item.location, minStock: item.minStock, pricePerKg: item.pricePerKg });
    setShowModal(true);
  };

  const handleSave = () => {
    const parsed = { ...form, quantity: Number(form.quantity), minStock: Number(form.minStock), pricePerKg: Number(form.pricePerKg) };
    if (editItem) {
      setInventory(inventory.map(i => i.id === editItem.id ? { ...i, ...parsed, lastUpdated: '2024-10-22' } : i));
    } else {
      setInventory([...inventory, { id: Date.now(), ...parsed, lastUpdated: '2024-10-22' }]);
    }
    setShowModal(false);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Inventory Management" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard icon={Package} label="Total Stock" value={`${totalStock.toLocaleString()} kg`} color="primary" />
          <StatCard icon={Package} label="Total Value" value={`Rs. ${(totalValue / 1000000).toFixed(1)}M`} color="success" />
          <StatCard icon={AlertTriangle} label="Low Stock Items" value={lowStock.length} subtitle="Below threshold" color="warning" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by grade..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">
              <Plus size={18} /> Add Item
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Price/kg</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Value</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const isLow = item.quantity <= item.minStock * 1.2;
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800">{item.grade}</p>
                      <p className="text-xs text-gray-400">Min: {item.minStock} {item.unit}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`text-sm font-semibold ${isLow ? 'text-danger' : 'text-gray-800'}`}>
                        {item.quantity.toLocaleString()} {item.unit}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{item.location}</td>
                    <td className="px-5 py-4 text-right text-sm text-gray-600">Rs. {item.pricePerKg.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-gray-800">Rs. {(item.quantity * item.pricePerKg).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      {isLow ? (
                        <span className="flex items-center gap-1 text-xs text-danger font-medium"><AlertTriangle size={14} /> Low Stock</span>
                      ) : (
                        <span className="text-xs text-success font-medium">In Stock</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md">
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-800">{editItem ? 'Edit Inventory Item' : 'Add Inventory Item'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade Name</label>
                  <input value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="kg">Kilograms (kg)</option>
                      <option value="L">Liters (L)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>Warehouse A</option>
                    <option>Warehouse B</option>
                    <option>Warehouse C</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock Level</label>
                    <input type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per kg (Rs.)</label>
                    <input type="number" value={form.pricePerKg} onChange={e => setForm({ ...form, pricePerKg: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">
                  {editItem ? 'Update' : 'Add Item'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

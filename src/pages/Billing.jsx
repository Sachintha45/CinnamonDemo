import { useState } from 'react';
import { FileText, Plus, Eye, X, Download, Printer, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { salesInvoices as initialInvoices } from '../data/mockData';

const grades = ['Alba (C-00000)', 'C-00000 Special', 'C-0000', 'C-000', 'C-00', 'C-0', 'Quillings', 'Cinnamon Bark Oil'];

export default function Billing() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [form, setForm] = useState({
    customer: '',
    date: '2024-10-22',
    dueDate: '2024-11-22',
    items: [{ grade: grades[0], qty: '', price: '' }],
  });

  const totalRevenue = invoices.reduce((a, i) => a + i.total, 0);
  const paidAmount = invoices.filter(i => i.status === 'Paid').reduce((a, i) => a + i.total, 0);
  const pendingAmount = invoices.filter(i => i.status === 'Pending').reduce((a, i) => a + i.total, 0);

  const addLineItem = () => setForm({ ...form, items: [...form.items, { grade: grades[0], qty: '', price: '' }] });
  const updateItem = (idx, field, val) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [field]: val };
    setForm({ ...form, items });
  };
  const removeItem = (idx) => {
    if (form.items.length > 1) setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  };

  const handleSave = () => {
    const items = form.items.map(i => ({ grade: i.grade, qty: Number(i.qty), price: Number(i.price), total: Number(i.qty) * Number(i.price) }));
    const total = items.reduce((a, i) => a + i.total, 0);
    const newInv = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      date: form.date,
      customer: form.customer,
      items,
      total,
      status: 'Draft',
      dueDate: form.dueDate,
    };
    setInvoices([newInv, ...invoices]);
    setShowModal(false);
    setForm({ customer: '', date: '2024-10-22', dueDate: '2024-11-22', items: [{ grade: grades[0], qty: '', price: '' }] });
  };

  const formTotal = form.items.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.price) || 0), 0);

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Billing & Sales" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard icon={FileText} label="Total Revenue" value={`Rs. ${(totalRevenue / 1000000).toFixed(1)}M`} color="success" />
          <StatCard icon={FileText} label="Paid" value={`Rs. ${(paidAmount / 1000000).toFixed(1)}M`} color="info" />
          <StatCard icon={FileText} label="Pending" value={`Rs. ${(pendingAmount / 1000000).toFixed(1)}M`} subtitle={`${invoices.filter(i => i.status === 'Pending').length} invoices`} color="warning" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex gap-2">
              {['All', 'Paid', 'Pending', 'Draft'].map(f => (
                <button key={f} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">{f}</button>
              ))}
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">
              <Plus size={18} /> New Invoice
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount (Rs.)</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm font-medium text-primary">{inv.id}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{inv.date}</td>
                  <td className="px-5 py-4 text-sm text-gray-800">{inv.customer}</td>
                  <td className="px-5 py-4 text-right text-sm font-semibold text-gray-800">Rs. {inv.total.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{inv.dueDate}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      inv.status === 'Paid' ? 'bg-green-100 text-success' :
                      inv.status === 'Pending' ? 'bg-amber-100 text-warning' :
                      'bg-gray-100 text-gray-500'
                    }`}>{inv.status}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setShowDetail(inv)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md"><Eye size={16} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md"><Download size={16} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md"><Printer size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Detail */}
        {showDetail && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Invoice {showDetail.id}</h3>
                  <p className="text-sm text-gray-500">{showDetail.date}</p>
                </div>
                <button onClick={() => setShowDetail(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">From</p>
                  <p className="text-sm font-medium">Ceylon Cinnamon Exports (Pvt) Ltd</p>
                  <p className="text-xs text-gray-500">123 Spice Road, Colombo 03</p>
                  <p className="text-xs text-gray-500">Sri Lanka</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Bill To</p>
                  <p className="text-sm font-medium">{showDetail.customer}</p>
                  <p className="text-xs text-gray-500">Due: {showDetail.dueDate}</p>
                </div>
              </div>

              <table className="w-full mb-4">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Grade</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Qty (kg)</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Price/kg</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {showDetail.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm text-gray-800">{item.grade}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">{item.qty.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">Rs. {item.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-800">Rs. {item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-surface rounded-lg p-4">
                <div className="flex justify-between text-base font-bold">
                  <span>Total Amount</span>
                  <span>Rs. {showDetail.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Invoice Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Create New Invoice</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="col-span-3 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <input value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} placeholder="Company name" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <h4 className="text-sm font-semibold text-gray-700 mb-3">Items</h4>
              <div className="space-y-3 mb-4">
                {form.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-10 gap-3 items-end bg-gray-50 rounded-lg p-3">
                    <div className="col-span-4">
                      <label className="block text-xs text-gray-500 mb-1">Grade</label>
                      <select value={item.grade} onChange={e => updateItem(idx, 'grade', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Qty (kg)</label>
                      <input type="number" value={item.qty} onChange={e => updateItem(idx, 'qty', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Price/kg</label>
                      <input type="number" value={item.price} onChange={e => updateItem(idx, 'price', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
                    </div>
                    <div className="col-span-1 text-right text-sm font-medium pt-5">Rs. {((Number(item.qty) || 0) * (Number(item.price) || 0)).toLocaleString()}</div>
                    <div className="col-span-1 flex justify-center pt-5">
                      <button onClick={() => removeItem(idx)} className="p-1 text-gray-400 hover:text-danger"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={addLineItem} className="text-sm text-primary hover:underline font-medium mb-4">+ Add item</button>

              <div className="bg-surface rounded-lg p-4 mb-6">
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>Rs. {formTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">Create Invoice</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ShoppingCart, Plus, Eye, X, Trash2, CreditCard, Banknote, Clock, CheckCircle2, CircleDollarSign } from 'lucide-react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { purchases as initialPurchases, suppliers, payments as initialPayments, bankAccounts } from '../data/mockData';

const grades = ['Alba (C-00000)', 'C-00000 Special', 'C-0000', 'C-000', 'C-00', 'C-0', 'Quillings', 'Cinnamon Bark Oil'];

export default function Purchasing() {
  const [purchases, setPurchases] = useState(initialPurchases);
  const [allPayments, setAllPayments] = useState(initialPayments);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [showPayModal, setShowPayModal] = useState(null);
  const [payForm, setPayForm] = useState({
    amount: '', method: 'Cash', date: '2024-10-22', notes: '',
    checkNo: '', checkBank: bankAccounts[0].bank, checkAccountNo: bankAccounts[0].accountNo,
  });

  const calcNet = (gross, wastage) => {
    const g = Number(gross) || 0;
    const w = Number(wastage) || 0;
    return g - (g * w / 100);
  };
  const calcTotal = (item) => calcNet(item.grossWeight, item.wastagePercent) * (Number(item.pricePerKg) || 0);

  const [form, setForm] = useState({
    supplier: suppliers[0].name,
    date: '2024-10-22',
    items: [{ grade: grades[0], grossWeight: '', wastagePercent: '', pricePerKg: '' }],
  });

  const addLineItem = () => {
    setForm({ ...form, items: [...form.items, { grade: grades[0], grossWeight: '', wastagePercent: '', pricePerKg: '' }] });
  };
  const updateItem = (idx, field, value) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [field]: value };
    setForm({ ...form, items });
  };
  const removeItem = (idx) => {
    if (form.items.length > 1) setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  };

  const handleSave = () => {
    const items = form.items.map(item => ({
      grade: item.grade,
      grossWeight: Number(item.grossWeight),
      wastagePercent: Number(item.wastagePercent),
      netWeight: calcNet(item.grossWeight, item.wastagePercent),
      pricePerKg: Number(item.pricePerKg),
      total: calcTotal(item),
    }));
    const totalGross = items.reduce((a, i) => a + i.grossWeight, 0);
    const totalNet = items.reduce((a, i) => a + i.netWeight, 0);
    const grandTotal = items.reduce((a, i) => a + i.total, 0);
    const newPO = {
      id: `PO-${String(purchases.length + 1).padStart(3, '0')}`,
      date: form.date, supplier: form.supplier, items, totalGross, totalNet, grandTotal,
      status: 'Pending Payment', paidAmount: 0,
    };
    setPurchases([newPO, ...purchases]);
    setShowModal(false);
    setForm({ supplier: suppliers[0].name, date: '2024-10-22', items: [{ grade: grades[0], grossWeight: '', wastagePercent: '', pricePerKg: '' }] });
  };

  const openPayModal = (po) => {
    const outstanding = po.grandTotal - po.paidAmount;
    setPayForm({
      amount: outstanding, method: 'Cash', date: '2024-10-22', notes: '',
      checkNo: `CHQ-${78454 + allPayments.length}`, checkBank: bankAccounts[0].bank, checkAccountNo: bankAccounts[0].accountNo,
    });
    setShowPayModal(po);
  };

  const handlePayment = () => {
    const po = showPayModal;
    const amount = Number(payForm.amount);
    const newPaidAmount = po.paidAmount + amount;
    const outstanding = po.grandTotal - newPaidAmount;

    const newPayment = {
      id: `PAY-${String(allPayments.length + 1).padStart(3, '0')}`,
      date: payForm.date,
      poId: po.id,
      supplier: po.supplier,
      amount,
      method: payForm.method,
      status: payForm.method === 'Check' ? 'Pending' : 'Completed',
      checkDetails: payForm.method === 'Check' ? {
        checkNo: payForm.checkNo,
        bank: payForm.checkBank,
        issueDate: payForm.date,
        clearanceDate: null,
        accountNo: payForm.checkAccountNo,
      } : null,
      notes: payForm.notes,
    };
    setAllPayments([newPayment, ...allPayments]);

    let newStatus = po.status;
    if (outstanding <= 0) newStatus = 'Completed';
    else if (newPaidAmount > 0) newStatus = 'Partially Paid';

    setPurchases(purchases.map(p =>
      p.id === po.id ? { ...p, paidAmount: newPaidAmount, status: newStatus } : p
    ));

    if (showDetail && showDetail.id === po.id) {
      setShowDetail({ ...showDetail, paidAmount: newPaidAmount, status: newStatus });
    }

    setShowPayModal(null);
  };

  const getPoPayments = (poId) => allPayments.filter(p => p.poId === poId);

  const totalOutstanding = purchases.reduce((a, p) => a + (p.grandTotal - p.paidAmount), 0);
  const totalPaid = purchases.reduce((a, p) => a + p.paidAmount, 0);
  const pendingChecks = allPayments.filter(p => p.method === 'Check' && p.status === 'Pending').length;
  const grandTotalForm = form.items.reduce((a, item) => a + calcTotal(item), 0);

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Cinnamon Purchasing" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={ShoppingCart} label="Total Purchases" value={`Rs. ${((totalPaid + totalOutstanding) / 1000000).toFixed(1)}M`} color="primary" />
          <StatCard icon={CheckCircle2} label="Total Paid" value={`Rs. ${(totalPaid / 1000000).toFixed(1)}M`} color="success" />
          <StatCard icon={Clock} label="Outstanding" value={`Rs. ${(totalOutstanding / 1000000).toFixed(1)}M`} subtitle={`${purchases.filter(p => p.grandTotal - p.paidAmount > 0).length} POs pending`} color="warning" />
          <StatCard icon={Banknote} label="Pending Checks" value={pendingChecks} subtitle="Awaiting clearance" color="info" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">Manage purchases from cinnamon suppliers with wastage tracking</p>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">
            <Plus size={18} /> New Purchase Order
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">PO Number</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Supplier</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Total (Rs.)</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Paid (Rs.)</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Outstanding</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(po => {
                const outstanding = po.grandTotal - po.paidAmount;
                return (
                  <tr key={po.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm font-medium text-primary">{po.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{po.date}</td>
                    <td className="px-5 py-4 text-sm text-gray-800">{po.supplier}</td>
                    <td className="px-5 py-4 text-right text-sm font-semibold text-gray-800">Rs. {po.grandTotal.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-success">Rs. {po.paidAmount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-danger">
                      {outstanding > 0 ? `Rs. ${outstanding.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        po.status === 'Completed' ? 'bg-green-100 text-success' :
                        po.status === 'Pending Payment' ? 'bg-amber-100 text-warning' :
                        'bg-blue-100 text-info'
                      }`}>{po.status}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setShowDetail(po)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md" title="View details">
                          <Eye size={16} />
                        </button>
                        {outstanding > 0 && (
                          <button onClick={() => openPayModal(po)} className="p-1.5 text-gray-400 hover:text-success hover:bg-green-50 rounded-md" title="Make payment">
                            <CircleDollarSign size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PO Detail Modal with Payment History */}
        {showDetail && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Purchase Order {showDetail.id}</h3>
                  <p className="text-sm text-gray-500">{showDetail.supplier} — {showDetail.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  {showDetail.grandTotal - showDetail.paidAmount > 0 && (
                    <button
                      onClick={() => { setShowDetail(null); openPayModal(showDetail); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-success text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      <CircleDollarSign size={16} /> Make Payment
                    </button>
                  )}
                  <button onClick={() => setShowDetail(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
              </div>

              <table className="w-full mb-4">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Grade</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Gross (kg)</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Wastage %</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Net (kg)</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Price/kg</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {showDetail.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm text-gray-800">{item.grade}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">{item.grossWeight.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm text-danger font-medium">{item.wastagePercent}%</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-800">{item.netWeight.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">Rs. {item.pricePerKg.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-800">Rs. {item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-surface rounded-lg p-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Gross Weight</span>
                  <span className="font-medium">{showDetail.totalGross.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Net Weight (after wastage)</span>
                  <span className="font-medium">{showDetail.totalNet.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Wastage</span>
                  <span className="font-medium text-danger">{(showDetail.totalGross - showDetail.totalNet).toLocaleString()} kg</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-base font-bold">
                  <span>Grand Total</span>
                  <span>Rs. {showDetail.grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Paid</span>
                  <span className="font-medium text-success">Rs. {showDetail.paidAmount.toLocaleString()}</span>
                </div>
                {showDetail.grandTotal - showDetail.paidAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Outstanding Balance</span>
                    <span className="font-bold text-danger">Rs. {(showDetail.grandTotal - showDetail.paidAmount).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Payment History */}
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CreditCard size={16} className="text-primary" /> Payment History
              </h4>
              {getPoPayments(showDetail.id).length > 0 ? (
                <div className="space-y-2">
                  {getPoPayments(showDetail.id).map(pay => (
                    <div key={pay.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          pay.method === 'Cash' ? 'bg-green-100' : pay.method === 'Check' ? 'bg-blue-100' : 'bg-purple-100'
                        }`}>
                          {pay.method === 'Cash' ? <Banknote size={18} className="text-success" /> :
                           pay.method === 'Check' ? <CreditCard size={18} className="text-info" /> :
                           <CreditCard size={18} className="text-purple-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {pay.id} — {pay.method}
                            {pay.checkDetails && <span className="text-gray-500"> ({pay.checkDetails.checkNo})</span>}
                          </p>
                          <p className="text-xs text-gray-500">
                            {pay.date}
                            {pay.notes && <span> · {pay.notes}</span>}
                          </p>
                          {pay.checkDetails && (
                            <p className="text-xs text-gray-400">
                              {pay.checkDetails.bank} · {pay.checkDetails.accountNo}
                              {pay.checkDetails.clearanceDate
                                ? ` · Cleared: ${pay.checkDetails.clearanceDate}`
                                : ' · Awaiting clearance'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">Rs. {pay.amount.toLocaleString()}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          pay.status === 'Completed' || pay.status === 'Cleared' ? 'bg-green-100 text-success' :
                          pay.status === 'Pending' ? 'bg-amber-100 text-warning' :
                          'bg-red-100 text-danger'
                        }`}>{pay.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-lg">No payments recorded yet</p>
              )}
            </div>
          </div>
        )}

        {/* Make Payment Modal */}
        {showPayModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Make Payment</h3>
                  <p className="text-sm text-gray-500">{showPayModal.id} — {showPayModal.supplier}</p>
                </div>
                <button onClick={() => setShowPayModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <div className="bg-surface rounded-lg p-3 mb-5 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">PO Total</span>
                  <span className="font-medium">Rs. {showPayModal.grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Already Paid</span>
                  <span className="font-medium text-success">Rs. {showPayModal.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-800">Outstanding</span>
                  <span className="text-danger">Rs. {(showPayModal.grandTotal - showPayModal.paidAmount).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Cash', 'Check', 'Bank Transfer'].map(m => (
                      <button
                        key={m}
                        onClick={() => setPayForm({ ...payForm, method: m })}
                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                          payForm.method === m
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {m === 'Cash' && <Banknote size={16} />}
                        {m === 'Check' && <CreditCard size={16} />}
                        {m === 'Bank Transfer' && <CreditCard size={16} />}
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs.)</label>
                    <input
                      type="number"
                      value={payForm.amount}
                      onChange={e => setPayForm({ ...payForm, amount: e.target.value })}
                      max={showPayModal.grandTotal - showPayModal.paidAmount}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" value={payForm.date} onChange={e => setPayForm({ ...payForm, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                </div>

                {payForm.method === 'Check' && (
                  <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-100">
                    <h5 className="text-sm font-semibold text-info flex items-center gap-1.5">
                      <CreditCard size={15} /> Check Details
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Check Number</label>
                        <input value={payForm.checkNo} onChange={e => setPayForm({ ...payForm, checkNo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Bank</label>
                        <select value={payForm.checkBank} onChange={e => {
                          const acc = bankAccounts.find(a => a.bank === e.target.value);
                          setPayForm({ ...payForm, checkBank: e.target.value, checkAccountNo: acc ? acc.accountNo : '' });
                        }} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                          {[...new Set(bankAccounts.filter(a => a.bank !== 'Cash').map(a => a.bank))].map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Account</label>
                      <select value={payForm.checkAccountNo} onChange={e => setPayForm({ ...payForm, checkAccountNo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                        {bankAccounts.filter(a => a.bank === payForm.checkBank).map(a => (
                          <option key={a.id} value={a.accountNo}>{a.name} ({a.accountNo})</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-gray-500">Check will appear in Accounting → Checks with "Pending" status until cleared.</p>
                  </div>
                )}

                {payForm.method === 'Bank Transfer' && (
                  <div className="bg-purple-50 rounded-lg p-4 space-y-3 border border-purple-100">
                    <h5 className="text-sm font-semibold text-purple-700">Transfer From</h5>
                    <select value={payForm.checkAccountNo} onChange={e => setPayForm({ ...payForm, checkAccountNo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                      {bankAccounts.filter(a => a.bank !== 'Cash').map(a => (
                        <option key={a.id} value={a.accountNo}>{a.name} — {a.bank} ({a.accountNo}) — Rs. {a.balance.toLocaleString()}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input value={payForm.notes} onChange={e => setPayForm({ ...payForm, notes: e.target.value })} placeholder="e.g., First installment, balance payment..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowPayModal(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={handlePayment} className="flex-1 px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2">
                  <CircleDollarSign size={16} /> Record Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New PO Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-800">New Purchase Order</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <select value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    {suppliers.map(s => <option key={s.id} value={s.name}>{s.name} ({s.location})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <h4 className="text-sm font-semibold text-gray-700 mb-3">Line Items</h4>
              <div className="space-y-3 mb-4">
                {form.items.map((item, idx) => {
                  const net = calcNet(item.grossWeight, item.wastagePercent);
                  const total = calcTotal(item);
                  return (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-3">
                          <label className="block text-xs text-gray-500 mb-1">Grade</label>
                          <select value={item.grade} onChange={e => updateItem(idx, 'grade', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">Gross Weight (kg)</label>
                          <input type="number" value={item.grossWeight} onChange={e => updateItem(idx, 'grossWeight', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" placeholder="1000" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">Wastage %</label>
                          <input type="number" value={item.wastagePercent} onChange={e => updateItem(idx, 'wastagePercent', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" placeholder="5" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">Net Weight</label>
                          <div className="px-2 py-1.5 bg-white border border-gray-200 rounded text-sm font-medium text-gray-800">{net.toLocaleString()} kg</div>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">Price/kg (Rs.)</label>
                          <input type="number" value={item.pricePerKg} onChange={e => updateItem(idx, 'pricePerKg', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" placeholder="5000" />
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          <button onClick={() => removeItem(idx)} className="p-1 text-gray-400 hover:text-danger"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      {total > 0 && (
                        <div className="mt-2 text-right text-sm text-gray-600">
                          Line total: <span className="font-semibold text-gray-800">Rs. {total.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button onClick={addLineItem} className="text-sm text-primary hover:underline font-medium mb-4">+ Add another line item</button>

              <div className="bg-surface rounded-lg p-4 mb-6">
                <div className="flex justify-between text-base font-bold">
                  <span>Grand Total</span>
                  <span>Rs. {grandTotalForm.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">Create Purchase Order</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

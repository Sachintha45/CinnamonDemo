import { useState } from 'react';
import { Send, Plus, Eye, X, Copy, CheckCircle2, Clock, Shield, Landmark, CreditCard, ArrowRight, Search, AlertTriangle, Banknote } from 'lucide-react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { paymentAccounts, gatewayTransactions as initialTxns, bankAccounts } from '../data/mockData';

export default function PaymentGateway() {
  const [txns, setTxns] = useState(initialTxns);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(null);
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState(paymentAccounts);
  const [copied, setCopied] = useState(null);
  const [payStep, setPayStep] = useState(1);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [beneficiarySearch, setBeneficiarySearch] = useState('');
  const [payForm, setPayForm] = useState({
    fromAccount: bankAccounts[0].name,
    amount: '',
    description: '',
    date: '2024-10-22',
  });
  const [newBeneficiary, setNewBeneficiary] = useState({
    type: 'Supplier', name: '', beneficiary: '', bank: '', branch: '', accountNo: '', swiftCode: '', currency: 'LKR',
  });

  const totalSent = txns.filter(t => t.status === 'Completed').reduce((a, t) => a + t.amount, 0);
  const processing = txns.filter(t => t.status === 'Processing');

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const startPayment = (ben) => {
    setSelectedBeneficiary(ben);
    setPayForm({ fromAccount: bankAccounts[0].name, amount: '', description: `Payment to ${ben.name}`, date: '2024-10-22' });
    setPayStep(1);
    setShowPayModal(true);
  };

  const handleConfirmPayment = () => {
    const newTxn = {
      id: `TXN-${String(txns.length + 1).padStart(3, '0')}`,
      date: payForm.date,
      payee: selectedBeneficiary.name,
      amount: Number(payForm.amount),
      method: 'Bank Transfer',
      accountNo: selectedBeneficiary.accountNo.slice(-10),
      bank: selectedBeneficiary.bank,
      status: 'Processing',
      ref: `BT-${payForm.date.replace(/-/g, '')}-${String(txns.length + 1).padStart(3, '0')}`,
    };
    setTxns([newTxn, ...txns]);
    setPayStep(3);
  };

  const handleAddBeneficiary = () => {
    setBeneficiaries([...beneficiaries, { id: Date.now(), ...newBeneficiary }]);
    setShowAddBeneficiary(false);
    setNewBeneficiary({ type: 'Supplier', name: '', beneficiary: '', bank: '', branch: '', accountNo: '', swiftCode: '', currency: 'LKR' });
  };

  const filteredBeneficiaries = beneficiaries.filter(b =>
    b.name.toLowerCase().includes(beneficiarySearch.toLowerCase()) ||
    b.bank.toLowerCase().includes(beneficiarySearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Payment Gateway" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Send} label="Total Sent (Oct)" value={`Rs. ${(totalSent / 1000000).toFixed(1)}M`} color="primary" />
          <StatCard icon={Clock} label="Processing" value={processing.length} subtitle={`Rs. ${processing.reduce((a, t) => a + t.amount, 0).toLocaleString()}`} color="warning" />
          <StatCard icon={CreditCard} label="Beneficiaries" value={beneficiaries.length} subtitle="Saved accounts" color="info" />
          <StatCard icon={Shield} label="Security" value="256-bit" subtitle="End-to-end encrypted" color="success" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Beneficiaries List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">Beneficiaries</h3>
                  <button onClick={() => setShowAddBeneficiary(true)} className="p-1.5 text-primary hover:bg-primary/5 rounded-md" title="Add beneficiary">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={beneficiarySearch} onChange={e => setBeneficiarySearch(e.target.value)} placeholder="Search..." className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div className="divide-y divide-gray-100 max-h-[500px] overflow-auto">
                {filteredBeneficiaries.map(ben => (
                  <div key={ben.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          ben.type === 'Supplier' ? 'bg-primary/10 text-primary' :
                          ben.type === 'Shipping' ? 'bg-blue-100 text-info' :
                          'bg-amber-100 text-warning'
                        }`}>
                          {ben.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{ben.name}</p>
                          <p className="text-xs text-gray-400">{ben.type}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-0.5 mb-3">
                      <p>{ben.bank} · {ben.branch}</p>
                      <div className="flex items-center gap-1">
                        <span className="font-mono">{ben.accountNo}</span>
                        <button onClick={() => handleCopy(ben.accountNo, ben.id)} className="text-gray-400 hover:text-primary">
                          {copied === ben.id ? <CheckCircle2 size={12} className="text-success" /> : <Copy size={12} />}
                        </button>
                      </div>
                      {ben.swiftCode && <p>SWIFT: {ben.swiftCode}</p>}
                    </div>
                    <button
                      onClick={() => startPayment(ben)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light"
                    >
                      <Send size={13} /> Pay Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">Recent Transactions</h3>
                <div className="flex gap-2">
                  {['All', 'Completed', 'Processing'].map(f => (
                    <button key={f} className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">{f}</button>
                  ))}
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Transaction</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Payee</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Bank</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {txns.map(tx => (
                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-primary">{tx.id}</p>
                        <p className="text-xs text-gray-400">{tx.date}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-800">{tx.payee}</p>
                        <p className="text-xs text-gray-400 font-mono">{tx.accountNo}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{tx.bank}</td>
                      <td className="px-5 py-4 text-right text-sm font-semibold text-gray-800">Rs. {tx.amount.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                          tx.status === 'Completed' ? 'bg-green-100 text-success' : 'bg-amber-100 text-warning'
                        }`}>
                          {tx.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => setShowReceipt(tx)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md" title="View receipt">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Make Payment Modal (Multi-Step) */}
        {showPayModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
              {/* Step Indicators */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      payStep >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                    }`}>{s}</div>
                    {s < 3 && <div className={`w-12 h-0.5 ${payStep > s ? 'bg-primary' : 'bg-gray-200'}`}></div>}
                  </div>
                ))}
              </div>

              {payStep === 1 && (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-800">Payment Details</h3>
                    <button onClick={() => setShowPayModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                  </div>

                  <div className="bg-surface rounded-lg p-4 mb-5">
                    <p className="text-xs text-gray-500 mb-1">Paying to</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedBeneficiary.beneficiary}</p>
                    <p className="text-xs text-gray-500">{selectedBeneficiary.bank} · {selectedBeneficiary.branch}</p>
                    <p className="text-xs font-mono text-gray-600 mt-1">A/C: {selectedBeneficiary.accountNo}</p>
                    {selectedBeneficiary.swiftCode && <p className="text-xs text-gray-500">SWIFT: {selectedBeneficiary.swiftCode}</p>}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
                      <select value={payForm.fromAccount} onChange={e => setPayForm({ ...payForm, fromAccount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        {bankAccounts.filter(a => a.bank !== 'Cash').map(a => (
                          <option key={a.id} value={a.name}>{a.name} — {a.bank} — {a.currency === 'USD' ? '$' : 'Rs. '}{a.balance.toLocaleString()}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs.)</label>
                        <input type="number" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })} placeholder="0.00" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" value={payForm.date} onChange={e => setPayForm({ ...payForm, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description / Reference</label>
                      <input value={payForm.description} onChange={e => setPayForm({ ...payForm, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowPayModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button onClick={() => setPayStep(2)} disabled={!payForm.amount} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light disabled:opacity-50 flex items-center justify-center gap-1.5">
                      Continue <ArrowRight size={15} />
                    </button>
                  </div>
                </>
              )}

              {payStep === 2 && (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-800">Confirm Payment</h3>
                    <button onClick={() => setShowPayModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 flex items-start gap-2">
                    <AlertTriangle size={16} className="text-warning mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700">Please verify all details carefully. This transaction cannot be reversed once confirmed.</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                      <span className="text-gray-500">From</span>
                      <span className="font-medium text-gray-800">{payForm.fromAccount}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                      <span className="text-gray-500">To</span>
                      <span className="font-medium text-gray-800">{selectedBeneficiary.beneficiary}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                      <span className="text-gray-500">Bank</span>
                      <span className="text-gray-700">{selectedBeneficiary.bank} — {selectedBeneficiary.branch}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                      <span className="text-gray-500">Account No</span>
                      <span className="font-mono text-gray-700">{selectedBeneficiary.accountNo}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                      <span className="text-gray-500">Description</span>
                      <span className="text-gray-700">{payForm.description}</span>
                    </div>
                    <div className="flex justify-between py-3 text-base">
                      <span className="font-semibold text-gray-800">Amount</span>
                      <span className="font-bold text-primary text-xl">Rs. {Number(payForm.amount).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setPayStep(1)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Back</button>
                    <button onClick={handleConfirmPayment} className="flex-1 px-4 py-2.5 bg-success text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-1.5">
                      <Shield size={15} /> Confirm & Send
                    </button>
                  </div>
                </>
              )}

              {payStep === 3 && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-success" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Payment Initiated!</h3>
                  <p className="text-sm text-gray-500 mb-5">Your payment is being processed</p>

                  <div className="bg-gray-50 rounded-lg p-4 text-left mb-5 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Reference</span>
                      <span className="font-mono text-primary">{txns[0].ref}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Amount</span>
                      <span className="font-bold text-gray-800">Rs. {Number(payForm.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">To</span>
                      <span className="text-gray-700">{selectedBeneficiary.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <span className="inline-flex items-center gap-1 text-warning font-medium"><Clock size={13} /> Processing</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setShowPayModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Close</button>
                    <button onClick={() => { setShowPayModal(false); setShowReceipt(txns[0]); }} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light flex items-center justify-center gap-1.5">
                      <Eye size={15} /> View Receipt
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Receipt Modal */}
        {showReceipt && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Payment Receipt</h3>
                <button onClick={() => setShowReceipt(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6">
                <div className="text-center mb-5">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold text-lg">C</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800">Ceylon Cinnamon Exports (Pvt) Ltd</p>
                  <p className="text-xs text-gray-500">Payment Receipt</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="font-mono font-medium text-gray-800">{showReceipt.id}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Reference</span>
                    <span className="font-mono text-gray-700">{showReceipt.ref}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Date</span>
                    <span className="text-gray-700">{showReceipt.date}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Payee</span>
                    <span className="font-medium text-gray-800">{showReceipt.payee}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Bank</span>
                    <span className="text-gray-700">{showReceipt.bank}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Account</span>
                    <span className="font-mono text-gray-700">{showReceipt.accountNo}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Method</span>
                    <span className="text-gray-700">{showReceipt.method}</span>
                  </div>
                </div>

                <div className="bg-surface rounded-lg p-3 text-center mb-4">
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-2xl font-bold text-gray-900">Rs. {showReceipt.amount.toLocaleString()}</p>
                </div>

                <div className="text-center">
                  <span className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium ${
                    showReceipt.status === 'Completed' ? 'bg-green-100 text-success' : 'bg-amber-100 text-warning'
                  }`}>
                    {showReceipt.status === 'Completed' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    {showReceipt.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowReceipt(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Close</button>
                <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light flex items-center justify-center gap-1.5">
                  <Banknote size={15} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Beneficiary Modal */}
        {showAddBeneficiary && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Add Beneficiary</h3>
                <button onClick={() => setShowAddBeneficiary(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={newBeneficiary.type} onChange={e => setNewBeneficiary({ ...newBeneficiary, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="Supplier">Supplier</option>
                    <option value="Shipping">Shipping Agent</option>
                    <option value="Regulatory">Government / Regulatory</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input value={newBeneficiary.name} onChange={e => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })} placeholder="e.g., Ratnapura Cinnamon Estate" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiary Name (on account)</label>
                  <input value={newBeneficiary.beneficiary} onChange={e => setNewBeneficiary({ ...newBeneficiary, beneficiary: e.target.value })} placeholder="Legal name as on bank account" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
                    <input value={newBeneficiary.bank} onChange={e => setNewBeneficiary({ ...newBeneficiary, bank: e.target.value })} placeholder="Bank of Ceylon" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <input value={newBeneficiary.branch} onChange={e => setNewBeneficiary({ ...newBeneficiary, branch: e.target.value })} placeholder="Colombo Fort" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input value={newBeneficiary.accountNo} onChange={e => setNewBeneficiary({ ...newBeneficiary, accountNo: e.target.value })} placeholder="0072-1234-5678-90" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SWIFT Code</label>
                    <input value={newBeneficiary.swiftCode} onChange={e => setNewBeneficiary({ ...newBeneficiary, swiftCode: e.target.value })} placeholder="BABORLKLXXX" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select value={newBeneficiary.currency} onChange={e => setNewBeneficiary({ ...newBeneficiary, currency: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="LKR">LKR (Sri Lankan Rupee)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="GBP">GBP (British Pound)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddBeneficiary(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={handleAddBeneficiary} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">Save Beneficiary</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Landmark, Plus, ArrowUpRight, ArrowDownRight, X, TrendingUp, TrendingDown, Wallet, CreditCard, CheckCircle2, Clock, AlertTriangle, Eye, Banknote } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { bankAccounts, transactions as initialTx, checks as initialChecks, payments as initialPayments } from '../data/mockData';

const EXPENSE_COLORS = ['#8B4513', '#A0522D', '#D2691E', '#DEB887', '#CD853F', '#F4A460'];

export default function Accounting() {
  const [transactions, setTransactions] = useState(initialTx);
  const [checksData, setChecksData] = useState(initialChecks);
  const [paymentsData] = useState(initialPayments);
  const [showModal, setShowModal] = useState(false);
  const [showCheckDetail, setShowCheckDetail] = useState(null);
  const [activeTab, setActiveTab] = useState('transactions');
  const [checkFilter, setCheckFilter] = useState('All');
  const [form, setForm] = useState({ date: '2024-10-22', description: '', type: 'Expense', amount: '', account: bankAccounts[0].name, category: 'Purchases' });

  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((a, t) => a + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((a, t) => a + t.amount, 0);
  const totalBalance = bankAccounts.filter(a => a.currency === 'LKR').reduce((a, b) => a + b.balance, 0);
  const pendingCheckAmount = checksData.filter(c => c.status === 'Pending').reduce((a, c) => a + c.amount, 0);

  const expenseByCategory = Object.entries(
    transactions.filter(t => t.type === 'Expense').reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const categories = ['Purchases', 'Shipping', 'Salaries', 'Rent', 'Utilities', 'Regulatory', 'Marketing', 'Other'];

  const handleSave = () => {
    const newTx = { id: Date.now(), ...form, amount: Number(form.amount) };
    setTransactions([newTx, ...transactions]);
    setShowModal(false);
    setForm({ date: '2024-10-22', description: '', type: 'Expense', amount: '', account: bankAccounts[0].name, category: 'Purchases' });
  };

  const handleClearCheck = (checkId) => {
    setChecksData(checksData.map(c =>
      c.id === checkId ? { ...c, status: 'Cleared', clearanceDate: '2024-10-22' } : c
    ));
    if (showCheckDetail && showCheckDetail.id === checkId) {
      setShowCheckDetail({ ...showCheckDetail, status: 'Cleared', clearanceDate: '2024-10-22' });
    }
  };

  const handleBounceCheck = (checkId) => {
    setChecksData(checksData.map(c =>
      c.id === checkId ? { ...c, status: 'Bounced' } : c
    ));
    if (showCheckDetail && showCheckDetail.id === checkId) {
      setShowCheckDetail({ ...showCheckDetail, status: 'Bounced' });
    }
  };

  const filteredChecks = checkFilter === 'All' ? checksData : checksData.filter(c => c.status === checkFilter);

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Accounting" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Wallet} label="Total Balance (LKR)" value={`Rs. ${(totalBalance / 1000000).toFixed(1)}M`} color="primary" />
          <StatCard icon={TrendingUp} label="Income (Oct)" value={`Rs. ${(totalIncome / 1000000).toFixed(1)}M`} color="success" />
          <StatCard icon={TrendingDown} label="Expenses (Oct)" value={`Rs. ${(totalExpenses / 1000000).toFixed(1)}M`} color="danger" />
          <StatCard icon={CreditCard} label="Pending Checks" value={`Rs. ${(pendingCheckAmount / 1000000).toFixed(1)}M`} subtitle={`${checksData.filter(c => c.status === 'Pending').length} checks awaiting`} color="info" />
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { key: 'transactions', label: 'Transactions' },
            { key: 'accounts', label: 'Bank Accounts' },
            { key: 'checks', label: 'Check Register' },
            { key: 'payments', label: 'Payment History' },
            { key: 'analytics', label: 'Analytics' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.key ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >{tab.label}</button>
          ))}
        </div>

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">Recent transactions</p>
              <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">
                <Plus size={18} /> Add Transaction
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Account</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm text-gray-600">{tx.date}</td>
                    <td className="px-5 py-4 text-sm text-gray-800">{tx.description}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{tx.category}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{tx.account}</td>
                    <td className="px-5 py-4 text-right">
                      <span className={`flex items-center justify-end gap-1 text-sm font-semibold ${tx.type === 'Income' ? 'text-success' : 'text-danger'}`}>
                        {tx.type === 'Income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        Rs. {tx.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bank Accounts Tab */}
        {activeTab === 'accounts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map(acc => (
              <div key={acc.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Landmark size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{acc.name}</p>
                    <p className="text-xs text-gray-500">{acc.bank} · {acc.accountNo}</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {acc.currency === 'USD' ? '$' : 'Rs. '}{acc.balance.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">{acc.currency}</p>
              </div>
            ))}
          </div>
        )}

        {/* Check Register Tab */}
        {activeTab === 'checks' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">Total Checks Issued</p>
                <p className="text-xl font-bold text-gray-900">{checksData.length}</p>
                <p className="text-xs text-gray-400">Rs. {checksData.reduce((a, c) => a + c.amount, 0).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <p className="text-xs text-gray-500">Pending Clearance</p>
                </div>
                <p className="text-xl font-bold text-warning">{checksData.filter(c => c.status === 'Pending').length}</p>
                <p className="text-xs text-gray-400">Rs. {checksData.filter(c => c.status === 'Pending').reduce((a, c) => a + c.amount, 0).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <p className="text-xs text-gray-500">Cleared</p>
                </div>
                <p className="text-xl font-bold text-success">{checksData.filter(c => c.status === 'Cleared').length}</p>
                <p className="text-xs text-gray-400">Rs. {checksData.filter(c => c.status === 'Cleared').reduce((a, c) => a + c.amount, 0).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-danger"></div>
                  <p className="text-xs text-gray-500">Bounced</p>
                </div>
                <p className="text-xl font-bold text-danger">{checksData.filter(c => c.status === 'Bounced').length}</p>
                <p className="text-xs text-gray-400">Rs. {checksData.filter(c => c.status === 'Bounced').reduce((a, c) => a + c.amount, 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex gap-2">
                  {['All', 'Pending', 'Cleared', 'Bounced'].map(f => (
                    <button
                      key={f}
                      onClick={() => setCheckFilter(f)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        checkFilter === f ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >{f} {f !== 'All' && `(${checksData.filter(c => f === 'All' || c.status === f).length})`}</button>
                  ))}
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Check No.</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Payee (Supplier)</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Bank / Account</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Issue Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Clearance</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChecks.map(chk => (
                    <tr key={chk.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-info">{chk.id}</span>
                        {chk.poId && <p className="text-xs text-gray-400">PO: {chk.poId}</p>}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-800">{chk.supplier}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">{chk.bank}</p>
                        <p className="text-xs text-gray-400">{chk.accountNo}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{chk.issueDate}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {chk.clearanceDate || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-semibold text-gray-800">Rs. {chk.amount.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                          chk.status === 'Cleared' ? 'bg-green-100 text-success' :
                          chk.status === 'Pending' ? 'bg-amber-100 text-warning' :
                          'bg-red-100 text-danger'
                        }`}>
                          {chk.status === 'Cleared' && <CheckCircle2 size={12} />}
                          {chk.status === 'Pending' && <Clock size={12} />}
                          {chk.status === 'Bounced' && <AlertTriangle size={12} />}
                          {chk.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setShowCheckDetail(chk)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md" title="View">
                            <Eye size={16} />
                          </button>
                          {chk.status === 'Pending' && (
                            <>
                              <button onClick={() => handleClearCheck(chk.id)} className="p-1.5 text-gray-400 hover:text-success hover:bg-green-50 rounded-md" title="Mark as Cleared">
                                <CheckCircle2 size={16} />
                              </button>
                              <button onClick={() => handleBounceCheck(chk.id)} className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded-md" title="Mark as Bounced">
                                <AlertTriangle size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredChecks.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">No checks found for this filter</p>
              )}
            </div>
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <p className="text-sm text-gray-500">All payments made against purchase orders</p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Payment ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">PO / Supplier</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Method</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Reference</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentsData.map(pay => (
                  <tr key={pay.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm font-medium text-primary">{pay.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{pay.date}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-800">{pay.supplier}</p>
                      <p className="text-xs text-gray-400">{pay.poId}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                        pay.method === 'Cash' ? 'bg-green-100 text-success' :
                        pay.method === 'Check' ? 'bg-blue-100 text-info' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {pay.method === 'Cash' && <Banknote size={12} />}
                        {pay.method === 'Check' && <CreditCard size={12} />}
                        {pay.method === 'Bank Transfer' && <Landmark size={12} />}
                        {pay.method}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {pay.checkDetails ? (
                        <span className="text-info">{pay.checkDetails.checkNo}</span>
                      ) : (
                        <span className="text-gray-400">{pay.notes || '—'}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-semibold text-gray-800">Rs. {pay.amount.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        pay.status === 'Completed' || pay.status === 'Cleared' ? 'bg-green-100 text-success' :
                        pay.status === 'Pending' ? 'bg-amber-100 text-warning' :
                        'bg-red-100 text-danger'
                      }`}>{pay.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Expense Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {expenseByCategory.map((_, idx) => (
                      <Cell key={idx} fill={EXPENSE_COLORS[idx % EXPENSE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Profit & Loss Summary</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Income</p>
                  <p className="text-2xl font-bold text-success">Rs. {totalIncome.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-danger">Rs. {totalExpenses.toLocaleString()}</p>
                </div>
                <div className={`p-4 rounded-lg ${totalIncome - totalExpenses >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="text-sm text-gray-600">Net Profit / Loss</p>
                  <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-success' : 'text-danger'}`}>
                    Rs. {(totalIncome - totalExpenses).toLocaleString()}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Expense Categories</h4>
                  {expenseByCategory.sort((a, b) => b.value - a.value).map((cat, idx) => (
                    <div key={cat.name} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EXPENSE_COLORS[idx % EXPENSE_COLORS.length] }}></div>
                        <span className="text-sm text-gray-600">{cat.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">Rs. {cat.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Check Detail Modal */}
        {showCheckDetail && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Check Details</h3>
                <button onClick={() => setShowCheckDetail(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-5 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">{showCheckDetail.bank}</p>
                    <p className="text-xs text-blue-500">A/C: {showCheckDetail.accountNo}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    showCheckDetail.status === 'Cleared' ? 'bg-green-100 text-success' :
                    showCheckDetail.status === 'Pending' ? 'bg-amber-100 text-warning' :
                    'bg-red-100 text-danger'
                  }`}>{showCheckDetail.status}</span>
                </div>

                <p className="text-sm text-blue-700 font-medium mb-1">Pay to: {showCheckDetail.supplier}</p>
                <p className="text-3xl font-bold text-gray-900 mb-3">Rs. {showCheckDetail.amount.toLocaleString()}</p>

                <div className="flex justify-between text-xs text-blue-600">
                  <span>Check No: {showCheckDetail.id}</span>
                  <span>Date: {showCheckDetail.issueDate}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">Check Number</span>
                  <span className="font-medium text-gray-800">{showCheckDetail.id}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">Payee</span>
                  <span className="font-medium text-gray-800">{showCheckDetail.supplier}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold text-gray-800">Rs. {showCheckDetail.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">Bank</span>
                  <span className="font-medium text-gray-800">{showCheckDetail.bank}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">Account</span>
                  <span className="font-medium text-gray-800">{showCheckDetail.accountNo}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">Issue Date</span>
                  <span className="font-medium text-gray-800">{showCheckDetail.issueDate}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">Clearance Date</span>
                  <span className={`font-medium ${showCheckDetail.clearanceDate ? 'text-success' : 'text-warning'}`}>
                    {showCheckDetail.clearanceDate || 'Awaiting clearance'}
                  </span>
                </div>
                {showCheckDetail.poId && (
                  <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">Purchase Order</span>
                    <span className="font-medium text-primary">{showCheckDetail.poId}</span>
                  </div>
                )}
              </div>

              {showCheckDetail.status === 'Pending' && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleBounceCheck(showCheckDetail.id)}
                    className="flex-1 px-4 py-2 border border-danger text-danger rounded-lg text-sm font-medium hover:bg-red-50 flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle size={15} /> Mark Bounced
                  </button>
                  <button
                    onClick={() => handleClearCheck(showCheckDetail.id)}
                    className="flex-1 px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={15} /> Mark Cleared
                  </button>
                </div>
              )}

              {showCheckDetail.status === 'Bounced' && (
                <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-danger font-medium flex items-center gap-1.5"><AlertTriangle size={14} /> This check has bounced</p>
                  <p className="text-xs text-gray-500 mt-1">Contact the bank or supplier to resolve. The payment against the PO may need to be re-issued.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Transaction Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Add Transaction</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="Income">Income</option>
                      <option value="Expense">Expense</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs.)</label>
                    <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
                  <select value={form.account} onChange={e => setForm({ ...form, account: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    {bankAccounts.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">Add Transaction</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

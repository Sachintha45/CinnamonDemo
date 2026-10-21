import { useState } from 'react';
import {
  Users, Plus, Eye, X, Edit2, Trash2, DollarSign, Calendar, Award, Clock,
  CheckCircle2, XCircle, User, Briefcase, Building2, CreditCard, Search,
  ChevronDown, Gift, TrendingUp, FileText, Banknote
} from 'lucide-react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import {
  employees as initialEmployees, payrollHistory, leaveRequests as initialLeaves,
  bonuses as initialBonuses
} from '../data/mockData';

const departments = ['Management', 'Operations', 'Finance', 'Warehouse', 'Sales', 'Logistics'];

export default function HRPayroll() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [leaves, setLeaves] = useState(initialLeaves);
  const [bonusData, setBonusData] = useState(initialBonuses);
  const [activeTab, setActiveTab] = useState('employees');
  const [showEmpModal, setShowEmpModal] = useState(false);
  const [showEmpDetail, setShowEmpDetail] = useState(null);
  const [empDetailTab, setEmpDetailTab] = useState('info');
  const [showPayslip, setShowPayslip] = useState(null);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const [bonusForm, setBonusForm] = useState({
    employeeId: '', type: 'Performance', amount: '', month: 'October 2024', reason: '',
  });

  const [empForm, setEmpForm] = useState({
    name: '', nic: '', phone: '', email: '', department: 'Warehouse', designation: '',
    type: 'Permanent', baseSalary: '', transport: '', meal: '8000', phoneAllowance: '',
    bankName: '', bankBranch: '', bankAccount: '', emergencyContact: '',
  });

  const totalPayroll = employees.reduce((a, e) => {
    const allowances = Object.values(e.allowances).reduce((s, v) => s + v, 0);
    return a + e.baseSalary + allowances;
  }, 0);
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const pendingBonuses = bonusData.filter(b => b.status === 'Pending').reduce((a, b) => a + b.amount, 0);

  const filteredEmployees = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  const getEmployeeGross = (emp) => {
    return emp.baseSalary + Object.values(emp.allowances).reduce((s, v) => s + v, 0);
  };

  const getEmployeeDeductions = (emp) => {
    const epfEmployee = emp.baseSalary * 0.08;
    return epfEmployee;
  };

  const getEmployeeNet = (emp) => {
    return getEmployeeGross(emp) - getEmployeeDeductions(emp);
  };

  const handleApproveLeave = (id) => setLeaves(leaves.map(l => l.id === id ? { ...l, status: 'Approved' } : l));
  const handleRejectLeave = (id) => setLeaves(leaves.map(l => l.id === id ? { ...l, status: 'Rejected' } : l));

  const handleAddBonus = () => {
    const emp = employees.find(e => e.id === bonusForm.employeeId);
    if (!emp) return;
    const newBonus = {
      id: `BN-${String(bonusData.length + 1).padStart(3, '0')}`,
      employeeId: bonusForm.employeeId,
      employeeName: emp.name,
      type: bonusForm.type,
      amount: Number(bonusForm.amount),
      month: bonusForm.month,
      reason: bonusForm.reason,
      status: 'Pending',
    };
    setBonusData([newBonus, ...bonusData]);
    setShowBonusModal(false);
    setBonusForm({ employeeId: '', type: 'Performance', amount: '', month: 'October 2024', reason: '' });
  };

  const handleAddEmployee = () => {
    const newEmp = {
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      name: empForm.name, nic: empForm.nic, phone: empForm.phone, email: empForm.email,
      department: empForm.department, designation: empForm.designation,
      joinDate: '2024-10-22', status: empForm.type === 'Probation' ? 'Probation' : 'Active', type: empForm.type,
      baseSalary: Number(empForm.baseSalary),
      allowances: { transport: Number(empForm.transport) || 0, meal: Number(empForm.meal) || 0, phone: Number(empForm.phoneAllowance) || 0 },
      epfNo: `EPF-${10030 + employees.length}`, etfNo: `ETF-${10030 + employees.length}`,
      bankName: empForm.bankName, bankBranch: empForm.bankBranch, bankAccount: empForm.bankAccount,
      emergencyContact: empForm.emergencyContact,
      leaveBalance: { annual: empForm.type === 'Probation' ? 4 : 8, casual: empForm.type === 'Probation' ? 2 : 4, sick: 7, remaining: { annual: empForm.type === 'Probation' ? 4 : 8, casual: empForm.type === 'Probation' ? 2 : 4, sick: 7 } },
    };
    setEmployees([...employees, newEmp]);
    setShowAddEmp(false);
    setEmpForm({ name: '', nic: '', phone: '', email: '', department: 'Warehouse', designation: '', type: 'Permanent', baseSalary: '', transport: '', meal: '8000', phoneAllowance: '', bankName: '', bankBranch: '', bankAccount: '', emergencyContact: '' });
  };

  const tabs = [
    { key: 'employees', label: 'Employees', icon: Users },
    { key: 'payroll', label: 'Payroll', icon: DollarSign },
    { key: 'bonuses', label: 'Bonuses', icon: Award },
    { key: 'leaves', label: 'Leave Management', icon: Calendar },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="HR & Payroll" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Users} label="Total Employees" value={employees.length} subtitle={`${employees.filter(e => e.status === 'Active').length} active`} color="primary" />
          <StatCard icon={DollarSign} label="Monthly Payroll" value={`Rs. ${(totalPayroll / 1000000).toFixed(2)}M`} subtitle="Gross including allowances" color="info" />
          <StatCard icon={Calendar} label="Pending Leaves" value={pendingLeaves} subtitle="Awaiting approval" color="warning" />
          <StatCard icon={Award} label="Pending Bonuses" value={`Rs. ${pendingBonuses.toLocaleString()}`} subtitle={`${bonusData.filter(b => b.status === 'Pending').length} bonuses`} color="success" />
        </div>

        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.key ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        {/* EMPLOYEES TAB */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-xs">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">
                  <option value="All">All Departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button onClick={() => setShowAddEmp(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">
                <Plus size={18} /> Add Employee
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Designation</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Base Salary</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Net Pay</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">{emp.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{emp.name}</p>
                          <p className="text-xs text-gray-400">{emp.id} · Joined {emp.joinDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{emp.department}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{emp.designation}</td>
                    <td className="px-5 py-4 text-right text-sm text-gray-700">Rs. {emp.baseSalary.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-sm font-semibold text-gray-800">Rs. {getEmployeeNet(emp).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        emp.status === 'Active' ? 'bg-green-100 text-success' : 'bg-amber-100 text-warning'
                      }`}>{emp.status}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setShowEmpDetail(emp); setEmpDetailTab('info'); }} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md" title="View details">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => setShowPayslip(emp)} className="p-1.5 text-gray-400 hover:text-info hover:bg-blue-50 rounded-md" title="View payslip">
                          <FileText size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAYROLL TAB */}
        {activeTab === 'payroll' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-800">Payroll Summary — October 2024</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-green-700">
                  <Banknote size={16} /> Process Payroll
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Total Basic</p>
                  <p className="text-lg font-bold text-gray-800">Rs. {employees.reduce((a, e) => a + e.baseSalary, 0).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Total Allowances</p>
                  <p className="text-lg font-bold text-gray-800">Rs. {employees.reduce((a, e) => a + Object.values(e.allowances).reduce((s, v) => s + v, 0), 0).toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Pending Bonuses</p>
                  <p className="text-lg font-bold text-info">Rs. {pendingBonuses.toLocaleString()}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">EPF (12% employer)</p>
                  <p className="text-lg font-bold text-warning">Rs. {(employees.reduce((a, e) => a + e.baseSalary, 0) * 0.12).toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Net Payroll</p>
                  <p className="text-lg font-bold text-success">Rs. {employees.reduce((a, e) => a + getEmployeeNet(e), 0).toLocaleString()}</p>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Employee</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Basic</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Allowances</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Gross</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">EPF (8%)</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Net Pay</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Payslip</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => {
                    const allowances = Object.values(emp.allowances).reduce((s, v) => s + v, 0);
                    const gross = getEmployeeGross(emp);
                    const epf = getEmployeeDeductions(emp);
                    const net = getEmployeeNet(emp);
                    return (
                      <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-800">{emp.name}</p>
                          <p className="text-xs text-gray-400">{emp.designation}</p>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-600">Rs. {emp.baseSalary.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-600">Rs. {allowances.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-800">Rs. {gross.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-sm text-danger">- Rs. {epf.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-success">Rs. {net.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => setShowPayslip(emp)} className="text-xs text-primary hover:underline">View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Payroll History</h3>
              <div className="space-y-2">
                {payrollHistory.map(pr => (
                  <div key={pr.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{pr.month}</p>
                      <p className="text-xs text-gray-500">Processed: {pr.processedDate} · {pr.employeeCount} employees</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">Rs. {pr.netPayroll.toLocaleString()}</p>
                        {pr.totalBonuses > 0 && <p className="text-xs text-info">+ Rs. {pr.totalBonuses.toLocaleString()} bonuses</p>}
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        pr.status === 'Paid' ? 'bg-green-100 text-success' : 'bg-amber-100 text-warning'
                      }`}>{pr.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BONUSES TAB */}
        {activeTab === 'bonuses' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Manage performance bonuses, commissions, festival bonuses & special payments</p>
              </div>
              <button onClick={() => setShowBonusModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">
                <Plus size={18} /> Add Bonus
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Month</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {bonusData.map(b => (
                  <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800">{b.employeeName}</p>
                      <p className="text-xs text-gray-400">{b.employeeId}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        b.type === 'Performance' ? 'bg-blue-100 text-info' :
                        b.type === 'Sales Commission' ? 'bg-green-100 text-success' :
                        b.type === 'Festival' ? 'bg-purple-100 text-purple-700' :
                        b.type === 'Overtime' ? 'bg-amber-100 text-warning' :
                        'bg-gray-100 text-gray-600'
                      }`}>{b.type}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{b.month}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate">{b.reason}</td>
                    <td className="px-5 py-4 text-right text-sm font-semibold text-gray-800">Rs. {b.amount.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        b.status === 'Paid' ? 'bg-green-100 text-success' : 'bg-amber-100 text-warning'
                      }`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* LEAVES TAB */}
        {activeTab === 'leaves' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-1"><Clock size={15} className="text-warning" /><p className="text-xs text-gray-500">Pending</p></div>
                <p className="text-xl font-bold text-warning">{leaves.filter(l => l.status === 'Pending').length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-1"><CheckCircle2 size={15} className="text-success" /><p className="text-xs text-gray-500">Approved</p></div>
                <p className="text-xl font-bold text-success">{leaves.filter(l => l.status === 'Approved').length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-1"><XCircle size={15} className="text-danger" /><p className="text-xs text-gray-500">Rejected</p></div>
                <p className="text-xl font-bold text-danger">{leaves.filter(l => l.status === 'Rejected').length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-1"><Calendar size={15} className="text-info" /><p className="text-xs text-gray-500">Total Days Taken (Oct)</p></div>
                <p className="text-xl font-bold text-info">{leaves.filter(l => l.status === 'Approved').reduce((a, l) => a + l.days, 0)}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">Leave Requests</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Period</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Days</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map(l => (
                    <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-800">{l.employeeName}</p>
                        <p className="text-xs text-gray-400">Applied: {l.appliedDate}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          l.type === 'Annual' ? 'bg-blue-100 text-info' :
                          l.type === 'Sick' ? 'bg-red-100 text-danger' :
                          'bg-amber-100 text-warning'
                        }`}>{l.type}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{l.from}{l.from !== l.to ? ` → ${l.to}` : ''}</td>
                      <td className="px-5 py-4 text-center text-sm font-semibold text-gray-800">{l.days}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{l.reason}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          l.status === 'Approved' ? 'bg-green-100 text-success' :
                          l.status === 'Pending' ? 'bg-amber-100 text-warning' :
                          'bg-red-100 text-danger'
                        }`}>{l.status}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {l.status === 'Pending' && (
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleApproveLeave(l.id)} className="p-1.5 text-gray-400 hover:text-success hover:bg-green-50 rounded-md" title="Approve">
                              <CheckCircle2 size={16} />
                            </button>
                            <button onClick={() => handleRejectLeave(l.id)} className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded-md" title="Reject">
                              <XCircle size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Employee Detail Modal */}
        {showEmpDetail && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">{showEmpDetail.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{showEmpDetail.name}</h3>
                    <p className="text-sm text-gray-500">{showEmpDetail.designation} · {showEmpDetail.department}</p>
                  </div>
                </div>
                <button onClick={() => setShowEmpDetail(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <div className="flex gap-2 mb-5">
                {['info', 'salary', 'leaves'].map(t => (
                  <button key={t} onClick={() => setEmpDetailTab(t)} className={`px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors ${empDetailTab === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>{t === 'info' ? 'Personal Info' : t === 'salary' ? 'Salary Details' : 'Leave Balance'}</button>
                ))}
              </div>

              {empDetailTab === 'info' && (
                <div className="space-y-3">
                  {[
                    ['Employee ID', showEmpDetail.id], ['NIC', showEmpDetail.nic], ['Phone', showEmpDetail.phone], ['Email', showEmpDetail.email],
                    ['Department', showEmpDetail.department], ['Designation', showEmpDetail.designation], ['Joined', showEmpDetail.joinDate],
                    ['Type', showEmpDetail.type], ['EPF No', showEmpDetail.epfNo], ['ETF No', showEmpDetail.etfNo],
                    ['Bank', `${showEmpDetail.bankName} — ${showEmpDetail.bankBranch}`], ['Bank Account', showEmpDetail.bankAccount],
                    ['Emergency Contact', showEmpDetail.emergencyContact],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm py-2 border-b border-gray-100">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-gray-800">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {empDetailTab === 'salary' && (
                <div className="space-y-4">
                  <div className="bg-surface rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm py-1"><span className="text-gray-600">Base Salary</span><span className="font-medium">Rs. {showEmpDetail.baseSalary.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm py-1"><span className="text-gray-600">Transport Allowance</span><span className="font-medium">Rs. {showEmpDetail.allowances.transport.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm py-1"><span className="text-gray-600">Meal Allowance</span><span className="font-medium">Rs. {showEmpDetail.allowances.meal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm py-1"><span className="text-gray-600">Phone Allowance</span><span className="font-medium">Rs. {showEmpDetail.allowances.phone.toLocaleString()}</span></div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-sm py-1 font-semibold"><span>Gross Salary</span><span>Rs. {getEmployeeGross(showEmpDetail).toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm py-1 text-danger"><span>EPF Employee (8%)</span><span>- Rs. {getEmployeeDeductions(showEmpDetail).toLocaleString()}</span></div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-base py-1 font-bold"><span>Net Pay</span><span className="text-success">Rs. {getEmployeeNet(showEmpDetail).toLocaleString()}</span></div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h5 className="text-sm font-semibold text-info mb-2">Employer Contributions</h5>
                    <div className="flex justify-between text-sm py-1"><span className="text-gray-600">EPF Employer (12%)</span><span className="font-medium">Rs. {(showEmpDetail.baseSalary * 0.12).toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm py-1"><span className="text-gray-600">ETF (3%)</span><span className="font-medium">Rs. {(showEmpDetail.baseSalary * 0.03).toLocaleString()}</span></div>
                  </div>
                </div>
              )}

              {empDetailTab === 'leaves' && (
                <div className="space-y-4">
                  {['annual', 'casual', 'sick'].map(type => {
                    const total = showEmpDetail.leaveBalance[type];
                    const remaining = showEmpDetail.leaveBalance.remaining[type];
                    const used = total - remaining;
                    const pct = total > 0 ? (used / total) * 100 : 0;
                    return (
                      <div key={type} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-800 capitalize">{type} Leave</span>
                          <span className="text-sm text-gray-600">{used} used / {total} total</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                          <div className={`h-2.5 rounded-full ${pct > 75 ? 'bg-danger' : pct > 50 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${pct}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 text-right">{remaining} days remaining</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payslip Modal */}
        {showPayslip && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Payslip — October 2024</h3>
                <button onClick={() => setShowPayslip(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-5">
                <div className="text-center mb-4 pb-3 border-b border-gray-200">
                  <p className="text-sm font-bold text-gray-800">Ceylon Cinnamon Exports (Pvt) Ltd</p>
                  <p className="text-xs text-gray-500">Salary Slip — October 2024</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div><span className="text-gray-500">Name:</span> <span className="font-medium">{showPayslip.name}</span></div>
                  <div><span className="text-gray-500">ID:</span> <span className="font-medium">{showPayslip.id}</span></div>
                  <div><span className="text-gray-500">Dept:</span> <span className="font-medium">{showPayslip.department}</span></div>
                  <div><span className="text-gray-500">Designation:</span> <span className="font-medium">{showPayslip.designation}</span></div>
                  <div><span className="text-gray-500">EPF No:</span> <span className="font-medium">{showPayslip.epfNo}</span></div>
                  <div><span className="text-gray-500">Bank:</span> <span className="font-medium">{showPayslip.bankName}</span></div>
                </div>

                <div className="space-y-1 text-sm mb-3">
                  <p className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Earnings</p>
                  <div className="flex justify-between py-1"><span className="text-gray-600">Basic Salary</span><span>Rs. {showPayslip.baseSalary.toLocaleString()}</span></div>
                  <div className="flex justify-between py-1"><span className="text-gray-600">Transport</span><span>Rs. {showPayslip.allowances.transport.toLocaleString()}</span></div>
                  <div className="flex justify-between py-1"><span className="text-gray-600">Meal</span><span>Rs. {showPayslip.allowances.meal.toLocaleString()}</span></div>
                  {showPayslip.allowances.phone > 0 && <div className="flex justify-between py-1"><span className="text-gray-600">Phone</span><span>Rs. {showPayslip.allowances.phone.toLocaleString()}</span></div>}
                  {(() => {
                    const empBonuses = bonusData.filter(b => b.employeeId === showPayslip.id && b.month === 'October 2024');
                    return empBonuses.map(b => (
                      <div key={b.id} className="flex justify-between py-1 text-info"><span>{b.type} Bonus</span><span>Rs. {b.amount.toLocaleString()}</span></div>
                    ));
                  })()}
                </div>

                <div className="space-y-1 text-sm mb-3">
                  <p className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Deductions</p>
                  <div className="flex justify-between py-1 text-danger"><span>EPF Employee (8%)</span><span>- Rs. {(showPayslip.baseSalary * 0.08).toLocaleString()}</span></div>
                </div>

                <hr className="border-gray-300 my-2" />
                <div className="flex justify-between text-base font-bold py-1">
                  <span>Net Pay</span>
                  <span className="text-success">Rs. {getEmployeeNet(showPayslip).toLocaleString()}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-400 space-y-0.5">
                  <div className="flex justify-between"><span>EPF Employer (12%)</span><span>Rs. {(showPayslip.baseSalary * 0.12).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>ETF (3%)</span><span>Rs. {(showPayslip.baseSalary * 0.03).toLocaleString()}</span></div>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowPayslip(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Close</button>
                <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">Download PDF</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Bonus Modal */}
        {showBonusModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Add Bonus</h3>
                <button onClick={() => setShowBonusModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                  <select value={bonusForm.employeeId} onChange={e => setBonusForm({ ...bonusForm, employeeId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Select employee</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name} — {e.designation}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={bonusForm.type} onChange={e => setBonusForm({ ...bonusForm, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Performance</option>
                      <option>Sales Commission</option>
                      <option>Festival</option>
                      <option>Overtime</option>
                      <option>Special</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs.)</label>
                    <input type="number" value={bonusForm.amount} onChange={e => setBonusForm({ ...bonusForm, amount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select value={bonusForm.month} onChange={e => setBonusForm({ ...bonusForm, month: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>October 2024</option>
                    <option>November 2024</option>
                    <option>December 2024</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <input value={bonusForm.reason} onChange={e => setBonusForm({ ...bonusForm, reason: e.target.value })} placeholder="e.g., Exceeded sales targets" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowBonusModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={handleAddBonus} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">Add Bonus</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Employee Modal */}
        {showAddEmp && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Add New Employee</h3>
                <button onClick={() => setShowAddEmp(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5"><User size={15} /> Personal Information</h4>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Full Name</label>
                  <input value={empForm.name} onChange={e => setEmpForm({ ...empForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">NIC Number</label>
                  <input value={empForm.nic} onChange={e => setEmpForm({ ...empForm, nic: e.target.value })} placeholder="921234567V" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Phone</label>
                  <input value={empForm.phone} onChange={e => setEmpForm({ ...empForm, phone: e.target.value })} placeholder="+94 7X XXX XXXX" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Email</label>
                  <input value={empForm.email} onChange={e => setEmpForm({ ...empForm, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5"><Briefcase size={15} /> Employment Details</h4>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Department</label>
                  <select value={empForm.department} onChange={e => setEmpForm({ ...empForm, department: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Designation</label>
                  <input value={empForm.designation} onChange={e => setEmpForm({ ...empForm, designation: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Employment Type</label>
                  <select value={empForm.type} onChange={e => setEmpForm({ ...empForm, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="Permanent">Permanent</option>
                    <option value="Probation">Probation</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5"><DollarSign size={15} /> Salary & Allowances</h4>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Base Salary (Rs.)</label>
                  <input type="number" value={empForm.baseSalary} onChange={e => setEmpForm({ ...empForm, baseSalary: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Transport Allowance</label>
                  <input type="number" value={empForm.transport} onChange={e => setEmpForm({ ...empForm, transport: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Meal Allowance</label>
                  <input type="number" value={empForm.meal} onChange={e => setEmpForm({ ...empForm, meal: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Phone Allowance</label>
                  <input type="number" value={empForm.phoneAllowance} onChange={e => setEmpForm({ ...empForm, phoneAllowance: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5"><CreditCard size={15} /> Bank Details</h4>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Bank Name</label>
                  <input value={empForm.bankName} onChange={e => setEmpForm({ ...empForm, bankName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Branch</label>
                  <input value={empForm.bankBranch} onChange={e => setEmpForm({ ...empForm, bankBranch: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Account Number</label>
                  <input value={empForm.bankAccount} onChange={e => setEmpForm({ ...empForm, bankAccount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs text-gray-600 mb-1">Emergency Contact</label>
                <input value={empForm.emergencyContact} onChange={e => setEmpForm({ ...empForm, emergencyContact: e.target.value })} placeholder="Name — Phone number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowAddEmp(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={handleAddEmployee} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">Add Employee</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

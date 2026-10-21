export const users = [
  { id: 1, name: 'Kamal Perera', email: 'kamal@ceyloncinnamon.lk', role: 'Admin', status: 'Active', lastLogin: '2024-10-20' },
  { id: 2, name: 'Nimal Fernando', email: 'nimal@ceyloncinnamon.lk', role: 'Manager', status: 'Active', lastLogin: '2024-10-19' },
  { id: 3, name: 'Sunil Jayawardena', email: 'sunil@ceyloncinnamon.lk', role: 'Accountant', status: 'Active', lastLogin: '2024-10-18' },
  { id: 4, name: 'Amara Silva', email: 'amara@ceyloncinnamon.lk', role: 'Warehouse', status: 'Active', lastLogin: '2024-10-20' },
  { id: 5, name: 'Dilshan Rathnayake', email: 'dilshan@ceyloncinnamon.lk', role: 'Sales', status: 'Inactive', lastLogin: '2024-09-15' },
];

export const inventory = [
  { id: 1, grade: 'Alba (C-00000)', quantity: 250, unit: 'kg', location: 'Warehouse A', minStock: 50, pricePerKg: 8500, lastUpdated: '2024-10-20' },
  { id: 2, grade: 'C-00000 Special', quantity: 180, unit: 'kg', location: 'Warehouse A', minStock: 30, pricePerKg: 7200, lastUpdated: '2024-10-19' },
  { id: 3, grade: 'C-0000', quantity: 420, unit: 'kg', location: 'Warehouse B', minStock: 100, pricePerKg: 5500, lastUpdated: '2024-10-20' },
  { id: 4, grade: 'C-000', quantity: 380, unit: 'kg', location: 'Warehouse A', minStock: 80, pricePerKg: 4200, lastUpdated: '2024-10-18' },
  { id: 5, grade: 'C-00', quantity: 620, unit: 'kg', location: 'Warehouse B', minStock: 150, pricePerKg: 3500, lastUpdated: '2024-10-20' },
  { id: 6, grade: 'C-0', quantity: 890, unit: 'kg', location: 'Warehouse C', minStock: 200, pricePerKg: 2800, lastUpdated: '2024-10-19' },
  { id: 7, grade: 'Quillings', quantity: 1200, unit: 'kg', location: 'Warehouse C', minStock: 300, pricePerKg: 1800, lastUpdated: '2024-10-17' },
  { id: 8, grade: 'Cinnamon Bark Oil', quantity: 45, unit: 'L', location: 'Warehouse A', minStock: 10, pricePerKg: 25000, lastUpdated: '2024-10-20' },
];

export const suppliers = [
  { id: 1, name: 'Ratnapura Cinnamon Estate', contact: 'Bandara Wijesinghe', phone: '+94 71 234 5678', location: 'Ratnapura' },
  { id: 2, name: 'Galle Spice Gardens', contact: 'Mahinda Rajapaksa', phone: '+94 77 345 6789', location: 'Galle' },
  { id: 3, name: 'Matara Cinnamon Farms', contact: 'Chaminda Vaas', phone: '+94 76 456 7890', location: 'Matara' },
  { id: 4, name: 'Kalutara Peelers Co-op', contact: 'Saman Kumara', phone: '+94 75 567 8901', location: 'Kalutara' },
  { id: 5, name: 'Hambantota Spice Traders', contact: 'Ruwan Wickremasinghe', phone: '+94 78 678 9012', location: 'Hambantota' },
];

export const purchases = [
  {
    id: 'PO-001', date: '2024-10-15', supplier: 'Ratnapura Cinnamon Estate',
    items: [
      { grade: 'C-0000', grossWeight: 500, wastagePercent: 4, netWeight: 480, pricePerKg: 4800, total: 2304000 },
      { grade: 'C-000', grossWeight: 300, wastagePercent: 5, netWeight: 285, pricePerKg: 3800, total: 1083000 },
    ],
    totalGross: 800, totalNet: 765, grandTotal: 3387000, status: 'Completed', paidAmount: 3387000
  },
  {
    id: 'PO-002', date: '2024-10-18', supplier: 'Galle Spice Gardens',
    items: [
      { grade: 'Alba (C-00000)', grossWeight: 200, wastagePercent: 3, netWeight: 194, pricePerKg: 7500, total: 1455000 },
    ],
    totalGross: 200, totalNet: 194, grandTotal: 1455000, status: 'Pending Payment', paidAmount: 0
  },
  {
    id: 'PO-003', date: '2024-10-20', supplier: 'Matara Cinnamon Farms',
    items: [
      { grade: 'C-00', grossWeight: 1000, wastagePercent: 6, netWeight: 940, pricePerKg: 3200, total: 3008000 },
      { grade: 'C-0', grossWeight: 800, wastagePercent: 5, netWeight: 760, pricePerKg: 2500, total: 1900000 },
      { grade: 'Quillings', grossWeight: 500, wastagePercent: 8, netWeight: 460, pricePerKg: 1500, total: 690000 },
    ],
    totalGross: 2300, totalNet: 2160, grandTotal: 5598000, status: 'Completed', paidAmount: 5598000
  },
  {
    id: 'PO-004', date: '2024-10-21', supplier: 'Kalutara Peelers Co-op',
    items: [
      { grade: 'C-0000', grossWeight: 350, wastagePercent: 3.5, netWeight: 337.75, pricePerKg: 5000, total: 1688750 },
    ],
    totalGross: 350, totalNet: 337.75, grandTotal: 1688750, status: 'Partially Paid', paidAmount: 1000000
  },
];

export const salesInvoices = [
  { id: 'INV-001', date: '2024-10-16', customer: 'McCormick & Company (USA)', items: [{ grade: 'Alba (C-00000)', qty: 100, price: 12000, total: 1200000 }], total: 1200000, status: 'Paid', dueDate: '2024-11-16' },
  { id: 'INV-002', date: '2024-10-17', customer: 'Bart Ingredients (Netherlands)', items: [{ grade: 'C-0000', qty: 200, price: 8000, total: 1600000 }, { grade: 'C-000', qty: 150, price: 6000, total: 900000 }], total: 2500000, status: 'Paid', dueDate: '2024-11-17' },
  { id: 'INV-003', date: '2024-10-19', customer: 'Frontier Co-op (USA)', items: [{ grade: 'C-00', qty: 500, price: 5500, total: 2750000 }], total: 2750000, status: 'Pending', dueDate: '2024-11-19' },
  { id: 'INV-004', date: '2024-10-20', customer: 'Spice Islands (Australia)', items: [{ grade: 'C-0', qty: 300, price: 4500, total: 1350000 }, { grade: 'Quillings', qty: 400, price: 2800, total: 1120000 }], total: 2470000, status: 'Pending', dueDate: '2024-11-20' },
  { id: 'INV-005', date: '2024-10-21', customer: 'East India Trading (UK)', items: [{ grade: 'Alba (C-00000)', qty: 50, price: 13000, total: 650000 }, { grade: 'Cinnamon Bark Oil', qty: 10, price: 35000, total: 350000 }], total: 1000000, status: 'Draft', dueDate: '2024-11-21' },
];

export const bankAccounts = [
  { id: 1, name: 'Business Current Account', bank: 'Bank of Ceylon', accountNo: '****4521', balance: 4250000, currency: 'LKR' },
  { id: 2, name: 'Export Receipts Account', bank: 'Commercial Bank', accountNo: '****8903', balance: 12800000, currency: 'LKR' },
  { id: 3, name: 'USD Export Account', bank: 'HSBC Sri Lanka', accountNo: '****2267', balance: 45200, currency: 'USD' },
  { id: 4, name: 'Petty Cash', bank: 'Cash', accountNo: 'N/A', balance: 85000, currency: 'LKR' },
];

export const transactions = [
  { id: 1, date: '2024-10-20', description: 'Payment from McCormick & Company', type: 'Income', amount: 1200000, account: 'Export Receipts Account', category: 'Sales Revenue' },
  { id: 2, date: '2024-10-20', description: 'Payment to Ratnapura Cinnamon Estate', type: 'Expense', amount: 3387000, account: 'Business Current Account', category: 'Purchases' },
  { id: 3, date: '2024-10-19', description: 'Payment from Bart Ingredients', type: 'Income', amount: 2500000, account: 'USD Export Account', category: 'Sales Revenue' },
  { id: 4, date: '2024-10-19', description: 'Warehouse Rent - October', type: 'Expense', amount: 150000, account: 'Business Current Account', category: 'Rent' },
  { id: 5, date: '2024-10-18', description: 'Shipping charges - Container to USA', type: 'Expense', amount: 480000, account: 'Business Current Account', category: 'Shipping' },
  { id: 6, date: '2024-10-18', description: 'Payment to Matara Cinnamon Farms', type: 'Expense', amount: 5598000, account: 'Business Current Account', category: 'Purchases' },
  { id: 7, date: '2024-10-17', description: 'Staff Salaries - October', type: 'Expense', amount: 420000, account: 'Business Current Account', category: 'Salaries' },
  { id: 8, date: '2024-10-17', description: 'Electricity & Water', type: 'Expense', amount: 35000, account: 'Petty Cash', category: 'Utilities' },
  { id: 9, date: '2024-10-16', description: 'Partial payment to Kalutara Peelers', type: 'Expense', amount: 1000000, account: 'Business Current Account', category: 'Purchases' },
  { id: 10, date: '2024-10-15', description: 'Export certification fees', type: 'Expense', amount: 25000, account: 'Petty Cash', category: 'Regulatory' },
];

export const payments = [
  {
    id: 'PAY-001', date: '2024-10-16', poId: 'PO-001', supplier: 'Ratnapura Cinnamon Estate',
    amount: 2000000, method: 'Check', status: 'Cleared',
    checkDetails: { checkNo: 'CHQ-78451', bank: 'Bank of Ceylon', issueDate: '2024-10-16', clearanceDate: '2024-10-19', accountNo: '****4521' },
    notes: 'First installment'
  },
  {
    id: 'PAY-002', date: '2024-10-18', poId: 'PO-001', supplier: 'Ratnapura Cinnamon Estate',
    amount: 1387000, method: 'Cash', status: 'Completed',
    checkDetails: null,
    notes: 'Final settlement'
  },
  {
    id: 'PAY-003', date: '2024-10-19', poId: 'PO-003', supplier: 'Matara Cinnamon Farms',
    amount: 3000000, method: 'Check', status: 'Cleared',
    checkDetails: { checkNo: 'CHQ-78452', bank: 'Bank of Ceylon', issueDate: '2024-10-19', clearanceDate: '2024-10-22', accountNo: '****4521' },
    notes: 'Partial payment'
  },
  {
    id: 'PAY-004', date: '2024-10-20', poId: 'PO-003', supplier: 'Matara Cinnamon Farms',
    amount: 2598000, method: 'Bank Transfer', status: 'Completed',
    checkDetails: null,
    notes: 'Balance payment via bank transfer'
  },
  {
    id: 'PAY-005', date: '2024-10-21', poId: 'PO-004', supplier: 'Kalutara Peelers Co-op',
    amount: 1000000, method: 'Check', status: 'Pending',
    checkDetails: { checkNo: 'CHQ-78453', bank: 'Commercial Bank', issueDate: '2024-10-21', clearanceDate: null, accountNo: '****8903' },
    notes: 'Advance payment - awaiting clearance'
  },
];

export const checks = [
  { id: 'CHQ-78451', poId: 'PO-001', paymentId: 'PAY-001', supplier: 'Ratnapura Cinnamon Estate', amount: 2000000, bank: 'Bank of Ceylon', accountNo: '****4521', issueDate: '2024-10-16', clearanceDate: '2024-10-19', status: 'Cleared' },
  { id: 'CHQ-78452', poId: 'PO-003', paymentId: 'PAY-003', supplier: 'Matara Cinnamon Farms', amount: 3000000, bank: 'Bank of Ceylon', accountNo: '****4521', issueDate: '2024-10-19', clearanceDate: '2024-10-22', status: 'Cleared' },
  { id: 'CHQ-78453', poId: 'PO-004', paymentId: 'PAY-005', supplier: 'Kalutara Peelers Co-op', amount: 1000000, bank: 'Commercial Bank', accountNo: '****8903', issueDate: '2024-10-21', clearanceDate: null, status: 'Pending' },
  { id: 'CHQ-78440', poId: null, paymentId: null, supplier: 'Hambantota Spice Traders', amount: 750000, bank: 'Bank of Ceylon', accountNo: '****4521', issueDate: '2024-10-10', clearanceDate: '2024-10-13', status: 'Cleared' },
  { id: 'CHQ-78435', poId: null, paymentId: null, supplier: 'Galle Spice Gardens', amount: 500000, bank: 'Commercial Bank', accountNo: '****8903', issueDate: '2024-10-05', clearanceDate: null, status: 'Bounced' },
];

export const shipments = [
  {
    id: 'SHP-001', date: '2024-10-10', customer: 'McCormick & Company (USA)', destination: 'New York, USA',
    country: 'US', countryName: 'United States',
    containerNo: 'MAEU-4521876', vesselName: 'MSC Aurora', voyageNo: 'V-2024-1087',
    portOfLoading: 'Colombo Port (LKCMB)', portOfDischarge: 'Port Newark (USNYC)',
    etd: '2024-10-12', eta: '2024-11-05',
    items: [{ grade: 'Alba (C-00000)', qty: 100, weight: '100 kg', packages: '20 cartons' }],
    totalWeight: '100 kg', totalPackages: '20 cartons',
    invoiceRef: 'INV-001', invoiceAmount: 1200000,
    status: 'In Transit',
    documents: [
      { name: 'Bill of Lading', status: 'Issued', ref: 'BL-2024-4521' },
      { name: 'Commercial Invoice', status: 'Issued', ref: 'CI-2024-001' },
      { name: 'Packing List', status: 'Issued', ref: 'PL-2024-001' },
      { name: 'Certificate of Origin', status: 'Issued', ref: 'CO-2024-001' },
      { name: 'Phytosanitary Certificate', status: 'Issued', ref: 'PC-2024-001' },
      { name: 'Fumigation Certificate', status: 'Issued', ref: 'FC-2024-001' },
      { name: 'SLS 81 Certificate', status: 'Issued', ref: 'SLS-2024-001' },
    ],
    timeline: [
      { date: '2024-10-10', event: 'Shipment created', status: 'done' },
      { date: '2024-10-11', event: 'Documents prepared & verified', status: 'done' },
      { date: '2024-10-12', event: 'Customs cleared at Colombo Port', status: 'done' },
      { date: '2024-10-12', event: 'Loaded on vessel MSC Aurora', status: 'done' },
      { date: '2024-10-12', event: 'Departed Colombo Port', status: 'done' },
      { date: '2024-11-05', event: 'Expected arrival at Port Newark', status: 'pending' },
      { date: '2024-11-07', event: 'Customs clearance at destination', status: 'pending' },
      { date: '2024-11-10', event: 'Delivery to customer', status: 'pending' },
    ],
  },
  {
    id: 'SHP-002', date: '2024-10-14', customer: 'Bart Ingredients (Netherlands)', destination: 'Rotterdam, Netherlands',
    country: 'NL', countryName: 'Netherlands',
    containerNo: 'CMAU-7892341', vesselName: 'Ever Given', voyageNo: 'V-2024-1092',
    portOfLoading: 'Colombo Port (LKCMB)', portOfDischarge: 'Port of Rotterdam (NLRTM)',
    etd: '2024-10-16', eta: '2024-10-30',
    items: [
      { grade: 'C-0000', qty: 200, weight: '200 kg', packages: '40 cartons' },
      { grade: 'C-000', qty: 150, weight: '150 kg', packages: '30 cartons' },
    ],
    totalWeight: '350 kg', totalPackages: '70 cartons',
    invoiceRef: 'INV-002', invoiceAmount: 2500000,
    status: 'In Transit',
    documents: [
      { name: 'Bill of Lading', status: 'Issued', ref: 'BL-2024-4522' },
      { name: 'Commercial Invoice', status: 'Issued', ref: 'CI-2024-002' },
      { name: 'Packing List', status: 'Issued', ref: 'PL-2024-002' },
      { name: 'Certificate of Origin', status: 'Issued', ref: 'CO-2024-002' },
      { name: 'Phytosanitary Certificate', status: 'Issued', ref: 'PC-2024-002' },
      { name: 'EUR.1 Movement Certificate', status: 'Issued', ref: 'EUR1-2024-002' },
      { name: 'SLS 81 Certificate', status: 'Issued', ref: 'SLS-2024-002' },
    ],
    timeline: [
      { date: '2024-10-14', event: 'Shipment created', status: 'done' },
      { date: '2024-10-15', event: 'Documents prepared & verified', status: 'done' },
      { date: '2024-10-16', event: 'Customs cleared at Colombo Port', status: 'done' },
      { date: '2024-10-16', event: 'Loaded on vessel Ever Given', status: 'done' },
      { date: '2024-10-16', event: 'Departed Colombo Port', status: 'done' },
      { date: '2024-10-30', event: 'Expected arrival at Rotterdam', status: 'pending' },
      { date: '2024-11-01', event: 'EU customs clearance', status: 'pending' },
      { date: '2024-11-03', event: 'Delivery to customer', status: 'pending' },
    ],
  },
  {
    id: 'SHP-003', date: '2024-10-08', customer: 'Spice Islands (Australia)', destination: 'Melbourne, Australia',
    country: 'AU', countryName: 'Australia',
    containerNo: 'OOLU-3456128', vesselName: 'ANL Tongala', voyageNo: 'V-2024-1079',
    portOfLoading: 'Colombo Port (LKCMB)', portOfDischarge: 'Port of Melbourne (AUMEL)',
    etd: '2024-10-09', eta: '2024-10-22',
    items: [
      { grade: 'C-0', qty: 300, weight: '300 kg', packages: '60 cartons' },
      { grade: 'Quillings', qty: 400, weight: '400 kg', packages: '80 cartons' },
    ],
    totalWeight: '700 kg', totalPackages: '140 cartons',
    invoiceRef: 'INV-004', invoiceAmount: 2470000,
    status: 'Delivered',
    documents: [
      { name: 'Bill of Lading', status: 'Issued', ref: 'BL-2024-4520' },
      { name: 'Commercial Invoice', status: 'Issued', ref: 'CI-2024-004' },
      { name: 'Packing List', status: 'Issued', ref: 'PL-2024-004' },
      { name: 'Certificate of Origin', status: 'Issued', ref: 'CO-2024-004' },
      { name: 'Phytosanitary Certificate', status: 'Issued', ref: 'PC-2024-004' },
      { name: 'Fumigation Certificate', status: 'Issued', ref: 'FC-2024-004' },
      { name: 'SLS 81 Certificate', status: 'Issued', ref: 'SLS-2024-004' },
    ],
    timeline: [
      { date: '2024-10-08', event: 'Shipment created', status: 'done' },
      { date: '2024-10-08', event: 'Documents prepared & verified', status: 'done' },
      { date: '2024-10-09', event: 'Customs cleared at Colombo Port', status: 'done' },
      { date: '2024-10-09', event: 'Loaded on vessel ANL Tongala', status: 'done' },
      { date: '2024-10-09', event: 'Departed Colombo Port', status: 'done' },
      { date: '2024-10-22', event: 'Arrived at Port of Melbourne', status: 'done' },
      { date: '2024-10-22', event: 'Customs cleared at destination', status: 'done' },
      { date: '2024-10-23', event: 'Delivered to customer', status: 'done' },
    ],
  },
  {
    id: 'SHP-004', date: '2024-10-20', customer: 'East India Trading (UK)', destination: 'London, United Kingdom',
    country: 'GB', countryName: 'United Kingdom',
    containerNo: null, vesselName: null, voyageNo: null,
    portOfLoading: 'Colombo Port (LKCMB)', portOfDischarge: 'Port of Felixstowe (GBFXT)',
    etd: null, eta: null,
    items: [
      { grade: 'Alba (C-00000)', qty: 50, weight: '50 kg', packages: '10 cartons' },
      { grade: 'Cinnamon Bark Oil', qty: 10, weight: '10 L', packages: '2 drums' },
    ],
    totalWeight: '60 kg + 10 L', totalPackages: '12 packages',
    invoiceRef: 'INV-005', invoiceAmount: 1000000,
    status: 'Preparing',
    documents: [
      { name: 'Bill of Lading', status: 'Pending', ref: null },
      { name: 'Commercial Invoice', status: 'Draft', ref: 'CI-2024-005' },
      { name: 'Packing List', status: 'Draft', ref: 'PL-2024-005' },
      { name: 'Certificate of Origin', status: 'Pending', ref: null },
      { name: 'Phytosanitary Certificate', status: 'Pending', ref: null },
      { name: 'SLS 81 Certificate', status: 'Pending', ref: null },
    ],
    timeline: [
      { date: '2024-10-20', event: 'Shipment created', status: 'done' },
      { date: '2024-10-22', event: 'Preparing documents', status: 'current' },
      { date: null, event: 'Customs clearance at Colombo Port', status: 'pending' },
      { date: null, event: 'Load on vessel', status: 'pending' },
      { date: null, event: 'Depart Colombo Port', status: 'pending' },
      { date: null, event: 'Arrive at Port of Felixstowe', status: 'pending' },
      { date: null, event: 'UK customs clearance', status: 'pending' },
      { date: null, event: 'Delivery to customer', status: 'pending' },
    ],
  },
];

export const paymentAccounts = [
  {
    id: 1, type: 'Supplier', name: 'Ratnapura Cinnamon Estate', beneficiary: 'Ratnapura Cinnamon Estate (Pvt) Ltd',
    bank: 'Bank of Ceylon', branch: 'Ratnapura', accountNo: '0072-1234-5678-90', swiftCode: 'BABORLKLXXX',
    currency: 'LKR',
  },
  {
    id: 2, type: 'Supplier', name: 'Galle Spice Gardens', beneficiary: 'Galle Spice Gardens Ltd',
    bank: 'Commercial Bank', branch: 'Galle Fort', accountNo: '1050-9876-5432-10', swiftCode: 'CABORLKLXXX',
    currency: 'LKR',
  },
  {
    id: 3, type: 'Supplier', name: 'Matara Cinnamon Farms', beneficiary: 'Matara Cinnamon Farms (Pvt) Ltd',
    bank: 'Sampath Bank', branch: 'Matara', accountNo: '1076-4567-8901-23', swiftCode: 'BSAMLKLX',
    currency: 'LKR',
  },
  {
    id: 4, type: 'Shipping', name: 'Lanka Logistics (Pvt) Ltd', beneficiary: 'Lanka Logistics (Pvt) Ltd',
    bank: 'HSBC Sri Lanka', branch: 'Colombo Fort', accountNo: '0034-8765-4321-09', swiftCode: 'HABORLKAXXX',
    currency: 'LKR',
  },
  {
    id: 5, type: 'Regulatory', name: 'Sri Lanka Customs', beneficiary: 'Commissioner General of Customs',
    bank: 'Bank of Ceylon', branch: 'Customs House', accountNo: '0001-0000-1234-56', swiftCode: 'BABORLKLXXX',
    currency: 'LKR',
  },
];

export const gatewayTransactions = [
  { id: 'TXN-001', date: '2024-10-20', payee: 'Ratnapura Cinnamon Estate', amount: 2000000, method: 'Bank Transfer', accountNo: '****5678-90', bank: 'Bank of Ceylon', status: 'Completed', ref: 'BT-20241020-001' },
  { id: 'TXN-002', date: '2024-10-19', payee: 'Lanka Logistics (Pvt) Ltd', amount: 480000, method: 'Bank Transfer', accountNo: '****4321-09', bank: 'HSBC Sri Lanka', status: 'Completed', ref: 'BT-20241019-001' },
  { id: 'TXN-003', date: '2024-10-18', payee: 'Matara Cinnamon Farms', amount: 3000000, method: 'Bank Transfer', accountNo: '****8901-23', bank: 'Sampath Bank', status: 'Completed', ref: 'BT-20241018-001' },
  { id: 'TXN-004', date: '2024-10-17', payee: 'Sri Lanka Customs', amount: 25000, method: 'Bank Transfer', accountNo: '****1234-56', bank: 'Bank of Ceylon', status: 'Completed', ref: 'BT-20241017-001' },
  { id: 'TXN-005', date: '2024-10-21', payee: 'Galle Spice Gardens', amount: 750000, method: 'Bank Transfer', accountNo: '****5432-10', bank: 'Commercial Bank', status: 'Processing', ref: 'BT-20241021-001' },
];

export const employees = [
  {
    id: 'EMP-001', name: 'Kamal Perera', nic: '881234567V', phone: '+94 71 234 5678',
    email: 'kamal@ceyloncinnamon.lk', department: 'Management', designation: 'General Manager',
    joinDate: '2018-03-15', status: 'Active', type: 'Permanent',
    baseSalary: 180000, allowances: { transport: 15000, meal: 8000, phone: 5000 },
    epfNo: 'EPF-10021', etfNo: 'ETF-10021',
    bankName: 'Bank of Ceylon', bankBranch: 'Colombo 03', bankAccount: '0072-5678-9012',
    emergencyContact: 'Nimali Perera — +94 77 111 2222',
    leaveBalance: { annual: 8, casual: 4, sick: 7, remaining: { annual: 5, casual: 2, sick: 7 } },
  },
  {
    id: 'EMP-002', name: 'Nimal Fernando', nic: '901987654V', phone: '+94 77 345 6789',
    email: 'nimal@ceyloncinnamon.lk', department: 'Operations', designation: 'Operations Manager',
    joinDate: '2019-07-01', status: 'Active', type: 'Permanent',
    baseSalary: 140000, allowances: { transport: 12000, meal: 8000, phone: 3000 },
    epfNo: 'EPF-10022', etfNo: 'ETF-10022',
    bankName: 'Commercial Bank', bankBranch: 'Colombo Fort', bankAccount: '1050-3456-7890',
    emergencyContact: 'Saman Fernando — +94 76 333 4444',
    leaveBalance: { annual: 8, casual: 4, sick: 7, remaining: { annual: 3, casual: 1, sick: 6 } },
  },
  {
    id: 'EMP-003', name: 'Sunil Jayawardena', nic: '871456789V', phone: '+94 76 456 7890',
    email: 'sunil@ceyloncinnamon.lk', department: 'Finance', designation: 'Chief Accountant',
    joinDate: '2019-01-10', status: 'Active', type: 'Permanent',
    baseSalary: 120000, allowances: { transport: 10000, meal: 8000, phone: 3000 },
    epfNo: 'EPF-10023', etfNo: 'ETF-10023',
    bankName: 'Sampath Bank', bankBranch: 'Nugegoda', bankAccount: '1076-8901-2345',
    emergencyContact: 'Kumari Jayawardena — +94 75 555 6666',
    leaveBalance: { annual: 8, casual: 4, sick: 7, remaining: { annual: 6, casual: 3, sick: 5 } },
  },
  {
    id: 'EMP-004', name: 'Amara Silva', nic: '951678234V', phone: '+94 75 567 8901',
    email: 'amara@ceyloncinnamon.lk', department: 'Warehouse', designation: 'Warehouse Supervisor',
    joinDate: '2020-04-20', status: 'Active', type: 'Permanent',
    baseSalary: 85000, allowances: { transport: 8000, meal: 8000, phone: 2000 },
    epfNo: 'EPF-10024', etfNo: 'ETF-10024',
    bankName: 'Bank of Ceylon', bankBranch: 'Moratuwa', bankAccount: '0072-1234-5678',
    emergencyContact: 'Priya Silva — +94 71 777 8888',
    leaveBalance: { annual: 8, casual: 4, sick: 7, remaining: { annual: 4, casual: 4, sick: 7 } },
  },
  {
    id: 'EMP-005', name: 'Dilshan Rathnayake', nic: '921345678V', phone: '+94 78 678 9012',
    email: 'dilshan@ceyloncinnamon.lk', department: 'Sales', designation: 'Export Sales Executive',
    joinDate: '2021-06-15', status: 'Active', type: 'Permanent',
    baseSalary: 95000, allowances: { transport: 10000, meal: 8000, phone: 5000 },
    epfNo: 'EPF-10025', etfNo: 'ETF-10025',
    bankName: 'HNB', bankBranch: 'Colombo 07', bankAccount: '2501-9012-3456',
    emergencyContact: 'Malini Rathnayake — +94 77 999 0000',
    leaveBalance: { annual: 8, casual: 4, sick: 7, remaining: { annual: 7, casual: 3, sick: 7 } },
  },
  {
    id: 'EMP-006', name: 'Chamari Weerasinghe', nic: '961890123V', phone: '+94 71 789 0123',
    email: 'chamari@ceyloncinnamon.lk', department: 'Finance', designation: 'Accounts Clerk',
    joinDate: '2022-02-01', status: 'Active', type: 'Permanent',
    baseSalary: 55000, allowances: { transport: 6000, meal: 8000, phone: 0 },
    epfNo: 'EPF-10026', etfNo: 'ETF-10026',
    bankName: 'Sampath Bank', bankBranch: 'Maharagama', bankAccount: '1076-5678-9012',
    emergencyContact: 'Lalith Weerasinghe — +94 76 111 3333',
    leaveBalance: { annual: 8, casual: 4, sick: 7, remaining: { annual: 8, casual: 4, sick: 7 } },
  },
  {
    id: 'EMP-007', name: 'Ruwan Wickrema', nic: '881567890V', phone: '+94 77 890 1234',
    email: 'ruwan@ceyloncinnamon.lk', department: 'Warehouse', designation: 'Warehouse Worker',
    joinDate: '2022-08-10', status: 'Active', type: 'Permanent',
    baseSalary: 45000, allowances: { transport: 5000, meal: 8000, phone: 0 },
    epfNo: 'EPF-10027', etfNo: 'ETF-10027',
    bankName: 'People\'s Bank', bankBranch: 'Panadura', bankAccount: '3012-3456-7890',
    emergencyContact: 'Shani Wickrema — +94 75 222 4444',
    leaveBalance: { annual: 8, casual: 4, sick: 7, remaining: { annual: 6, casual: 2, sick: 4 } },
  },
  {
    id: 'EMP-008', name: 'Thilini Gamage', nic: '971234890V', phone: '+94 76 901 2345',
    email: 'thilini@ceyloncinnamon.lk', department: 'Warehouse', designation: 'Quality Inspector',
    joinDate: '2023-01-15', status: 'Active', type: 'Permanent',
    baseSalary: 65000, allowances: { transport: 7000, meal: 8000, phone: 2000 },
    epfNo: 'EPF-10028', etfNo: 'ETF-10028',
    bankName: 'Commercial Bank', bankBranch: 'Galle', bankAccount: '1050-6789-0123',
    emergencyContact: 'Asela Gamage — +94 71 333 5555',
    leaveBalance: { annual: 8, casual: 4, sick: 7, remaining: { annual: 7, casual: 4, sick: 6 } },
  },
  {
    id: 'EMP-009', name: 'Pradeep Kumara', nic: '891678901V', phone: '+94 78 012 3456',
    email: 'pradeep@ceyloncinnamon.lk', department: 'Logistics', designation: 'Shipping Coordinator',
    joinDate: '2021-11-01', status: 'Active', type: 'Permanent',
    baseSalary: 75000, allowances: { transport: 8000, meal: 8000, phone: 3000 },
    epfNo: 'EPF-10029', etfNo: 'ETF-10029',
    bankName: 'Bank of Ceylon', bankBranch: 'Colombo Fort', bankAccount: '0072-7890-1234',
    emergencyContact: 'Nilmini Kumara — +94 77 444 6666',
    leaveBalance: { annual: 8, casual: 4, sick: 7, remaining: { annual: 4, casual: 0, sick: 5 } },
  },
  {
    id: 'EMP-010', name: 'Sandun Peris', nic: '941890234V', phone: '+94 71 123 4567',
    email: 'sandun@ceyloncinnamon.lk', department: 'Warehouse', designation: 'Warehouse Worker',
    joinDate: '2023-05-20', status: 'Probation', type: 'Probation',
    baseSalary: 40000, allowances: { transport: 5000, meal: 8000, phone: 0 },
    epfNo: 'EPF-10030', etfNo: 'ETF-10030',
    bankName: 'People\'s Bank', bankBranch: 'Kalutara', bankAccount: '3012-0123-4567',
    emergencyContact: 'Damayanthi Peris — +94 76 555 7777',
    leaveBalance: { annual: 4, casual: 2, sick: 7, remaining: { annual: 4, casual: 2, sick: 7 } },
  },
];

export const payrollHistory = [
  {
    id: 'PR-2024-10', month: 'October 2024', processedDate: '2024-10-25', status: 'Pending',
    totalBasic: 900000, totalAllowances: 227000, totalBonuses: 0,
    totalEpf: 108000, totalEtf: 27000, totalDeductions: 135000,
    netPayroll: 992000, employeeCount: 10,
  },
  {
    id: 'PR-2024-09', month: 'September 2024', processedDate: '2024-09-25', status: 'Paid',
    totalBasic: 900000, totalAllowances: 227000, totalBonuses: 180000,
    totalEpf: 108000, totalEtf: 27000, totalDeductions: 135000,
    netPayroll: 1172000, employeeCount: 10,
  },
  {
    id: 'PR-2024-08', month: 'August 2024', processedDate: '2024-08-25', status: 'Paid',
    totalBasic: 860000, totalAllowances: 215000, totalBonuses: 0,
    totalEpf: 103200, totalEtf: 25800, totalDeductions: 129000,
    netPayroll: 946000, employeeCount: 9,
  },
];

export const leaveRequests = [
  { id: 'LV-001', employeeId: 'EMP-002', employeeName: 'Nimal Fernando', type: 'Annual', from: '2024-10-28', to: '2024-10-30', days: 3, reason: 'Family function', status: 'Pending', appliedDate: '2024-10-20' },
  { id: 'LV-002', employeeId: 'EMP-007', employeeName: 'Ruwan Wickrema', type: 'Sick', from: '2024-10-21', to: '2024-10-22', days: 2, reason: 'Fever and flu', status: 'Approved', appliedDate: '2024-10-21' },
  { id: 'LV-003', employeeId: 'EMP-005', employeeName: 'Dilshan Rathnayake', type: 'Casual', from: '2024-10-25', to: '2024-10-25', days: 1, reason: 'Personal matter', status: 'Pending', appliedDate: '2024-10-22' },
  { id: 'LV-004', employeeId: 'EMP-009', employeeName: 'Pradeep Kumara', type: 'Annual', from: '2024-11-04', to: '2024-11-08', days: 5, reason: 'Vacation trip', status: 'Pending', appliedDate: '2024-10-22' },
  { id: 'LV-005', employeeId: 'EMP-004', employeeName: 'Amara Silva', type: 'Casual', from: '2024-10-18', to: '2024-10-18', days: 1, reason: 'Doctor visit', status: 'Approved', appliedDate: '2024-10-17' },
  { id: 'LV-006', employeeId: 'EMP-003', employeeName: 'Sunil Jayawardena', type: 'Annual', from: '2024-10-14', to: '2024-10-15', days: 2, reason: 'Family event', status: 'Approved', appliedDate: '2024-10-10' },
  { id: 'LV-007', employeeId: 'EMP-007', employeeName: 'Ruwan Wickrema', type: 'Sick', from: '2024-10-07', to: '2024-10-07', days: 1, reason: 'Back pain', status: 'Approved', appliedDate: '2024-10-07' },
];

export const bonuses = [
  { id: 'BN-001', employeeId: 'EMP-001', employeeName: 'Kamal Perera', type: 'Performance', amount: 50000, month: 'September 2024', reason: 'Exceeded Q3 export targets', status: 'Paid' },
  { id: 'BN-002', employeeId: 'EMP-002', employeeName: 'Nimal Fernando', type: 'Performance', amount: 35000, month: 'September 2024', reason: 'Warehouse efficiency improvement', status: 'Paid' },
  { id: 'BN-003', employeeId: 'EMP-005', employeeName: 'Dilshan Rathnayake', type: 'Sales Commission', amount: 45000, month: 'September 2024', reason: 'New client acquisition — Frontier Co-op', status: 'Paid' },
  { id: 'BN-004', employeeId: 'EMP-008', employeeName: 'Thilini Gamage', type: 'Special', amount: 25000, month: 'September 2024', reason: 'Quality audit — zero defects', status: 'Paid' },
  { id: 'BN-005', employeeId: 'EMP-009', employeeName: 'Pradeep Kumara', type: 'Overtime', amount: 25000, month: 'September 2024', reason: 'Weekend container loading', status: 'Paid' },
  { id: 'BN-006', employeeId: 'EMP-001', employeeName: 'Kamal Perera', type: 'Festival', amount: 30000, month: 'October 2024', reason: 'Deepavali festival bonus', status: 'Pending' },
  { id: 'BN-007', employeeId: 'EMP-002', employeeName: 'Nimal Fernando', type: 'Festival', amount: 30000, month: 'October 2024', reason: 'Deepavali festival bonus', status: 'Pending' },
];

export const monthlyRevenue = [
  { month: 'May', revenue: 8200000, expenses: 6100000 },
  { month: 'Jun', revenue: 9500000, expenses: 7200000 },
  { month: 'Jul', revenue: 7800000, expenses: 5900000 },
  { month: 'Aug', revenue: 11200000, expenses: 8400000 },
  { month: 'Sep', revenue: 10600000, expenses: 7800000 },
  { month: 'Oct', revenue: 9920000, expenses: 7500000 },
];

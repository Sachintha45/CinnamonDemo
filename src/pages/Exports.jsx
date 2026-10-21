import { useState } from 'react';
import { Ship, Eye, X, Plus, FileCheck, MapPin, Clock, CheckCircle2, Package, Anchor, Globe, FileText, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { shipments as initialShipments } from '../data/mockData';

const countryFlags = { US: '\u{1F1FA}\u{1F1F8}', NL: '\u{1F1F3}\u{1F1F1}', AU: '\u{1F1E6}\u{1F1FA}', GB: '\u{1F1EC}\u{1F1E7}', DE: '\u{1F1E9}\u{1F1EA}', JP: '\u{1F1EF}\u{1F1F5}', IN: '\u{1F1EE}\u{1F1F3}' };

export default function Exports() {
  const [shipments] = useState(initialShipments);
  const [showDetail, setShowDetail] = useState(null);
  const [detailTab, setDetailTab] = useState('overview');

  const inTransit = shipments.filter(s => s.status === 'In Transit');
  const delivered = shipments.filter(s => s.status === 'Delivered');
  const preparing = shipments.filter(s => s.status === 'Preparing');
  const totalExportValue = shipments.reduce((a, s) => a + s.invoiceAmount, 0);

  const statusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-success';
      case 'In Transit': return 'bg-blue-100 text-info';
      case 'Preparing': return 'bg-amber-100 text-warning';
      case 'Customs Hold': return 'bg-red-100 text-danger';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const docStatusColor = (status) => {
    switch (status) {
      case 'Issued': return 'text-success bg-green-50';
      case 'Draft': return 'text-warning bg-amber-50';
      case 'Pending': return 'text-gray-400 bg-gray-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Exports & Shipping" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Globe} label="Total Export Value" value={`Rs. ${(totalExportValue / 1000000).toFixed(1)}M`} color="primary" />
          <StatCard icon={Ship} label="In Transit" value={inTransit.length} subtitle={`${inTransit.length} shipments on water`} color="info" />
          <StatCard icon={CheckCircle2} label="Delivered" value={delivered.length} subtitle="Successfully received" color="success" />
          <StatCard icon={Package} label="Preparing" value={preparing.length} subtitle="Awaiting shipment" color="warning" />
        </div>

        {/* Active Shipments Map-like View */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Globe size={18} className="text-primary" /> Active Export Destinations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {shipments.filter(s => s.status !== 'Delivered').map(s => (
              <div key={s.id} onClick={() => { setShowDetail(s); setDetailTab('overview'); }} className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-surface hover:border-primary border border-transparent transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{countryFlags[s.country] || '\u{1F30D}'}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{s.countryName}</p>
                    <p className="text-xs text-gray-500">{s.destination}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{s.customer}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(s.status)}`}>{s.status}</span>
                  {s.eta && <span className="text-xs text-gray-400">ETA: {s.eta}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">All shipments</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">
              <Plus size={18} /> New Shipment
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Shipment</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer / Destination</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Container / Vessel</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">ETD / ETA</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Value</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Docs</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(s => {
                const docsReady = s.documents.filter(d => d.status === 'Issued').length;
                const docsTotal = s.documents.length;
                return (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-primary">{s.id}</p>
                      <p className="text-xs text-gray-400">{s.date}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{countryFlags[s.country] || '\u{1F30D}'}</span>
                        <div>
                          <p className="text-sm text-gray-800">{s.customer}</p>
                          <p className="text-xs text-gray-500">{s.destination}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {s.containerNo ? (
                        <div>
                          <p className="text-sm text-gray-700 font-mono">{s.containerNo}</p>
                          <p className="text-xs text-gray-500">{s.vesselName}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {s.etd ? (
                        <div>
                          <p className="text-xs text-gray-500">ETD: <span className="text-gray-700">{s.etd}</span></p>
                          <p className="text-xs text-gray-500">ETA: <span className="text-gray-700">{s.eta}</span></p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">TBD</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-semibold text-gray-800">Rs. {s.invoiceAmount.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-success" style={{ width: `${(docsReady / docsTotal) * 100}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500">{docsReady}/{docsTotal}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(s.status)}`}>{s.status}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => { setShowDetail(s); setDetailTab('overview'); }} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Shipment Detail Modal */}
        {showDetail && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{countryFlags[showDetail.country] || '\u{1F30D}'}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Shipment {showDetail.id}</h3>
                    <p className="text-sm text-gray-500">{showDetail.customer} — {showDetail.destination}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(showDetail.status)}`}>{showDetail.status}</span>
                  <button onClick={() => setShowDetail(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
              </div>

              <div className="flex gap-2 mb-5">
                {['overview', 'documents', 'tracking'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setDetailTab(tab)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${
                      detailTab === tab ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >{tab}</button>
                ))}
              </div>

              {detailTab === 'overview' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Container</p>
                      <p className="text-sm font-mono font-medium text-gray-800">{showDetail.containerNo || 'TBD'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Vessel / Voyage</p>
                      <p className="text-sm font-medium text-gray-800">{showDetail.vesselName || 'TBD'}</p>
                      {showDetail.voyageNo && <p className="text-xs text-gray-400">{showDetail.voyageNo}</p>}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Invoice</p>
                      <p className="text-sm font-medium text-primary">{showDetail.invoiceRef}</p>
                      <p className="text-xs text-gray-600">Rs. {showDetail.invoiceAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Total Cargo</p>
                      <p className="text-sm font-medium text-gray-800">{showDetail.totalWeight}</p>
                      <p className="text-xs text-gray-400">{showDetail.totalPackages}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Anchor size={16} className="text-info" />
                        <p className="text-sm font-semibold text-info">Port of Loading</p>
                      </div>
                      <p className="text-sm text-gray-800">{showDetail.portOfLoading}</p>
                      {showDetail.etd && <p className="text-xs text-gray-500 mt-1">ETD: {showDetail.etd}</p>}
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-success" />
                        <p className="text-sm font-semibold text-success">Port of Discharge</p>
                      </div>
                      <p className="text-sm text-gray-800">{showDetail.portOfDischarge}</p>
                      {showDetail.eta && <p className="text-xs text-gray-500 mt-1">ETA: {showDetail.eta}</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Cargo Items</h4>
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Grade</th>
                          <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Quantity</th>
                          <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Weight</th>
                          <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Packages</th>
                        </tr>
                      </thead>
                      <tbody>
                        {showDetail.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-100">
                            <td className="px-4 py-3 text-sm text-gray-800">{item.grade}</td>
                            <td className="px-4 py-3 text-right text-sm text-gray-600">{item.qty}</td>
                            <td className="px-4 py-3 text-right text-sm text-gray-600">{item.weight}</td>
                            <td className="px-4 py-3 text-right text-sm text-gray-600">{item.packages}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {detailTab === 'documents' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">Export documents for this shipment</p>
                    <div className="flex items-center gap-2 text-sm">
                      <FileCheck size={16} className="text-success" />
                      <span className="text-gray-600">
                        {showDetail.documents.filter(d => d.status === 'Issued').length} / {showDetail.documents.length} ready
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {showDetail.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            doc.status === 'Issued' ? 'bg-green-100' : doc.status === 'Draft' ? 'bg-amber-100' : 'bg-gray-200'
                          }`}>
                            {doc.status === 'Issued' ? <FileCheck size={18} className="text-success" /> :
                             doc.status === 'Draft' ? <FileText size={18} className="text-warning" /> :
                             <AlertCircle size={18} className="text-gray-400" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                            {doc.ref && <p className="text-xs text-gray-400">Ref: {doc.ref}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${docStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                          {doc.status === 'Issued' && (
                            <button className="text-xs text-primary hover:underline">Download</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 p-4 bg-surface rounded-lg border border-gray-200">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Required Export Documents (Sri Lanka)</h5>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• <strong>Bill of Lading (B/L)</strong> — Issued by shipping line, proof of cargo receipt</li>
                      <li>• <strong>Commercial Invoice</strong> — Details of goods, prices, buyer/seller</li>
                      <li>• <strong>Packing List</strong> — Itemized list of package contents</li>
                      <li>• <strong>Certificate of Origin</strong> — Issued by Ceylon Chamber of Commerce</li>
                      <li>• <strong>Phytosanitary Certificate</strong> — Issued by Dept. of Agriculture, pest-free certification</li>
                      <li>• <strong>SLS 81 Certificate</strong> — Sri Lanka Standards for Ceylon Cinnamon quality grading</li>
                      <li>• <strong>Fumigation Certificate</strong> — Required by some destinations (US, AU)</li>
                      <li>• <strong>EUR.1 Movement Certificate</strong> — For EU GSP+ preferential tariff access</li>
                    </ul>
                  </div>
                </div>
              )}

              {detailTab === 'tracking' && (
                <div>
                  <div className="flex items-center gap-3 mb-5 p-4 bg-surface rounded-lg">
                    <Ship size={20} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {showDetail.portOfLoading} → {showDetail.portOfDischarge}
                      </p>
                      <p className="text-xs text-gray-500">
                        {showDetail.vesselName ? `${showDetail.vesselName} · ${showDetail.voyageNo}` : 'Vessel not yet assigned'}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-0">
                      {showDetail.timeline.map((step, idx) => {
                        const isDone = step.status === 'done';
                        const isCurrent = step.status === 'current';
                        return (
                          <div key={idx} className="relative flex items-start gap-4 py-3">
                            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isDone ? 'bg-success text-white' :
                              isCurrent ? 'bg-primary text-white ring-4 ring-primary/20' :
                              'bg-gray-200 text-gray-400'
                            }`}>
                              {isDone ? <CheckCircle2 size={18} /> :
                               isCurrent ? <Clock size={18} /> :
                               <Clock size={18} />}
                            </div>
                            <div className="pt-2">
                              <p className={`text-sm font-medium ${isDone || isCurrent ? 'text-gray-800' : 'text-gray-400'}`}>
                                {step.event}
                              </p>
                              <p className={`text-xs ${isDone ? 'text-gray-500' : 'text-gray-400'}`}>
                                {step.date || 'Date TBD'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StatCard({ icon: Icon, label, value, subtitle, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-50 text-success',
    warning: 'bg-amber-50 text-warning',
    info: 'bg-blue-50 text-info',
    danger: 'bg-red-50 text-danger',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

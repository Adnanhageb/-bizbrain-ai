import React from 'react'
import { AlertTriangle, CheckCircle, Info, Bell, TrendingDown, TrendingUp, AlertOctagon } from 'lucide-react'

export default function AlertsPanel({ alerts }) {
  const severityConfig = {
    danger: {
      icon: AlertOctagon,
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      badge: 'bg-red-500',
      badgeText: 'حرج',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      badge: 'bg-amber-500',
      badgeText: 'تحذير',
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      badge: 'bg-blue-500',
      badgeText: 'معلومة',
    },
    success: {
      icon: CheckCircle,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      badge: 'bg-emerald-500',
      badgeText: 'جيد',
    },
  }

  const allAlerts = alerts.length > 0 ? alerts : [
    {
      title: '✅ لا توجد تنبيهات حرجة',
      message: 'جميع المؤشرات ضمن النطاق الطبيعي. استمر في المتابعة الدورية.',
      severity: 'success',
    }
  ]

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">نظام التنبيهات الذكية</h2>
          <p className="text-slate-500 text-sm mt-1">تنبيهات استباقية بناءً على تحليل بياناتك</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200">
          <Bell className="w-5 h-5 text-primary-500" />
          <span className="text-sm font-medium text-slate-700">{allAlerts.length} تنبيه</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'حرج', count: allAlerts.filter(a => a.severity === 'danger').length, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'تحذير', count: allAlerts.filter(a => a.severity === 'warning').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'معلومة', count: allAlerts.filter(a => a.severity === 'info').length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'جيد', count: allAlerts.filter(a => a.severity === 'success').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.bg} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {allAlerts.map((alert, index) => {
          const config = severityConfig[alert.severity] || severityConfig.info
          const Icon = config.icon

          return (
            <div
              key={index}
              className={`${config.bg} border ${config.border} rounded-2xl p-5 animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${config.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-slate-800">{alert.title}</h3>
                    <span className={`px-2 py-0.5 ${config.badge} text-white text-xs rounded-lg font-medium`}>
                      {config.badgeText}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{alert.message}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Smart Monitoring */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-2">المراقبة الذكية</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              يقوم BizBrain AI بمراقبة بياناتك بشكل مستمر ويُرسل تنبيهات استباقية عند:
            </p>
            <div className="mt-3 grid sm:grid-cols-2 gap-2">
              {[
                'انخفاض مفاجئ في المبيعات',
                'زيادة غير مبررة في التكاليف',
                'نقص متوقع في السيولة',
                'تراجع معدل الربحية',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

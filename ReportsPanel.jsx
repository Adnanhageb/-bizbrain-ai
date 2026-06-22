import React, { useState } from 'react'
import { FileText, Download, Calendar, TrendingUp, AlertTriangle, CheckCircle, Brain, Printer, FileSpreadsheet } from 'lucide-react'
import { formatNumber } from '../utils/analysis'

export default function ReportsPanel({ data, analysis }) {
  const [reportType, setReportType] = useState('summary')
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTypes = [
    { id: 'summary', label: 'ملخص تنفيذي', icon: FileText, desc: 'نظرة شاملة على أداء الشركة' },
    { id: 'financial', label: 'التقرير المالي', icon: TrendingUp, desc: 'تحليل مفصل للإيرادات والأرباح' },
    { id: 'operational', label: 'التقرير التشغيلي', icon: Brain, desc: 'تحليل العمليات والمنتجات' },
  ]

  const handleGeneratePDF = () => {
    setIsGenerating(true)
    setTimeout(() => {
      // Create a simple text report for download
      const reportContent = generateReportContent(reportType, analysis)
      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `BizBrain_Report_${reportType}_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setIsGenerating(false)
    }, 1500)
  }

  const handleExportExcel = () => {
    // In a real app, this would use SheetJS to generate a formatted Excel report
    alert('سيتم تصدير التقرير بصيغة Excel قريباً!')
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">التقارير والمخرجات</h2>
          <p className="text-slate-500 text-sm mt-1">توليد تقارير ديناميكية بناءً على بياناتك</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري التوليد...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                تصدير التقرير
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid sm:grid-cols-3 gap-4">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setReportType(type.id)}
            className={`p-5 rounded-2xl border-2 text-right transition-all duration-200 ${
              reportType === type.id
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-primary-200 hover:bg-slate-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
              reportType === type.id ? 'bg-primary-500' : 'bg-slate-100'
            }`}>
              <type.icon className={`w-6 h-6 ${reportType === type.id ? 'text-white' : 'text-slate-500'}`} />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{type.label}</h3>
            <p className="text-xs text-slate-500">{type.desc}</p>
          </button>
        ))}
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">
                  {reportTypes.find(t => t.id === reportType)?.label}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg">
              جاهز للتصدير
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Executive Summary */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary-500" />
              الملخص التنفيذي
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed">
              تم تحليل {data.length} سجل معاملة. إجمالي الإيرادات بلغ {formatNumber(analysis.kpis.totalRevenue)} ريال 
              بإجمالي أرباح {formatNumber(analysis.kpis.totalProfit)} ريال ({analysis.kpis.profitMargin}% هامش ربحية).
              {analysis.kpis.profitMargin > 20 
                ? ' أداء ممتاز يتجاوز المتوسط الصناعي.' 
                : analysis.kpis.profitMargin > 10 
                  ? ' أداء مقبول مع فرص للتحسين.' 
                  : ' يتطلب مراجعة عاجلة للتكاليف.'}
            </div>
          </div>

          {/* KPIs Grid */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3">المؤشرات الرئيسية</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'إجمالي الإيرادات', value: formatNumber(analysis.kpis.totalRevenue) + ' ريال', color: 'text-primary-600' },
                { label: 'إجمالي الأرباح', value: formatNumber(analysis.kpis.totalProfit) + ' ريال', color: 'text-emerald-600' },
                { label: 'إجمالي التكاليف', value: formatNumber(analysis.kpis.totalCost) + ' ريال', color: 'text-red-500' },
                { label: 'هامش الربحية', value: analysis.kpis.profitMargin + '%', color: 'text-amber-600' },
                { label: 'عدد المعاملات', value: analysis.kpis.transactionCount, color: 'text-slate-700' },
                { label: 'متوسط الصفقة', value: formatNumber(analysis.kpis.avgOrderValue) + ' ريال', color: 'text-purple-600' },
                { label: 'إجمالي الكمية', value: formatNumber(analysis.kpis.totalQuantity), color: 'text-cyan-600' },
                { label: 'نسبة التكلفة', value: ((analysis.kpis.totalCost/analysis.kpis.totalRevenue)*100).toFixed(1) + '%', color: 'text-rose-600' },
              ].map((kpi, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                  <p className={`font-bold text-sm ${kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-slate-800 mb-3">أفضل المنتجات</h4>
              <div className="space-y-2">
                {analysis.charts.topProducts.slice(0, 5).map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-700">{product.name}</span>
                    </div>
                    <span className="text-sm font-bold text-primary-600">{formatNumber(product.value)} ر.س</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-3">أفضل العملاء</h4>
              <div className="space-y-2">
                {analysis.charts.topCustomers.slice(0, 5).map((customer, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-accent-100 text-accent-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-700">{customer.name}</span>
                    </div>
                    <span className="text-sm font-bold text-accent-600">{formatNumber(customer.value)} ر.س</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3">الرؤى والتوصيات</h4>
            <div className="space-y-3">
              {analysis.insights.map((insight, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${
                  insight.type === 'success' ? 'bg-emerald-50 border-emerald-200' :
                  insight.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                  insight.type === 'danger' ? 'bg-red-50 border-red-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start gap-2">
                    {insight.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />}
                    {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />}
                    {insight.type === 'danger' && <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />}
                    {insight.type === 'info' && <Brain className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />}
                    <div>
                      <h5 className="font-bold text-sm mb-1">{insight.title}</h5>
                      <p className="text-sm text-slate-600">{insight.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-400">
              تم إنشاء هذا التقرير بواسطة BizBrain AI • {new Date().toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function generateReportContent(type, analysis) {
  const date = new Date().toLocaleDateString('ar-SA')
  let content = `تقرير BizBrain AI - ${type === 'summary' ? 'ملخص تنفيذي' : type === 'financial' ? 'التقرير المالي' : 'التقرير التشغيلي'}\n`
  content += `تاريخ التقرير: ${date}\n`
  content += `================================\n\n`

  content += `المؤشرات الرئيسية:\n`
  content += `- إجمالي الإيرادات: ${formatNumber(analysis.kpis.totalRevenue)} ريال\n`
  content += `- إجمالي الأرباح: ${formatNumber(analysis.kpis.totalProfit)} ريال\n`
  content += `- هامش الربحية: ${analysis.kpis.profitMargin}%\n`
  content += `- عدد المعاملات: ${analysis.kpis.transactionCount}\n\n`

  content += `أفضل المنتجات:\n`
  analysis.charts.topProducts.slice(0, 5).forEach((p, i) => {
    content += `${i + 1}. ${p.name}: ${formatNumber(p.value)} ريال\n`
  })

  content += `\nالتوصيات:\n`
  analysis.insights.forEach((insight, i) => {
    content += `${i + 1}. ${insight.title}: ${insight.content}\n`
  })

  return content
}

import React, { useState, useCallback } from ‘react’
import { Brain, Upload, BarChart3, MessageSquare, FileText, Bell, Settings, ChevronLeft, X, Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Lightbulb, Send, Sparkles, FileSpreadsheet, Trash2 } from ‘lucide-react’
import * as XLSX from ‘xlsx’
import { analyzeFinancialData, formatNumber, generateChatResponse, generatePDFReport } from ‘./analysis.js’
import Dashboard from ‘./Dashboard.jsx’
import ChatInterface from ‘./ChatInterface.jsx’
import ReportsPanel from ‘./ReportsPanel.jsx’
import AlertsPanel from ‘./AlertsPanel.jsx’
import AlertsPanel from ‘./AlertsPanel.jsx’
import ChatInterface from ‘./ChatInterface.jsx’
import ReportsPanel from ‘./ReportsPanel.jsx’
import AlertsPanel from ‘./AlertsPanel.jsx’

function App() {
  const [currentView, setCurrentView] = useState('upload')
  const [data, setData] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadHistory, setUploadHistory] = useState([])

  const handleFile = useCallback((file) => {
    if (!file) return

    setIsLoading(true)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const dataArray = new Uint8Array(e.target.result)
        const workbook = XLSX.read(dataArray, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: '' })

        if (jsonData.length === 0) {
          alert('الملف فارغ أو غير صالح')
          setIsLoading(false)
          return
        }

        setData(jsonData)
        const analysisResult = analyzeFinancialData(jsonData)
        setAnalysis(analysisResult)

        setUploadHistory(prev => [
          { name: file.name, date: new Date().toLocaleDateString('ar-SA'), rows: jsonData.length },
          ...prev.slice(0, 4)
        ])

        setCurrentView('dashboard')
        setIsLoading(false)
      } catch (error) {
        console.error(error)
        alert('حدث خطأ في قراءة الملف. تأكد من صيغة Excel/CSV')
        setIsLoading(false)
      }
    }
    reader.readAsArrayBuffer(file)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
      handleFile(file)
    } else {
      alert('يرجى رفع ملف Excel (.xlsx, .xls) أو CSV')
    }
  }, [handleFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: BarChart3, active: currentView === 'dashboard' && data },
    { id: 'chat', label: 'المحادثة الذكية', icon: MessageSquare, active: currentView === 'chat' && data },
    { id: 'reports', label: 'التقارير', icon: FileText, active: currentView === 'reports' && data },
    { id: 'alerts', label: 'التنبيهات', icon: Bell, active: currentView === 'alerts' && data },
  ]

  const handleNavClick = (id) => {
    if (id === 'upload') {
      setCurrentView('upload')
    } else if (data) {
      setCurrentView(id)
    } else {
      alert('يرجى رفع ملف بيانات أولاً')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-cairo">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">BizBrain AI</h1>
                <p className="text-xs text-slate-500">ذكاء الأعمال المتقدم</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {data && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm rounded-lg font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {fileName}
                </span>
              )}
              <button 
                onClick={() => handleNavClick('upload')}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">رفع ملف جديد</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-24">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      item.active
                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'
                    } ${!data && item.id !== 'upload' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <item.icon className={`w-5 h-5 ${item.active ? 'text-primary-600' : 'text-slate-400'}`} />
                    {item.label}
                    {item.id === 'alerts' && analysis?.alerts?.length > 0 && (
                      <span className="mr-auto bg-danger text-white text-xs px-2 py-0.5 rounded-full">
                        {analysis.alerts.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {uploadHistory.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">سجل الرفع</h3>
                  <div className="space-y-2">
                    {uploadHistory.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-500 p-2 rounded-lg hover:bg-slate-50">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-primary-500" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{item.name}</p>
                          <p className="text-slate-400">{item.date} • {item.rows} صف</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {currentView === 'upload' && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-100 to-accent-100 mb-6">
                    <Sparkles className="w-10 h-10 text-primary-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">مرحباً بك في BizBrain AI</h2>
                  <p className="text-slate-500 text-lg max-w-xl mx-auto">
                    ارفع ملف Excel أو CSV من نظام ERP الخاص بك وسأقوم بتحليل بياناتك وتقديم رؤى تنفيذية قابلة للتنفيذ
                  </p>
                </div>

                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`drop-zone rounded-3xl p-12 text-center transition-all duration-300 ${
                    isDragging 
                      ? 'border-primary-500 bg-primary-50 scale-[1.02]' 
                      : 'bg-white border-slate-300 hover:border-primary-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isDragging ? 'bg-primary-500' : 'bg-slate-100'
                    }`}>
                      <Upload className={`w-10 h-10 transition-colors ${isDragging ? 'text-white' : 'text-slate-400'}`} />
                    </div>

                    <div>
                      <p className="text-lg font-semibold text-slate-700 mb-1">
                        {isDragging ? 'أفلت الملف هنا' : 'اسحب ملف Excel أو CSV هنا'}
                      </p>
                      <p className="text-sm text-slate-400">أو انقر لاختيار الملف</p>
                    </div>

                    <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      اختيار ملف
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>

                    <p className="text-xs text-slate-400 mt-2">
                      يدعم: .xlsx, .xls, .csv | الحد الأقصى: 10MB
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="grid sm:grid-cols-3 gap-4 mt-8">
                  {[
                    { icon: BarChart3, title: 'تحليل ذكي', desc: 'تحليل تلقائي للبيانات المالية والتشغيلية' },
                    { icon: MessageSquare, title: 'محادثة ذكية', desc: 'اسأل بالعربية واحصل على إجابات فورية' },
                    { icon: FileText, title: 'تقارير PDF', desc: 'تصدير تقارير احترافية بنقرة واحدة' },
                  ].map((feature, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 card-hover">
                      <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                        <feature.icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <h3 className="font-bold text-slate-800 mb-1">{feature.title}</h3>
                      <p className="text-sm text-slate-500">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Sample Data Info */}
                <div className="mt-8 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
                  <div className="flex items-start gap-4">
                    <Lightbulb className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-slate-800 mb-2">تنسيق البيانات المدعوم</h3>
                      <p className="text-sm text-slate-600 mb-3">
                        يدعم النظام ملفات Excel تحتوي على أعمدة مثل: الإيرادات، التكاليف، التاريخ، المنتج، العميل، الفرع، الكمية، الربح
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['الإيرادات', 'التكاليف', 'التاريخ', 'المنتج', 'العميل', 'الفرع', 'الكمية', 'الربح'].map((col) => (
                          <span key={col} className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-primary-700 border border-primary-200">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'dashboard' && data && analysis && (
              <Dashboard data={data} analysis={analysis} />
            )}

            {currentView === 'chat' && data && analysis && (
              <ChatInterface data={data} analysis={analysis} />
            )}

            {currentView === 'reports' && data && analysis && (
              <ReportsPanel data={data} analysis={analysis} />
            )}

            {currentView === 'alerts' && data && analysis && (
              <AlertsPanel alerts={analysis.alerts} />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App

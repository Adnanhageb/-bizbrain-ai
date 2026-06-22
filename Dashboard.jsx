import React, { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight, Brain } from 'lucide-react'
import { formatNumber } from '../utils/analysis'

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6']

function KPICard({ title, value, change, icon: Icon, color, subtitle }) {
  const isPositive = change >= 0
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: color + '15' }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <h3 className="text-sm text-slate-500 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  )
}

function InsightCard({ insight, index }) {
  const typeColors = {
    success: 'border-emerald-200 bg-emerald-50',
    warning: 'border-amber-200 bg-amber-50',
    danger: 'border-red-200 bg-red-50',
    info: 'border-blue-200 bg-blue-50',
  }

  const typeIcons = {
    success: CheckCircle,
    warning: AlertTriangle,
    danger: AlertTriangle,
    info: Brain,
  }

  const Icon = typeIcons[insight.type] || Brain

  return (
    <div className={`rounded-xl p-4 border ${typeColors[insight.type] || typeColors.info} animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
          insight.type === 'success' ? 'text-emerald-600' :
          insight.type === 'warning' ? 'text-amber-600' :
          insight.type === 'danger' ? 'text-red-600' : 'text-blue-600'
        }`} />
        <div>
          <h4 className="font-bold text-sm mb-1">{insight.title}</h4>
          <p className="text-sm text-slate-600 leading-relaxed">{insight.content}</p>
          {insight.isAction && (
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-1 bg-white rounded-lg text-xs font-semibold text-emerald-700 border border-emerald-200">
                أولوية: {insight.priority === 'high' ? 'عالية' : insight.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ data, analysis }) {
  const [activeTab, setActiveTab] = useState('overview')
  const { kpis, charts, insights } = analysis

  const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'products', label: 'المنتجات' },
    { id: 'customers', label: 'العملاء' },
    { id: 'branches', label: 'الفروع' },
  ]

  return (
    <div className="animate-fade-in space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="إجمالي الإيرادات"
          value={`${formatNumber(kpis.totalRevenue)} ريال`}
          change={12.5}
          icon={DollarSign}
          color="#0ea5e9"
          subtitle={`${kpis.transactionCount} معاملة`}
        />
        <KPICard
          title="إجمالي الأرباح"
          value={`${formatNumber(kpis.totalProfit)} ريال`}
          change={8.3}
          icon={TrendingUp}
          color="#10b981"
          subtitle={`هامش: ${kpis.profitMargin}%`}
        />
        <KPICard
          title="إجمالي التكاليف"
          value={`${formatNumber(kpis.totalCost)} ريال`}
          change={-3.2}
          icon={TrendingDown}
          color="#ef4444"
          subtitle={`نسبة: ${((kpis.totalCost/kpis.totalRevenue)*100).toFixed(1)}%`}
        />
        <KPICard
          title="متوسط قيمة الصفقة"
          value={`${formatNumber(kpis.avgOrderValue)} ريال`}
          change={5.7}
          icon={ShoppingCart}
          color="#8b5cf6"
          subtitle={`${formatNumber(kpis.totalQuantity)} وحدة`}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-1.5 border border-slate-200 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              اتجاه الإيرادات والأرباح
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={charts.trendData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(value) => formatNumber(value) + ' ريال'}
                />
                <Legend />
                <Area type="monotone" dataKey="إيرادات" stroke="#0ea5e9" fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="أرباح" stroke="#10b981" fill="url(#colorProfit)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue vs Cost */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary-500" />
              الإيرادات مقابل التكاليف
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts.revenueVsCost}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {charts.revenueVsCost.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(value) + ' ريال'} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary-500" />
            أفضل المنتجات أداءً
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={charts.topProducts} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#94a3b8" width={120} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                formatter={(value) => formatNumber(value) + ' ريال'}
              />
              <Bar dataKey="value" fill="#0ea5e9" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            أفضل العملاء
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={charts.topCustomers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                formatter={(value) => formatNumber(value) + ' ريال'}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'branches' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            أداء الفروع
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={charts.branchData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {charts.branchData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value) + ' ريال'} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Insights Section */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-primary-500" />
          الرؤى والتوصيات التنفيذية
        </h3>
        <div className="grid gap-4">
          {insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

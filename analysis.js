// Advanced data analysis utilities for BizBrain AI

export function analyzeFinancialData(data) {
  const headers = Object.keys(data[0] || {});

  // Detect columns
  const revenueCol = findColumn(headers, ['revenue', 'إيرادات', 'sales', 'مبيعات', 'amount', 'المبلغ', 'total', 'الإجمالي', 'قيمة', 'value']);
  const costCol = findColumn(headers, ['cost', 'تكلفة', 'expense', 'مصروفات', 'مصاريف', 'spend', 'انفاق']);
  const dateCol = findColumn(headers, ['date', 'تاريخ', 'day', 'يوم', 'month', 'شهر', 'year', 'سنة']);
  const productCol = findColumn(headers, ['product', 'منتج', 'item', 'صنف', 'name', 'الاسم', 'description', 'وصف']);
  const quantityCol = findColumn(headers, ['quantity', 'الكمية', 'qty', 'count', 'العدد', 'units', 'وحدات']);
  const profitCol = findColumn(headers, ['profit', 'ربح', 'margin', 'هامش', 'net', 'صافي']);
  const customerCol = findColumn(headers, ['customer', 'عميل', 'client', 'العميل', 'buyer', 'المشتري']);
  const branchCol = findColumn(headers, ['branch', 'فرع', 'location', 'موقع', 'store', 'متجر', 'warehouse', 'مستودع']);

  // Calculate KPIs
  const kpis = calculateKPIs(data, { revenueCol, costCol, profitCol, quantityCol, dateCol, productCol, customerCol, branchCol });

  // Generate charts data
  const charts = generateChartsData(data, { revenueCol, costCol, profitCol, dateCol, productCol, customerCol, branchCol, quantityCol });

  // Generate insights
  const insights = generateInsights(data, { revenueCol, costCol, profitCol, dateCol, productCol, customerCol, branchCol, quantityCol });

  // Generate alerts
  const alerts = generateAlerts(data, { revenueCol, costCol, profitCol, quantityCol, dateCol });

  return { kpis, charts, insights, alerts, headers, columns: { revenueCol, costCol, dateCol, productCol, quantityCol, profitCol, customerCol, branchCol } };
}

function findColumn(headers, keywords) {
  for (const keyword of keywords) {
    const found = headers.find(h => 
      h.toLowerCase().includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(h.toLowerCase())
    );
    if (found) return found;
  }
  return headers[0];
}

function calculateKPIs(data, cols) {
  const { revenueCol, costCol, profitCol, quantityCol } = cols;

  const totalRevenue = data.reduce((sum, row) => sum + (parseFloat(row[revenueCol]) || 0), 0);
  const totalCost = data.reduce((sum, row) => sum + (parseFloat(row[costCol]) || 0), 0);
  const totalProfit = profitCol 
    ? data.reduce((sum, row) => sum + (parseFloat(row[profitCol]) || 0), 0)
    : totalRevenue - totalCost;
  const totalQuantity = quantityCol
    ? data.reduce((sum, row) => sum + (parseFloat(row[quantityCol]) || 0), 0)
    : data.length;

  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0;
  const avgOrderValue = data.length > 0 ? totalRevenue / data.length : 0;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
    profitMargin: Math.round(profitMargin * 10) / 10,
    totalQuantity: Math.round(totalQuantity),
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    transactionCount: data.length,
  };
}

function generateChartsData(data, cols) {
  const { revenueCol, costCol, profitCol, dateCol, productCol, customerCol, branchCol, quantityCol } = cols;

  // Revenue trend by date
  const revenueByDate = {};
  const profitByDate = {};

  data.forEach(row => {
    const date = row[dateCol] || 'غير محدد';
    const revenue = parseFloat(row[revenueCol]) || 0;
    const cost = parseFloat(row[costCol]) || 0;
    const profit = profitCol ? (parseFloat(row[profitCol]) || 0) : (revenue - cost);

    revenueByDate[date] = (revenueByDate[date] || 0) + revenue;
    profitByDate[date] = (profitByDate[date] || 0) + profit;
  });

  const trendData = Object.keys(revenueByDate).map(date => ({
    name: String(date).slice(0, 10),
    إيرادات: Math.round(revenueByDate[date] * 100) / 100,
    أرباح: Math.round(profitByDate[date] * 100) / 100,
  })).slice(-12);

  // Top products
  const productRevenue = {};
  data.forEach(row => {
    const product = row[productCol] || 'غير محدد';
    const revenue = parseFloat(row[revenueCol]) || 0;
    productRevenue[product] = (productRevenue[product] || 0) + revenue;
  });

  const topProducts = Object.entries(productRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name: String(name).slice(0, 20), value: Math.round(value * 100) / 100 }));

  // Revenue vs Cost
  const revenueVsCost = [
    { name: 'الإيرادات', value: data.reduce((s, r) => s + (parseFloat(r[revenueCol]) || 0), 0) },
    { name: 'التكاليف', value: data.reduce((s, r) => s + (parseFloat(r[costCol]) || 0), 0) },
  ];

  // Top customers
  const customerRevenue = {};
  data.forEach(row => {
    const customer = row[customerCol] || 'غير محدد';
    const revenue = parseFloat(row[revenueCol]) || 0;
    customerRevenue[customer] = (customerRevenue[customer] || 0) + revenue;
  });

  const topCustomers = Object.entries(customerRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name: String(name).slice(0, 15), value: Math.round(value * 100) / 100 }));

  // Branch performance
  const branchRevenue = {};
  data.forEach(row => {
    const branch = row[branchCol] || 'الفرع الرئيسي';
    const revenue = parseFloat(row[revenueCol]) || 0;
    branchRevenue[branch] = (branchRevenue[branch] || 0) + revenue;
  });

  const branchData = Object.entries(branchRevenue)
    .map(([name, value]) => ({ name: String(name).slice(0, 15), value: Math.round(value * 100) / 100 }));

  return { trendData, topProducts, revenueVsCost, topCustomers, branchData };
}

function generateInsights(data, cols) {
  const { revenueCol, costCol, profitCol, productCol, customerCol, branchCol, quantityCol } = cols;
  const insights = [];

  // Revenue analysis
  const revenues = data.map(r => parseFloat(r[revenueCol]) || 0).filter(v => v > 0);
  const avgRevenue = revenues.reduce((a, b) => a + b, 0) / revenues.length;
  const maxRevenue = Math.max(...revenues);
  const minRevenue = Math.min(...revenues.filter(v => v > 0));

  insights.push({
    title: 'تحليل الإيرادات',
    content: `متوسط قيمة الصفقة: ${formatNumber(avgRevenue)} ريال. أعلى قيمة: ${formatNumber(maxRevenue)} ريال.`,
    type: 'info',
    priority: 'high',
  });

  // Top product
  if (productCol) {
    const productRevenue = {};
    data.forEach(row => {
      const p = row[productCol] || 'غير محدد';
      productRevenue[p] = (productRevenue[p] || 0) + (parseFloat(row[revenueCol]) || 0);
    });
    const topProduct = Object.entries(productRevenue).sort((a, b) => b[1] - a[1])[0];
    if (topProduct) {
      insights.push({
        title: 'المنتج الأفضل أداءً',
        content: `المنتج "${topProduct[0]}" حقق إيرادات بقيمة ${formatNumber(topProduct[1])} ريال.`,
        type: 'success',
        priority: 'high',
      });
    }
  }

  // Profitability
  const totalRev = data.reduce((s, r) => s + (parseFloat(r[revenueCol]) || 0), 0);
  const totalCost = data.reduce((s, r) => s + (parseFloat(r[costCol]) || 0), 0);
  const margin = totalRev > 0 ? ((totalRev - totalCost) / totalRev * 100) : 0;

  insights.push({
    title: 'هامش الربحية',
    content: `هامش الربحية الحالي ${margin.toFixed(1)}%. ${margin > 20 ? 'أداء ممتاز!' : margin > 10 ? 'أداء جيد يحتاج تحسين.' : 'هامش منخفض - يرجى مراجعة التكاليف.'}`,
    type: margin > 20 ? 'success' : margin > 10 ? 'warning' : 'danger',
    priority: 'high',
  });

  // Customer insights
  if (customerCol) {
    const uniqueCustomers = new Set(data.map(r => r[customerCol]).filter(Boolean)).size;
    insights.push({
      title: 'قاعدة العملاء',
      content: `عدد العملاء الفريدين: ${uniqueCustomers} عميل. متوسط الإيرادات لكل عميل: ${formatNumber(totalRev / uniqueCustomers)} ريال.`,
      type: 'info',
      priority: 'medium',
    });
  }

  // Actionable recommendations
  insights.push({
    title: 'توصية تنفيذية',
    content: generateRecommendation(margin, totalRev, totalCost),
    type: 'success',
    priority: 'high',
    isAction: true,
  });

  return insights;
}

function generateRecommendation(margin, revenue, cost) {
  if (margin < 15) {
    return '1. مراجعة قائمة الموردين والتفاوض على أسعار أفضل. 2. تقييم المنتجات الأقل ربحية وإعادة هيكلتها. 3. دراسة زيادة الأسعار على المنتجات ذات الطلب العالي. الأثر المتوقع: رفع الهامش 3-5%.';
  } else if (revenue < cost * 1.3) {
    return '1. زيادة حجم المبيعات عبر حملات تسويقية مستهدفة. 2. تطوير منتجات جديدة مكملة. 3. تحسين معدل تحويل العملاء. الأثر المتوقع: زيادة الإيرادات 15-20%.';
  } else {
    return '1. استثمار الأرباح في توسيع خطوط الإنتاج. 2. تطوير برنامج ولاء للعملاء. 3. دراسة فتح أفرع جديدة. الأثر المتوقع: نمو مستدام 10-15% سنوياً.';
  }
}

function generateAlerts(data, cols) {
  const { revenueCol, costCol, profitCol, quantityCol, dateCol } = cols;
  const alerts = [];

  const revenues = data.map(r => parseFloat(r[revenueCol]) || 0);
  const avgRevenue = revenues.reduce((a, b) => a + b, 0) / revenues.length;
  const lowRevenueCount = revenues.filter(r => r < avgRevenue * 0.5).length;

  if (lowRevenueCount > revenues.length * 0.3) {
    alerts.push({
      title: '⚠️ انخفاض في المبيعات',
      message: `${lowRevenueCount} صفقة ذات إيرادات منخفضة جداً مقارنة بالمتوسط. يُنصح بمراجعة استراتيجية التسعير.`,
      severity: 'warning',
    });
  }

  const totalRev = revenues.reduce((a, b) => a + b, 0);
  const totalCost = data.reduce((s, r) => s + (parseFloat(r[costCol]) || 0), 0);

  if (totalCost > totalRev * 0.85) {
    alerts.push({
      title: '🚨 نسبة التكاليف مرتفعة',
      message: `التكاليف تمثل ${((totalCost/totalRev)*100).toFixed(1)}% من الإيرادات. يجب اتخاذ إجراء فوري لخفض التكاليف.`,
      severity: 'danger',
    });
  }

  return alerts;
}

export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString('ar-SA');
}

export function generateChatResponse(question, data, analysis) {
  const q = question.toLowerCase();
  const { kpis, charts, columns } = analysis;

  if (q.includes('إيراد') || q.includes('مبيعات') || q.includes('revenue') || q.includes('sales')) {
    return `📊 إجمالي الإيرادات: ${formatNumber(kpis.totalRevenue)} ريال\n\n📈 متوسط قيمة الصفقة: ${formatNumber(kpis.avgOrderValue)} ريال\n\n🎯 عدد المعاملات: ${kpis.transactionCount}\n\nأعلى 3 منتجات من حيث الإيرادات:\n${charts.topProducts.slice(0, 3).map((p, i) => `${i + 1}. ${p.name}: ${formatNumber(p.value)} ريال`).join('\n')}`;
  }

  if (q.includes('ربح') || q.includes('هامش') || q.includes('profit') || q.includes('margin')) {
    return `💰 إجمالي الأرباح: ${formatNumber(kpis.totalProfit)} ريال\n\n📊 هامش الربحية: ${kpis.profitMargin}%\n\n💵 إجمالي التكاليف: ${formatNumber(kpis.totalCost)} ريال\n\n${kpis.profitMargin > 20 ? '✅ أداء ممتاز! الهامش أعلى من المتوسط الصناعي.' : kpis.profitMargin > 10 ? '⚠️ الهامش مقبول لكن يمكن تحسينه.' : '🚨 هامش منخفض - يحتاج مراجعة عاجلة للتكاليف.'}`;
  }

  if (q.includes('منتج') || q.includes('product') || q.includes('item')) {
    return `🏆 أفضل المنتجات أداءً:\n${charts.topProducts.slice(0, 5).map((p, i) => `${i + 1}. ${p.name}: ${formatNumber(p.value)} ريال`).join('\n')}\n\n💡 توصية: ركز على المنتجات الأعلى ربحية ودرس إمكانية إيقاف المنتجات الأقل أداءً.`;
  }

  if (q.includes('عميل') || q.includes('customer') || q.includes('client')) {
    return `👥 أفضل العملاء:\n${charts.topCustomers.slice(0, 5).map((c, i) => `${i + 1}. ${c.name}: ${formatNumber(c.value)} ريال`).join('\n')}\n\n💡 اقتراح: طور برنامج ولاء للعملاء الأعلى إنفاقاً لزيادة معدل الاحتفاظ.`;
  }

  if (q.includes('فرع') || q.includes('branch') || q.includes('store')) {
    return `🏢 أداء الفروع:\n${charts.branchData.map((b, i) => `${i + 1}. ${b.name}: ${formatNumber(b.value)} ريال`).join('\n')}\n\n📊 الفرع الأعلى أداءً هو: ${charts.branchData.sort((a, b) => b.value - a.value)[0]?.name || 'غير محدد'}`;
  }

  if (q.includes('مقارنة') || q.includes('compare') || q.includes('فرق')) {
    return `📊 مقارنة الإيرادات والتكاليف:\n\n• الإيرادات: ${formatNumber(kpis.totalRevenue)} ريال\n• التكاليف: ${formatNumber(kpis.totalCost)} ريال\n• الفرق (الربح): ${formatNumber(kpis.totalProfit)} ريال\n• نسبة التكلفة/الإيراد: ${((kpis.totalCost/kpis.totalRevenue)*100).toFixed(1)}%\n\n${kpis.totalProfit > 0 ? '✅ الشركة مربحة' : '🚨 الشركة تخسر - يرجى مراجعة الإنفاق فوراً.'}`;
  }

  if (q.includes('تحسين') || q.includes('توصية') || q.includes('recommend') || q.includes('improve')) {
    const analysis2 = analyzeFinancialData(data);
    const rec = analysis2.insights.find(i => i.isAction);
    return `💡 التوصيات التنفيذية:\n\n${rec ? rec.content : '1. راجع قائمة التكاليف وابحث عن فرص للتوفير. 2. حلل المنتجات الأقل ربحية. 3. طور استراتيجية لزيادة متوسط قيمة الصفقة.'}`;
  }

  return `🤖 مرحباً! أنا BizBrain AI، مساعدك الذكي لتحليل البيانات.\n\nيمكنني مساعدتك في:\n• تحليل الإيرادات والأرباح\n• تقييم أداء المنتجات والعملاء\n• مقارنة الفروع\n• تقديم توصيات تنفيذية\n\nما الذي تريد معرفته عن بياناتك؟`;
}

export function generatePDFReport(data, analysis) {
  // This would integrate with jsPDF in a real implementation
  // For now, return a structured report object
  return {
    title: 'تقرير تحليلي - BizBrain AI',
    date: new Date().toLocaleDateString('ar-SA'),
    kpis: analysis.kpis,
    insights: analysis.insights,
    summary: `تم تحليل ${data.length} سجل. إجمالي الإيرادات: ${formatNumber(analysis.kpis.totalRevenue)} ريال.`,
  };
}

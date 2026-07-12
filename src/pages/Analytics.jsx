import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GlassCard from "../components/ui/GlassCard";
import { mockApi } from "../services/mockApi";
import { useToast } from "../context/ToastContext";
import { fetchEvents } from "../features/events/eventsSlice";
import { fetchDashboardAnalytics, fetchEventAnalytics } from "../features/analytics/analyticsSlice";
import { 
  TrendingUp, 
  Download, 
  Eye, 
  Users, 
  Camera, 
  Zap, 
  Clock, 
  HardDrive,
  BarChart3,
  Calendar,
  Share2,
  ChevronDown
} from "lucide-react";
import { useAdaptive } from "../context/AdaptiveContext";
import EmptyState from "../components/ui/EmptyState";

export default function Analytics() {
  const { showToast } = useToast();
  const { isMobile } = useAdaptive();
  const dispatch = useDispatch();

  const events = useSelector((state) => state.events.items) || [];
  const workspaceStats = useSelector((state) => state.analytics.workspaceStats);
  const selectedEventAnalytics = useSelector((state) => state.analytics.selectedEventAnalytics);
  const loading = useSelector((state) => state.analytics.loading);

  const [selectedEventId, setSelectedEventId] = useState("all");

  useEffect(() => {
    dispatch(fetchDashboardAnalytics());
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (selectedEventId === "all") {
      dispatch(fetchDashboardAnalytics());
    } else {
      dispatch(fetchEventAnalytics(selectedEventId));
    }
  }, [selectedEventId, dispatch]);

  const stats = selectedEventId === "all" ? workspaceStats : (selectedEventAnalytics || workspaceStats);

  const exportToPdf = () => {
    if (!stats) return;
    showToast("PDF raporu hazırlanıyor...", "info");

    const dateStr = new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
    const eventLabel = selectedEventId === "all"
      ? "Tüm Etkinlikler"
      : (events.find(e => e.id === selectedEventId)?.title || selectedEventId);

    const kpiRows = [
      ["Toplam Fotoğraf", stats.totalPhotos || 0],
      ["Toplam Katılımcı", stats.totalParticipants || 0],
      ["AI Eşleşme Oranı", `%${stats.overallMatchRate || 0}`],
      ["İnceleme Bekleyen", stats.pendingReviews || 0],
      ["Toplam Etkinlik", stats.totalEvents || 0],
      ["Aktif Etkinlik", stats.activeEvents || 0],
      ["Disk Kullanımı", `${stats.storageUsedGB || 0} GB / ${stats.storageLimitGB || 100} GB`],
      ["Misafir Görüntüleme", "1.482"],
      ["Fotoğraf İndirme", "862"],
    ];

    const weekData = [
      ["Pazartesi", 60, 30], ["Salı", 80, 45], ["Çarşamba", 110, 70],
      ["Perşembe", 90, 55], ["Cuma", 140, 95], ["Cumartesi", 210, 150], ["Pazar", 180, 120],
    ];

    const kpiHtml = kpiRows.map(([l, v]) => `<tr><td>${l}</td><td>${v}</td></tr>`).join("");
    const weekHtml = weekData.map(([d, v, s]) => `<tr><td>${d}</td><td>${v}</td><td>${s}</td></tr>`).join("");

    const html = [
      "<!DOCTYPE html><html lang='tr'><head><meta charset='UTF-8'/>",
      `<title>SnapMatch Analitik Raporu — ${dateStr}</title>`,
      "<style>",
      "*{margin:0;padding:0;box-sizing:border-box;}",
      "body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1e293b;background:#fff;padding:32px 40px;font-size:13px;}",
      ".hdr{background:#1e3a8a;color:#fff;padding:18px 24px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;}",
      ".hdr h1{font-size:18px;font-weight:800;}",
      ".hdr span{font-size:11px;opacity:.8;}",
      ".sec{font-size:13px;font-weight:800;color:#1e3a8a;margin:22px 0 8px;border-left:4px solid #1e3a8a;padding-left:10px;}",
      "table{width:100%;border-collapse:collapse;margin-bottom:6px;}",
      "th{background:#1e3a8a;color:#fff;padding:8px 12px;text-align:left;font-size:11px;font-weight:700;}",
      "th:last-child{text-align:right;}",
      "td{padding:7px 12px;font-size:12px;border-bottom:1px solid #e2e8f0;}",
      "td:last-child{text-align:right;font-weight:700;color:#1e3a8a;}",
      "tr:nth-child(even) td{background:#f0f4ff;}",
      ".ai td:last-child{color:#059669;}",
      ".footer{margin-top:32px;text-align:center;font-size:10px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;}",
      "@media print{body{padding:20px 28px;}}",
      "</style></head><body>",
      `<div class='hdr'><h1>SnapMatch &mdash; Analitik Raporu</h1><span>${dateStr} &bull; ${eventLabel}</span></div>`,
      "<div class='sec'>Temel Göstergeler (KPI)</div>",
      "<table><thead><tr><th>Metrik</th><th>Değer</th></tr></thead><tbody>",
      kpiHtml,
      "</tbody></table>",
      "<div class='sec'>Haftalık Erişim ve Etkileşim Trafiği</div>",
      "<table><thead><tr><th>Gün</th><th>Sayfa Ziyareti</th><th>Selfie Kaydı</th></tr></thead><tbody>",
      weekHtml,
      "</tbody></table>",
      "<div class='sec'>AI Eşleşme Başarım Analizi</div>",
      "<table class='ai'><thead><tr><th>Metrik</th><th>Değer</th></tr></thead><tbody>",
      "<tr><td>Otomatik Onay Doğruluğu</td><td>%99.8</td></tr>",
      "<tr><td>Otomatik Onaylanan</td><td>%72</td></tr>",
      "<tr><td>Manuel İncelemeye Giden</td><td>%24</td></tr>",
      "<tr><td>Hatalı / Reddedilen</td><td>%4</td></tr>",
      "<tr><td>Ortalama İndirme / Misafir</td><td>3.4 adet</td></tr>",
      "<tr><td>Sitede Kalma Süresi</td><td>4 dk 12 sn</td></tr>",
      "</tbody></table>",
      `<div class='footer'>SnapMatch Analitik Raporu &mdash; ${dateStr} &mdash; Gizli ve Şirkete Özeldir</div>`,
      "</body></html>"
    ].join("");

    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) {
      showToast("Pop-up engellendi. Lütfen tarayıcı pop-up iznini açın.", "error");
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
    showToast("Yazdır penceresinde 'PDF olarak kaydet' seçin.", "success");
  };

  const exportToExcel = () => {
    if (!stats) return;
    showToast("Excel raporu hazırlanıyor...", "info");

    const dateStr = new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
    const eventLabel = selectedEventId === "all"
      ? "Tüm Etkinlikler"
      : (events.find(e => e.id === selectedEventId)?.title || selectedEventId);

    const cell = (val, type = "String", bold = false, bg = "") => {
      const styleId = bold ? (bg ? "s_hdr" : "s_bold") : "s_normal";
      return `<Cell ss:StyleID="${styleId}"><Data ss:Type="${type}">${val}</Data></Cell>`;
    };

    const hdrCell = (val) => `<Cell ss:StyleID="s_hdr"><Data ss:Type="String">${val}</Data></Cell>`;
    const boldCell = (val, type = "String") => `<Cell ss:StyleID="s_bold"><Data ss:Type="${type}">${val}</Data></Cell>`;
    const numCell = (val) => `<Cell ss:StyleID="s_num"><Data ss:Type="Number">${val}</Data></Cell>`;
    const normalCell = (val) => `<Cell ss:StyleID="s_normal"><Data ss:Type="String">${val}</Data></Cell>`;

    const kpiRows = [
      ["Toplam Fotoğraf", stats.totalPhotos || 0, "Number"],
      ["Toplam Katılımcı", stats.totalParticipants || 0, "Number"],
      ["AI Eşleşme Oranı (%)", stats.overallMatchRate || 0, "Number"],
      ["İnceleme Bekleyen", stats.pendingReviews || 0, "Number"],
      ["Toplam Etkinlik", stats.totalEvents || 0, "Number"],
      ["Aktif Etkinlik", stats.activeEvents || 0, "Number"],
      ["Disk Kullanımı (GB)", stats.storageUsedGB || 0, "Number"],
      ["Depolama Limiti (GB)", stats.storageLimitGB || 100, "Number"],
      ["Misafir Görüntüleme", 1482, "Number"],
      ["Fotoğraf İndirme", 862, "Number"],
    ];

    const weekData = [
      ["Pazartesi", 60, 30], ["Salı", 80, 45], ["Çarşamba", 110, 70],
      ["Perşembe", 90, 55], ["Cuma", 140, 95], ["Cumartesi", 210, 150], ["Pazar", 180, 120],
    ];

    const aiRows = [
      ["Otomatik Onay Doğruluğu (%)", 99.8],
      ["Otomatik Onaylanan (%)", 72],
      ["Manuel İncelemeye Giden (%)", 24],
      ["Hatalı / Reddedilen (%)", 4],
      ["Ortalama İndirme / Misafir", 3.4],
    ];

    const sheet1Rows = [
      `<Row><Cell ss:MergeAcross="1" ss:StyleID="s_title"><Data ss:Type="String">SnapMatch — Analitik Raporu</Data></Cell></Row>`,
      `<Row><Cell ss:StyleID="s_sub"><Data ss:Type="String">${dateStr} • ${eventLabel}</Data></Cell></Row>`,
      `<Row/>`,
      `<Row>${hdrCell("Metrik")}${hdrCell("Değer")}</Row>`,
      ...kpiRows.map(([l, v, t]) => `<Row>${normalCell(l)}${t === "Number" ? numCell(v) : normalCell(v)}</Row>`),
    ].join("\n");

    const sheet2Rows = [
      `<Row>${hdrCell("Gün")}${hdrCell("Sayfa Ziyareti")}${hdrCell("Selfie Kaydı")}</Row>`,
      ...weekData.map(([d, v, s]) => `<Row>${normalCell(d)}${numCell(v)}${numCell(s)}</Row>`),
    ].join("\n");

    const sheet3Rows = [
      `<Row>${hdrCell("AI Metriği")}${hdrCell("Değer (%)")}</Row>`,
      ...aiRows.map(([l, v]) => `<Row>${normalCell(l)}${numCell(v)}</Row>`),
    ].join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:x="urn:schemas-microsoft-com:office:excel">
  <Styles>
    <Style ss:ID="s_title">
      <Font ss:Bold="1" ss:Size="14" ss:Color="#1e3a8a"/>
      <Alignment ss:Horizontal="Left"/>
    </Style>
    <Style ss:ID="s_sub">
      <Font ss:Size="10" ss:Color="#64748b" ss:Italic="1"/>
    </Style>
    <Style ss:ID="s_hdr">
      <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="11"/>
      <Interior ss:Color="#1e3a8a" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Left"/>
      <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FFFFFF"/></Borders>
    </Style>
    <Style ss:ID="s_bold">
      <Font ss:Bold="1" ss:Color="#1e3a8a"/>
    </Style>
    <Style ss:ID="s_num">
      <NumberFormat ss:Format="#,##0.##"/>
      <Font ss:Color="#1e3a8a" ss:Bold="1"/>
    </Style>
    <Style ss:ID="s_normal">
      <Font ss:Color="#1e293b"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Temel Göstergeler">
    <Table ss:DefaultColumnWidth="180">
      ${sheet1Rows}
    </Table>
  </Worksheet>
  <Worksheet ss:Name="Haftalık Trafik">
    <Table ss:DefaultColumnWidth="130">
      ${sheet2Rows}
    </Table>
  </Worksheet>
  <Worksheet ss:Name="AI Analizi">
    <Table ss:DefaultColumnWidth="200">
      ${sheet3Rows}
    </Table>
  </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `snapmatch-analitik-${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("Excel raporu başarıyla indirildi.", "success");
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-xs font-bold">Analiz verileri yükleniyor...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-10">
        <EmptyState
          icon={BarChart3}
          title="Bu dönem için veri yok"
          description="Seçilen aralığa ait analiz verisi mevcut değil."
        />
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 pt-2 pb-16">
        {/* Event Selector Dropdown */}
        <div className="glass-panel p-4 flex flex-col gap-2">
          <label className="text-[10px] font-extrabold text-[var(--color-blue-dark)] uppercase tracking-widest flex items-center gap-1.5">
            <Calendar size={11} />
            Etkinlik Filtresi
          </label>
          <div className="relative">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full p-3 pl-4 pr-9 rounded-xl border-2 border-[var(--color-blue-dark)]/40 bg-[var(--glass-bg-strong)] text-sm font-semibold text-[var(--text-main)] outline-none cursor-pointer focus:border-[var(--color-blue-dark)] transition-all appearance-none shadow-sm"
            >
              <option value="all" className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">Tüm Etkinlikler (Genel)</option>
              {events.map(e => (
                <option key={e.id} value={e.id} className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">{e.title}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-blue-dark)] pointer-events-none" />
          </div>
        </div>

        {/* KPI metrics list */}
        <div className="flex flex-col gap-3">
          <div className="glass-panel p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase tracking-wider">Toplam Fotoğraf</span>
              <h2 className="text-xl font-extrabold m-0 text-[var(--text-main)] mt-1">{stats.totalPhotos}</h2>
            </div>
            <Camera size={18} className="text-[var(--color-blue-dark)]" />
          </div>

          <div className="glass-panel p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase tracking-wider">Toplam Katılımcı</span>
              <h2 className="text-xl font-extrabold m-0 text-[var(--text-main)] mt-1">{stats.totalParticipants}</h2>
            </div>
            <Users size={18} className="text-[var(--color-blue-dark)]" />
          </div>

          <div className="glass-panel p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase tracking-wider">AI Başarı Oranı</span>
              <h2 className="text-xl font-extrabold m-0 text-[var(--accent-green)] mt-1">%{stats.overallMatchRate}</h2>
            </div>
            <Zap size={18} className="text-[var(--accent-green)]" />
          </div>
        </div>

        {/* Simplified custom chart representation */}
        <div className="glass-panel p-4 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-[var(--text-main)] m-0">Haftalık Yükleme Dağılımı</h4>
          <div className="flex items-end justify-between h-32 pt-4 px-2">
            {[45, 62, 85, 55, 90, 70, 110].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                <div 
                  className="w-4 rounded-t-md bg-gradient-to-t from-blue-500 to-indigo-600"
                  style={{ height: `${(val / 120) * 100}%` }}
                />
                <span className="text-[9px] text-[var(--text-muted)] font-bold">G{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reports Download Actions */}
        <div className="glass-panel p-4 flex flex-col gap-2.5">
          <h4 className="text-xs font-bold text-[var(--text-main)] m-0 mb-1">Rapor Çıktıları</h4>
          <button 
            className="primary-btn w-full py-2.5 text-xs font-bold justify-center rounded-xl"
            onClick={exportToExcel}
          >
            <Download size={14} />
            <span>Excel (.xls) İndir</span>
          </button>
          
          <button 
            className="secondary-btn w-full py-2.5 text-xs font-bold justify-center rounded-xl"
            onClick={exportToPdf}
          >
            <Download size={14} />
            <span>PDF Raporu İndir</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      {/* Header */}
      <div className="flex justify-end items-center mb-1">
        
        <div className="flex gap-2 items-center">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-extrabold text-[var(--color-blue-dark)] uppercase tracking-widest flex items-center gap-1.5">
              <Calendar size={11} />
              Etkinlik Filtresi
            </label>
            <div className="relative">
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="pl-4 pr-9 py-[10px] rounded-[12px] border-2 border-[var(--color-blue-dark)]/40 bg-[var(--glass-bg-strong)] text-[0.88rem] font-semibold text-[var(--text-main)] outline-none cursor-pointer focus:border-[var(--color-blue-dark)] hover:border-[var(--color-blue-dark)]/70 transition-all appearance-none shadow-sm min-w-[220px]"
              >
                <option value="all" className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">Tüm Etkinlikler (Genel)</option>
                {events.map(e => (
                  <option key={e.id} value={e.id} className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">{e.title}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-blue-dark)] pointer-events-none" />
            </div>
          </div>

          <button className="primary-btn p-[10px_16px] gap-1.5 font-bold cursor-pointer" onClick={exportToExcel}>
            <Download size={14} /> Excel (.xls) İndir
          </button>
          <button 
            className="primary-btn p-[10px_16px] gap-1.5 font-bold cursor-pointer" 
            onClick={exportToPdf}
          >
            <Download size={14} /> PDF Raporu
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[var(--space-lg)]">
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <small className="kpi-label block">Toplam Fotoğraf</small>
              <strong className="kpi-value text-[1.4rem]">{stats.totalPhotos}</strong>
            </div>
            <Camera size={20} className="text-[var(--color-blue-dark)]" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <small className="kpi-label block">Toplam Katılımcı</small>
              <strong className="kpi-value text-[1.4rem]">{stats.totalParticipants}</strong>
            </div>
            <Users size={20} className="text-[var(--color-blue-dark)]" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <small className="kpi-label block">AI Eşleşme Oranı</small>
              <strong className="kpi-value text-[1.4rem] text-[var(--accent-green)]">%{stats.overallMatchRate}</strong>
            </div>
            <Zap size={20} className="text-[var(--accent-green)]" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <small className="kpi-label block">Misafir Görüntüleme</small>
              <strong className="kpi-value text-[1.4rem]">1,482</strong>
            </div>
            <Eye size={20} className="text-[var(--color-blue-dark)]" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <small className="kpi-label block">Fotoğraf İndirme</small>
              <strong className="kpi-value text-[1.4rem]">862</strong>
            </div>
            <Download size={20} className="text-[var(--color-blue-dark)]" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <small className="kpi-label block">Disk Kullanımı</small>
              <strong className="kpi-value text-[1.4rem]">{stats.storageUsedGB} GB</strong>
            </div>
            <HardDrive size={20} className="text-[var(--color-blue-dark)]" />
          </div>
        </GlassCard>
      </div>

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1.2fr] gap-[var(--space-lg)]">
        
        {/* Weekly View Performance (SVG chart mockup) */}
        <GlassCard title="Haftalık Erişim ve Etkileşim Trafiği" className="glass-panel">
          <div className="py-2.5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4 text-[0.82rem]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--color-blue-dark)]" />
                  Sayfa Ziyareti
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--color-blue-soft)]" />
                  Selfie Kaydı
                </span>
              </div>
              <span className="text-[0.78rem] text-[var(--accent-green)] font-bold">+28% geçen haftaya göre</span>
            </div>

            {/* Bar chart — heights normalized to max value */}
            {(() => {
              const chartData = [
                { label: "Pzt", visit: 60, selfie: 30 },
                { label: "Sal", visit: 80, selfie: 45 },
                { label: "Çar", visit: 110, selfie: 70 },
                { label: "Per", visit: 90, selfie: 55 },
                { label: "Cum", visit: 140, selfie: 95 },
                { label: "Cmt", visit: 210, selfie: 150 },
                { label: "Paz", visit: 180, selfie: 120 }
              ];
              const maxVal = Math.max(...chartData.map(d => Math.max(d.visit, d.selfie)));
              return (
                <div className="flex items-end gap-3 border-b border-[var(--glass-border)] pb-3" style={{ height: 180 }}>
                  {chartData.map((day, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-0 h-full">
                      <div className="w-full flex-1 flex items-end justify-center gap-[3px]">
                        <div
                          style={{ height: `${(day.visit / maxVal) * 100}%` }}
                          className="flex-1 max-w-[18px] bg-[var(--color-blue-dark)] rounded-t-[4px] transition-all duration-300"
                        />
                        <div
                          style={{ height: `${(day.selfie / maxVal) * 100}%` }}
                          className="flex-1 max-w-[18px] bg-[var(--color-blue-soft)] rounded-t-[4px] transition-all duration-300"
                        />
                      </div>
                      <span className="text-[0.72rem] text-[var(--text-muted)] font-semibold mt-2 leading-none">{day.label}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </GlassCard>

        {/* AI Classifier breakdown card */}
        <div className="flex flex-col gap-[var(--space-lg)]">
          <GlassCard title="AI Eşleşme Başarım Analizi" className="glass-panel">
            <div className="flex flex-col gap-4.5">
              <div className="flex justify-between items-center">
                <span className="text-[0.85rem] text-[var(--text-muted)]">Otomatik Karar Doğruluğu</span>
                <strong className="text-[1.1rem] text-[var(--accent-green)]">%99.8</strong>
              </div>

              {/* Progress bars */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[0.8rem]">
                  <span>Otomatik Onaylanan (Auto Approved)</span>
                  <strong>%72</strong>
                </div>
                <div className="h-2 bg-[var(--glass-border)] rounded-full overflow-hidden">
                  <div className="h-full w-[72%] bg-[var(--accent-gradient)]" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[0.8rem]">
                  <span>Manuel İncelemeye Giden (Pending Review)</span>
                  <strong>%24</strong>
                </div>
                <div className="h-2 bg-[var(--glass-border)] rounded-full overflow-hidden">
                  <div className="h-full w-[24%] bg-amber-500" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[0.8rem]">
                  <span>Hatalı / Reddedilen (Rejected)</span>
                  <strong>%4</strong>
                </div>
                <div className="h-2 bg-[var(--glass-border)] rounded-full overflow-hidden">
                  <div className="h-full w-[4%] bg-red-500" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Social shares and engagement metrics */}
          <GlassCard title="Katılımcı Etkileşim Oranları" className="glass-panel">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-[0.85rem]">
                <div className="flex items-center gap-2">
                  <Share2 size={16} className="text-[var(--color-blue-dark)]" />
                  <span>Ortalama İndirme/Misafir:</span>
                </div>
                <strong>3.4 adet</strong>
              </div>
              
              <div className="flex items-center justify-between text-[0.85rem] border-t border-[var(--glass-border)] pt-2.5">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[var(--color-blue-dark)]" />
                  <span>Sitede Kalma Süresi:</span>
                </div>
                <strong>4 dk 12 sn</strong>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

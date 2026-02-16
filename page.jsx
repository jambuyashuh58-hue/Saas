'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   GARAGEFLOW PRO — Multi-Tenant Garage Door Service SaaS (Turkey)
   ● Navy Blue Theme
   ● 3 Portals: Customer | Service Provider | Admin
   ● Dynamic CRUD: Add/Edit/Delete jobs, customers, invoices
   ● Full TR/EN Bilingual
   ● SEO-Optimized Meta & Schema
   ═══════════════════════════════════════════════════════════════ */

// ── SEO Component (injects meta tags into <head>) ──
function SEOHead() {
  useEffect(() => {
    const metas = [
      {name:"description",content:"GarageFlow — Turkey's #1 garage door service management SaaS. CRM, job tracking, invoicing, technician dispatch & revenue analytics for garaj kapısı servisi. Türkiye'nin 1 numaralı garaj kapısı servis yönetim yazılımı."},
      {name:"keywords",content:"garage door service software, garaj kapısı servis yazılımı, garage door CRM Turkey, garaj kapısı takip sistemi, servis yönetim programı, garage door repair software, otomatik kapı servis, seksiyonel kapı bakım, teknisyen takip, fatura takip, iş takibi kanban, garage door business management, Türkiye garaj kapısı, İstanbul garaj servisi, Ankara garaj kapısı tamiri, İzmir otomatik kapı, garage door installation software, garage door maintenance app, SaaS Turkey, field service management Turkey, saha servis yönetimi, müşteri ilişkileri yönetimi CRM, garaj kapısı motor tamiri, yay tamiri yazılımı, panel değişimi takip, acil garaj kapısı servisi, garage door spring repair, garage door opener repair, sectional door service, rolling door maintenance, industrial door service software, endüstriyel kapı servis, kepenk tamiri, garaj kapısı kumanda programlama, remote control setup garage door"},
      {name:"robots",content:"index, follow, max-snippet:-1, max-image-preview:large"},
      {name:"author",content:"GarageFlow - Garage Door Service Management Platform"},
      {name:"geo.region",content:"TR"},
      {name:"geo.placename",content:"Turkey"},
      {name:"language",content:"Turkish, English"},
      {property:"og:title",content:"GarageFlow — Garage Door Service Management SaaS | Garaj Kapısı Servis Yönetimi"},
      {property:"og:description",content:"Complete SaaS platform for garage door service businesses in Turkey. CRM, Kanban job tracking, technician GPS dispatch, automated invoicing & revenue analytics."},
      {property:"og:type",content:"website"},
      {property:"og:locale",content:"tr_TR"},
      {property:"og:locale:alternate",content:"en_US"},
      {property:"og:site_name",content:"GarageFlow"},
      {name:"twitter:card",content:"summary_large_image"},
      {name:"twitter:title",content:"GarageFlow — #1 Garage Door Service Software in Turkey"},
      {name:"twitter:description",content:"Manage your garage door business with CRM, job tracking, invoicing & technician dispatch. Start free trial today!"},
    ];
    const created = [];
    metas.forEach(m => {
      const el = document.createElement("meta");
      if(m.name) el.setAttribute("name", m.name);
      if(m.property) el.setAttribute("property", m.property);
      el.setAttribute("content", m.content);
      document.head.appendChild(el);
      created.push(el);
    });
    // Schema.org structured data
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context":"https://schema.org","@type":"SoftwareApplication",
      name:"GarageFlow",applicationCategory:"BusinessApplication",
      operatingSystem:"Web",offers:{"@type":"Offer",price:"799",priceCurrency:"TRY"},
      description:"Turkey's leading garage door service management platform with CRM, job tracking, invoicing, and technician dispatch.",
      aggregateRating:{"@type":"AggregateRating",ratingValue:"4.8",ratingCount:"342"},
      author:{"@type":"Organization",name:"GarageFlow",address:{"@type":"PostalAddress",addressCountry:"TR"}}
    });
    document.head.appendChild(schema);
    created.push(schema);
    document.title = "GarageFlow — Garage Door Service Management | Garaj Kapısı Servis Yönetimi";
    return () => created.forEach(el => el.remove());
  }, []);
  return null;
}

// ── Language Translations ──
const LangCtx = createContext();
const useLang = () => useContext(LangCtx);
const TR = {
  // Portal
  selectPortal:"Portal Seçin",customerPortal:"Müşteri Portalı",providerPortal:"Servis Sağlayıcı",adminPortal:"Yönetici Paneli",
  custDesc:"Servis talep edin, geçmişinizi görüntüleyin",provDesc:"İşlerinizi, ekibinizi ve gelirinizi yönetin",adminDesc:"Tüm servis sağlayıcılarını takip edin",
  login:"Giriş Yap",email:"E-posta",password:"Şifre",welcome:"Hoş Geldiniz",logout:"Çıkış",back:"Geri",
  // Common
  dashboard:"Gösterge Paneli",crm:"Müşteri İlişkileri",invoices:"Faturalar",jobs:"İş Takibi",technicians:"Teknisyenler",
  locations:"Konum Matrisi",pricing:"Fiyatlandırma",revenue:"Gelir Takibi",subscription:"Abonelik",search:"Ara...",
  totalRevenue:"Toplam Gelir",activeJobs:"Aktif İşler",techsOnField:"Sahadaki Teknisyenler",customerSatisfaction:"Müşteri Memnuniyeti",
  todaySchedule:"Bugünün Programı",recentActivity:"Son Aktiviteler",newCustomer:"Yeni Müşteri",allCustomers:"Tüm Müşteriler",
  name:"İsim",phone:"Telefon",address:"Adres",serviceHistory:"Servis Geçmişi",lastService:"Son Servis",
  status:"Durum",active:"Aktif",inactive:"Pasif",pending:"Beklemede",completed:"Tamamlandı",inProgress:"Devam Ediyor",
  paid:"Ödendi",unpaid:"Ödenmedi",overdue:"Gecikmiş",invoiceNo:"Fatura No",amount:"Tutar",date:"Tarih",dueDate:"Son Ödeme",
  createInvoice:"Fatura Oluştur",todo:"Yapılacak",doing:"Yapılıyor",done:"Tamamlandı",priority:"Öncelik",
  high:"Yüksek",medium:"Orta",low:"Düşük",jobsCompleted:"Tamamlanan İş",avgRating:"Ort. Puan",
  available:"Müsait",onJob:"İşte",offDuty:"İzinli",coverage:"Kapsam",techCount:"Teknisyen Sayısı",avgResponse:"Ort. Yanıt",
  serviceName:"Hizmet Adı",basePrice:"Taban Fiyat",daily:"Günlük",monthly:"Aylık",annual:"Yıllık",earnings:"Kazanç",growth:"Büyüme",
  starter:"Başlangıç",professional:"Profesyonel",enterprise:"Kurumsal",perMonth:"/ ay",subscribe:"Abone Ol",
  viewAll:"Tümünü Gör",filter:"Filtrele",export:"Dışa Aktar",save:"Kaydet",cancel:"İptal",edit:"Düzenle",add:"Ekle",close:"Kapat",
  notifications:"Bildirimler",live:"Canlı",all:"Tümü",service:"Hizmet",technician:"Teknisyen",action:"İşlem",
  remind:"Hatırlat",call:"Ara",newJob:"Yeni İş",unassigned:"Atanmadı",
  // Forms
  addJob:"İş Ekle",jobTitle:"İş Başlığı",customer:"Müşteri",selectCustomer:"Müşteri Seçin",selectPriority:"Öncelik Seçin",
  selectTech:"Teknisyen Seçin",addCustomer:"Müşteri Ekle",required:"Zorunlu alan",success:"Başarılı!",
  jobAdded:"Yeni iş başarıyla eklendi",custAdded:"Yeni müşteri eklendi",invAdded:"Fatura oluşturuldu",
  // Customer portal
  requestService:"Servis Talep Et",myServices:"Servislerim",myInvoices:"Faturalarım",serviceType:"Servis Tipi",
  description:"Açıklama",submit:"Gönder",trackOrder:"Sipariş Takibi",payNow:"Şimdi Öde",
  springRepair:"Yay Tamiri",motorRepair:"Motor Tamiri",panelReplace:"Panel Değişimi",remoteSetup:"Kumanda Ayarı",
  fullService:"Komple Bakım",inspection:"Kontrol",installation:"Montaj",emergency:"Acil Servis",
  repair:"Tamir",maintenance:"Bakım",
  // Admin
  providers:"Servis Sağlayıcılar",totalProviders:"Toplam Sağlayıcı",totalCustomersAll:"Toplam Müşteri",
  platformRevenue:"Platform Geliri",activeSubscriptions:"Aktif Abonelik",providerName:"Firma Adı",
  plan:"Plan",joinDate:"Katılım Tarihi",monthlyRev:"Aylık Gelir",providerJobs:"Toplam İş",
  providerDetail:"Sağlayıcı Detayı",suspendAccount:"Hesabı Askıya Al",
  // Zones
  dispatchRec:"Sevk Önerileri",
  // Pricing
  repairServices:"Tamir Hizmetleri",maintenanceServices:"Bakım Hizmetleri",installServices:"Montaj Hizmetleri",
  emergencyServices:"Acil Servis",newService:"Yeni Hizmet",editPrices:"Fiyatları düzenleyin ve paketler oluşturun.",
  createPkg:"Paket Oluştur",basicPkg:"Temel Bakım Paketi",premiumPkg:"Premium Bakım",annualPkg:"Yıllık Sözleşme",
  // Revenue
  revenueChart:"Gelir Grafiği",byService:"Hizmet Bazlı",byZone:"Bölge Bazlı",
  // Subscription
  choosePlan:"Planınızı Seçin",trialInfo:"14 gün ücretsiz deneme. Kredi kartı gerekmez.",selected:"Seçili",
  faq:"Sık Sorulan Sorular",
  faq1q:"Plan değişikliği yapabilir miyim?",faq1a:"Evet, istediğiniz zaman yükseltme veya düşürme yapabilirsiniz.",
  faq2q:"Ücretsiz deneme nasıl çalışır?",faq2a:"14 gün boyunca tüm özellikleri ücretsiz kullanabilirsiniz.",
  faq3q:"İptal politikası nedir?",faq3a:"İstediğiniz zaman iptal edebilirsiniz.",
  serviceRequested:"Servis talebiniz alındı!",
};
const EN = {
  selectPortal:"Select Portal",customerPortal:"Customer Portal",providerPortal:"Service Provider",adminPortal:"Admin Panel",
  custDesc:"Request service, view your history",provDesc:"Manage jobs, team & revenue",adminDesc:"Track all service providers",
  login:"Log In",email:"Email",password:"Password",welcome:"Welcome",logout:"Logout",back:"Back",
  dashboard:"Dashboard",crm:"CRM",invoices:"Invoices",jobs:"Job Tracking",technicians:"Technicians",
  locations:"Location Matrix",pricing:"Pricing",revenue:"Revenue",subscription:"Subscription",search:"Search...",
  totalRevenue:"Total Revenue",activeJobs:"Active Jobs",techsOnField:"Techs on Field",customerSatisfaction:"Customer Satisfaction",
  todaySchedule:"Today's Schedule",recentActivity:"Recent Activity",newCustomer:"New Customer",allCustomers:"All Customers",
  name:"Name",phone:"Phone",address:"Address",serviceHistory:"Service History",lastService:"Last Service",
  status:"Status",active:"Active",inactive:"Inactive",pending:"Pending",completed:"Completed",inProgress:"In Progress",
  paid:"Paid",unpaid:"Unpaid",overdue:"Overdue",invoiceNo:"Invoice #",amount:"Amount",date:"Date",dueDate:"Due Date",
  createInvoice:"Create Invoice",todo:"To Do",doing:"In Progress",done:"Done",priority:"Priority",
  high:"High",medium:"Medium",low:"Low",jobsCompleted:"Jobs Done",avgRating:"Avg. Rating",
  available:"Available",onJob:"On Job",offDuty:"Off Duty",coverage:"Coverage",techCount:"Tech Count",avgResponse:"Avg. Response",
  serviceName:"Service Name",basePrice:"Base Price",daily:"Daily",monthly:"Monthly",annual:"Annual",earnings:"Earnings",growth:"Growth",
  starter:"Starter",professional:"Professional",enterprise:"Enterprise",perMonth:"/ mo",subscribe:"Subscribe",
  viewAll:"View All",filter:"Filter",export:"Export",save:"Save",cancel:"Cancel",edit:"Edit",add:"Add",close:"Close",
  notifications:"Notifications",live:"Live",all:"All",service:"Service",technician:"Technician",action:"Action",
  remind:"Remind",call:"Call",newJob:"New Job",unassigned:"Unassigned",
  addJob:"Add Job",jobTitle:"Job Title",customer:"Customer",selectCustomer:"Select Customer",selectPriority:"Select Priority",
  selectTech:"Select Tech",addCustomer:"Add Customer",required:"Required",success:"Success!",
  jobAdded:"New job added successfully",custAdded:"New customer added",invAdded:"Invoice created",
  requestService:"Request Service",myServices:"My Services",myInvoices:"My Invoices",serviceType:"Service Type",
  description:"Description",submit:"Submit",trackOrder:"Track Order",payNow:"Pay Now",
  springRepair:"Spring Repair",motorRepair:"Motor Repair",panelReplace:"Panel Replace",remoteSetup:"Remote Setup",
  fullService:"Full Service",inspection:"Inspection",installation:"Installation",emergency:"Emergency",
  repair:"Repair",maintenance:"Maintenance",
  providers:"Providers",totalProviders:"Total Providers",totalCustomersAll:"Total Customers",
  platformRevenue:"Platform Revenue",activeSubscriptions:"Active Subscriptions",providerName:"Company Name",
  plan:"Plan",joinDate:"Join Date",monthlyRev:"Monthly Rev",providerJobs:"Total Jobs",
  providerDetail:"Provider Detail",suspendAccount:"Suspend Account",
  dispatchRec:"Dispatch Recommendations",
  repairServices:"Repair Services",maintenanceServices:"Maintenance Services",installServices:"Installation Services",
  emergencyServices:"Emergency Services",newService:"New Service",editPrices:"Edit prices and create packages.",
  createPkg:"Create Package",basicPkg:"Basic Maintenance",premiumPkg:"Premium Service",annualPkg:"Annual Contract",
  revenueChart:"Revenue Chart",byService:"By Service",byZone:"By Zone",
  choosePlan:"Choose Your Plan",trialInfo:"14-day free trial. No credit card required.",selected:"Selected",
  faq:"FAQ",faq1q:"Can I change plans?",faq1a:"Yes, upgrade or downgrade anytime.",
  faq2q:"How does the trial work?",faq2a:"Use all features free for 14 days.",
  faq3q:"Cancellation policy?",faq3a:"Cancel anytime with prorated refund.",
  serviceRequested:"Service request submitted!",
};

// ── Initial Mock Data (mutable via state) ──
const initCustomers = [
  {id:1,name:"Mehmet Yılmaz",phone:"+90 532 111 2233",email:"mehmet@email.com",address:"Kadıköy, İstanbul",services:8,lastService:"2026-02-10",status:"active",rating:4.8},
  {id:2,name:"Ayşe Kaya",phone:"+90 535 444 5566",email:"ayse@email.com",address:"Beşiktaş, İstanbul",services:3,lastService:"2026-02-08",status:"active",rating:4.5},
  {id:3,name:"Ali Demir",phone:"+90 542 777 8899",email:"ali@email.com",address:"Çankaya, Ankara",services:12,lastService:"2026-01-28",status:"active",rating:4.9},
  {id:4,name:"Fatma Öztürk",phone:"+90 538 222 3344",email:"fatma@email.com",address:"Bornova, İzmir",services:1,lastService:"2026-02-12",status:"pending",rating:0},
  {id:5,name:"Hasan Çelik",phone:"+90 541 666 7788",email:"hasan@email.com",address:"Nilüfer, Bursa",services:5,lastService:"2026-01-15",status:"inactive",rating:4.2},
  {id:6,name:"Zeynep Arslan",phone:"+90 533 999 0011",email:"zeynep@email.com",address:"Muratpaşa, Antalya",services:7,lastService:"2026-02-13",status:"active",rating:4.7},
];
const initInvoices = [
  {id:"FTR-001",customer:"Mehmet Yılmaz",amount:4500,date:"2026-02-10",dueDate:"2026-02-24",status:"paid",items:["Motor Tamiri"]},
  {id:"FTR-002",customer:"Ayşe Kaya",amount:2800,date:"2026-02-08",dueDate:"2026-02-22",status:"unpaid",items:["Panel Değişimi"]},
  {id:"FTR-003",customer:"Ali Demir",amount:8500,date:"2026-01-28",dueDate:"2026-02-11",status:"overdue",items:["Komple Montaj"]},
  {id:"FTR-004",customer:"Fatma Öztürk",amount:1200,date:"2026-02-12",dueDate:"2026-02-26",status:"unpaid",items:["Kumanda Ayarı"]},
  {id:"FTR-005",customer:"Zeynep Arslan",amount:3500,date:"2026-02-13",dueDate:"2026-02-27",status:"paid",items:["Bakım"]},
];
const initJobs = {
  todo:[
    {id:"J-101",title:"Yay Tamiri",customer:"Fatma Öztürk",address:"Bornova, İzmir",priority:"high",tech:"",date:"2026-02-15"},
    {id:"J-102",title:"Motor Değişimi",customer:"Hasan Çelik",address:"Nilüfer, Bursa",priority:"medium",tech:"",date:"2026-02-16"},
  ],
  doing:[
    {id:"J-098",title:"Panel Montajı",customer:"Ayşe Kaya",address:"Beşiktaş, İstanbul",priority:"high",tech:"Burak Aydın",date:"2026-02-14"},
    {id:"J-099",title:"Kumanda Programlama",customer:"Mehmet Yılmaz",address:"Kadıköy, İstanbul",priority:"low",tech:"Emre Koç",date:"2026-02-14"},
  ],
  done:[
    {id:"J-095",title:"Komple Bakım",customer:"Zeynep Arslan",address:"Antalya",priority:"medium",tech:"Can Şahin",date:"2026-02-13"},
    {id:"J-096",title:"Acil Yay Tamiri",customer:"Ali Demir",address:"Ankara",priority:"high",tech:"Burak Aydın",date:"2026-02-13"},
  ],
};
const techsList = [
  {id:1,name:"Burak Aydın",status:"onJob",zone:"İstanbul Anadolu",jobs:156,rating:4.8,ini:"BA"},
  {id:2,name:"Emre Koç",status:"onJob",zone:"İstanbul Avrupa",jobs:132,rating:4.6,ini:"EK"},
  {id:3,name:"Can Şahin",status:"available",zone:"Ankara",jobs:98,rating:4.9,ini:"CŞ"},
  {id:4,name:"Deniz Yıldız",status:"available",zone:"İzmir",jobs:87,rating:4.5,ini:"DY"},
  {id:5,name:"Oğuz Kılıç",status:"offDuty",zone:"Bursa",jobs:64,rating:4.3,ini:"OK"},
  {id:6,name:"Serkan Polat",status:"onJob",zone:"Antalya",jobs:110,rating:4.7,ini:"SP"},
];
const zonesList = [
  {zone:"İstanbul Anadolu",techs:3,coverage:92,avgResp:"28dk",jobs:45,rev:67500},
  {zone:"İstanbul Avrupa",techs:4,coverage:88,avgResp:"32dk",jobs:52,rev:78000},
  {zone:"Ankara",techs:2,coverage:75,avgResp:"35dk",jobs:28,rev:42000},
  {zone:"İzmir",techs:2,coverage:70,avgResp:"38dk",jobs:22,rev:33000},
  {zone:"Bursa",techs:1,coverage:55,avgResp:"45dk",jobs:15,rev:22500},
  {zone:"Antalya",techs:2,coverage:68,avgResp:"40dk",jobs:18,rev:27000},
];
const providersList = [
  {id:1,name:"İstanbul Kapı Sistemleri",owner:"Ahmet Kara",email:"info@istkapı.com",plan:"professional",joined:"2025-06-15",monthlyRev:78000,jobs:312,customers:89,techs:6,status:"active",rating:4.7},
  {id:2,name:"Ankara Garaj Çözümleri",owner:"Mehmet Ak",email:"info@ankaracozum.com",plan:"starter",joined:"2025-09-01",monthlyRev:35000,jobs:145,customers:42,techs:3,status:"active",rating:4.4},
  {id:3,name:"Ege Otomatik Kapı",owner:"Selin Deniz",email:"info@egekapı.com",plan:"enterprise",joined:"2025-03-20",monthlyRev:125000,jobs:567,customers:156,techs:12,status:"active",rating:4.9},
  {id:4,name:"Akdeniz Servis",owner:"Can Yılmaz",email:"info@akdenizservis.com",plan:"professional",joined:"2025-11-10",monthlyRev:52000,jobs:198,customers:63,techs:5,status:"active",rating:4.5},
  {id:5,name:"Marmara Kapı",owner:"Elif Şahin",email:"info@marmarakapı.com",plan:"starter",joined:"2026-01-05",monthlyRev:18000,jobs:67,customers:28,techs:2,status:"pending",rating:0},
];
const revDaily=[{l:"Pzt",v:4200},{l:"Sal",v:5800},{l:"Çar",v:3900},{l:"Per",v:6100},{l:"Cum",v:7200},{l:"Cmt",v:8500},{l:"Paz",v:2100}];
const revMonthly=[{l:"Oca",v:142},{l:"Şub",v:158},{l:"Mar",v:175},{l:"Nis",v:163},{l:"May",v:189},{l:"Haz",v:201},{l:"Tem",v:195},{l:"Ağu",v:178},{l:"Eyl",v:210},{l:"Eki",v:225},{l:"Kas",v:198},{l:"Ara",v:245}];
const pricingInit=[
  {id:1,name:"Yay Tamiri / Spring Repair",price:2500,cat:"repair"},
  {id:2,name:"Motor Tamiri / Motor Repair",price:3500,cat:"repair"},
  {id:3,name:"Panel Değişimi / Panel Replace",price:4000,cat:"repair"},
  {id:4,name:"Kumanda Ayarı / Remote Setup",price:800,cat:"maintenance"},
  {id:5,name:"Komple Bakım / Full Service",price:1500,cat:"maintenance"},
  {id:6,name:"Kontrol / Inspection",price:500,cat:"maintenance"},
  {id:7,name:"Seksiyonel Kapı / Sectional Install",price:12000,cat:"installation"},
  {id:8,name:"Otomatik Kapı / Auto Door Install",price:15000,cat:"installation"},
  {id:9,name:"Acil Servis / Emergency",price:5000,cat:"emergency"},
];

// ── NAVY BLUE CSS ──
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
:root{--bg0:#050A18;--bg1:#0A1628;--bg2:#0F1D32;--bg2h:#142640;--bgi:#081220;--brd:#162544;--brdl:#1E3A5F;--t1:#E8EDF5;--t2:#8B9DC3;--t3:#5A7199;--acc:#2E8BFF;--acch:#5BA3FF;--accg:rgba(46,139,255,.18);--accs:rgba(46,139,255,.08);--acc2:#00D4AA;--acc2s:rgba(0,212,170,.1);--ok:#00D4AA;--oks:rgba(0,212,170,.12);--warn:#FFB020;--warns:rgba(255,176,32,.12);--err:#FF4C6E;--errs:rgba(255,76,110,.12);--inf:#2E8BFF;--infs:rgba(46,139,255,.12);--pur:#9F7AEA;--purs:rgba(159,122,234,.12);--r:12px;--rs:8px;--tr:all .22s cubic-bezier(.4,0,.2,1)}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Outfit',sans-serif;background:var(--bg0);color:var(--t1);overflow:hidden}
.app{display:flex;height:100vh;width:100vw;overflow:hidden}

/* ── Sidebar ── */
.sb{width:260px;min-width:260px;background:var(--bg1);border-right:1px solid var(--brd);display:flex;flex-direction:column;z-index:100;transition:var(--tr)}
.sb-b{padding:20px 24px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--brd)}
.sb-ico{width:42px;height:42px;background:linear-gradient(135deg,var(--acc),#1565C0);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 4px 16px rgba(46,139,255,.35);color:#fff}
.sb-nm{font-family:'JetBrains Mono',monospace;font-size:17px;font-weight:700;letter-spacing:-.5px;color:var(--t1)}
.sb-tg{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:1.5px}
.sb-nv{flex:1;padding:16px 12px;overflow-y:auto}
.sb-nv::-webkit-scrollbar{width:4px}.sb-nv::-webkit-scrollbar-thumb{background:var(--brdl);border-radius:2px}
.sb-sc{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:var(--t3);padding:16px 12px 8px;font-weight:600}
.ni{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:var(--rs);cursor:pointer;transition:var(--tr);color:var(--t2);font-size:14px;font-weight:500;margin-bottom:2px;position:relative;user-select:none}
.ni:hover{background:var(--bg2);color:var(--t1)}.ni.a{background:var(--accs);color:var(--acc)}
.ni.a::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:24px;background:var(--acc);border-radius:0 3px 3px 0}
.ni-i{width:20px;text-align:center;font-size:16px;flex-shrink:0}
.ni-b{margin-left:auto;background:var(--acc);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px}
.sb-ft{padding:16px;border-top:1px solid var(--brd)}
.ls{display:flex;background:var(--bgi);border-radius:var(--rs);padding:3px;gap:3px}
.lb{flex:1;padding:6px;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;transition:var(--tr);font-family:'Outfit',sans-serif;background:transparent;color:var(--t3)}
.lb.a{background:var(--acc);color:#fff}
.sb-role{margin:12px 0 4px;padding:6px 12px;border-radius:var(--rs);font-size:11px;font-weight:600;text-align:center;letter-spacing:.5px;text-transform:uppercase}
.sb-role.cust{background:var(--oks);color:var(--ok)}.sb-role.prov{background:var(--accs);color:var(--acc)}.sb-role.admin{background:var(--purs);color:var(--pur)}

/* ── Main ── */
.mc{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.hd{height:64px;border-bottom:1px solid var(--brd);display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:var(--bg1);flex-shrink:0}
.hd-l{display:flex;align-items:center;gap:16px}.hd-t{font-size:20px;font-weight:700;letter-spacing:-.3px}
.srch{display:flex;align-items:center;gap:8px;background:var(--bgi);border:1px solid var(--brd);border-radius:var(--rs);padding:8px 14px;width:280px;transition:var(--tr)}
.srch:focus-within{border-color:var(--acc);box-shadow:0 0 0 3px var(--accg)}
.srch input{background:none;border:none;outline:none;color:var(--t1);font-family:'Outfit',sans-serif;font-size:13px;width:100%}
.srch input::placeholder{color:var(--t3)}
.hd-r{display:flex;align-items:center;gap:12px}
.hb{width:36px;height:36px;border-radius:var(--rs);border:1px solid var(--brd);background:var(--bg2);color:var(--t2);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:var(--tr);font-size:16px;position:relative}
.hb:hover{border-color:var(--acc);color:var(--acc)}
.nd{position:absolute;top:6px;right:6px;width:7px;height:7px;background:var(--err);border-radius:50%;border:2px solid var(--bg2)}
.ua{width:36px;height:36px;border-radius:var(--rs);background:linear-gradient(135deg,var(--acc),var(--pur));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;cursor:pointer}
.pg{flex:1;overflow-y:auto;padding:28px;background:var(--bg0)}
.pg::-webkit-scrollbar{width:6px}.pg::-webkit-scrollbar-thumb{background:var(--brdl);border-radius:3px}

/* ── Cards & Grid ── */
.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:28px}
.sc{background:var(--bg2);border:1px solid var(--brd);border-radius:var(--r);padding:20px;transition:var(--tr);position:relative;overflow:hidden}
.sc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--r) var(--r) 0 0}
.sc.o::before{background:var(--acc)}.sc.g::before{background:var(--ok)}.sc.b::before{background:var(--inf)}.sc.p::before{background:var(--pur)}.sc.w::before{background:var(--warn)}
.sc:hover{border-color:var(--brdl);transform:translateY(-2px);box-shadow:0 4px 24px rgba(0,0,0,.4)}
.sl{font-size:12px;color:var(--t3);text-transform:uppercase;letter-spacing:.8px;font-weight:600;margin-bottom:8px}
.sv{font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:700;margin-bottom:6px}
.sch{font-size:12px;font-weight:600;display:flex;align-items:center;gap:4px}.sch.pos{color:var(--ok)}.sch.neg{color:var(--err)}
.cg{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}
.cd{background:var(--bg2);border:1px solid var(--brd);border-radius:var(--r);overflow:hidden}
.ch{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--brd)}
.ct{font-size:15px;font-weight:600}
.ca{font-size:12px;color:var(--acc);cursor:pointer;font-weight:600;background:none;border:none;font-family:'Outfit',sans-serif}
.ca:hover{color:var(--acch)}
.cb{padding:20px}

/* ── Buttons ── */
.btn{display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:var(--rs);font-size:13px;font-weight:600;cursor:pointer;transition:var(--tr);font-family:'Outfit',sans-serif;border:none;white-space:nowrap}
.btn-p{background:var(--acc);color:#fff;box-shadow:0 2px 12px rgba(46,139,255,.35)}.btn-p:hover{background:var(--acch);transform:translateY(-1px)}
.btn-s{background:var(--bgi);color:var(--t2);border:1px solid var(--brd)}.btn-s:hover{border-color:var(--brdl);color:var(--t1)}
.btn-g{background:transparent;color:var(--t2)}.btn-g:hover{color:var(--t1);background:var(--bg2)}
.btn-ok{background:var(--ok);color:#fff}.btn-err{background:var(--err);color:#fff}
.btn-sm{padding:6px 12px;font-size:12px}

/* ── Badges ── */
.bdg{display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.3px}
.bdg-ok{background:var(--oks);color:var(--ok)}.bdg-w{background:var(--warns);color:var(--warn)}.bdg-e{background:var(--errs);color:var(--err)}.bdg-i{background:var(--infs);color:var(--inf)}.bdg-p{background:var(--purs);color:var(--pur)}.bdg-m{background:rgba(90,113,153,.15);color:var(--t3)}

/* ── Table ── */
table{width:100%;border-collapse:collapse}
th{text-align:left;padding:10px 16px;font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--t3);font-weight:600;border-bottom:1px solid var(--brd);white-space:nowrap}
td{padding:12px 16px;font-size:13px;color:var(--t2);border-bottom:1px solid var(--brd);white-space:nowrap}
tr:last-child td{border-bottom:none}tr:hover td{background:var(--bg2h)}

/* ── Kanban ── */
.kb{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;min-height:480px}
.kc{background:var(--bg1);border:1px solid var(--brd);border-radius:var(--r);display:flex;flex-direction:column;overflow:hidden}
.kh{padding:14px 20px;border-bottom:1px solid var(--brd);display:flex;align-items:center;justify-content:space-between}
.khl{display:flex;align-items:center;gap:10px}
.kd{width:8px;height:8px;border-radius:50%}.kd-t{background:var(--inf)}.kd-d{background:var(--warn)}.kd-n{background:var(--ok)}
.kcn{font-size:12px;color:var(--t3);background:var(--bgi);padding:2px 8px;border-radius:10px;font-weight:600}
.kcs{padding:12px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px}
.kcd{background:var(--bg2);border:1px solid var(--brd);border-radius:var(--rs);padding:14px;transition:var(--tr)}
.kcd:hover{border-color:var(--brdl);transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,.3)}
.kcd-id{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--t3);margin-bottom:4px}
.kcd-tt{font-size:14px;font-weight:600;margin-bottom:6px}.kcd-cu{font-size:12px;color:var(--t2);margin-bottom:3px}.kcd-ad{font-size:11px;color:var(--t3);margin-bottom:8px}
.kcd-mt{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--t3)}
.pd{width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:4px}.pd-h{background:var(--err)}.pd-m{background:var(--warn)}.pd-l{background:var(--ok)}

/* ── Tech & Zone Cards ── */
.tg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.tc{background:var(--bg2);border:1px solid var(--brd);border-radius:var(--r);padding:20px;transition:var(--tr)}.tc:hover{border-color:var(--brdl)}
.th_{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.tav{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;color:#fff;flex-shrink:0}
.tav-a{background:linear-gradient(135deg,#00D4AA,#00A885)}.tav-o{background:linear-gradient(135deg,var(--acc),#1565C0)}.tav-f{background:linear-gradient(135deg,#5A7199,#3D5478)}
.tn{font-size:15px;font-weight:600}.tz{font-size:12px;color:var(--t3);margin-top:2px}
.ts{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding-top:16px;border-top:1px solid var(--brd)}
.tsl{font-size:11px;color:var(--t3);margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px}
.tsv{font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:700}
.zg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.zc{background:var(--bg2);border:1px solid var(--brd);border-radius:var(--r);padding:20px;transition:var(--tr)}.zc:hover{border-color:var(--brdl)}
.zn{font-size:16px;font-weight:700;margin-bottom:16px}
.zr{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--brd)}.zr:last-child{border-bottom:none}
.zrk{font-size:12px;color:var(--t3)}.zrv{font-size:13px;font-weight:600}
.cvb{width:100%;height:6px;background:var(--bgi);border-radius:3px;margin-top:12px;overflow:hidden}
.cvf{height:100%;border-radius:3px;transition:width .6s ease}

/* ── Charts ── */
.chtb{display:flex;gap:4px;background:var(--bgi);border-radius:var(--rs);padding:3px;width:fit-content}
.chtbi{padding:6px 16px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;transition:var(--tr);background:transparent;color:var(--t3);border:none;font-family:'Outfit',sans-serif}
.chtbi.a{background:var(--acc);color:#fff}
.bc{display:flex;align-items:flex-end;gap:8px;height:200px;padding:0 4px}
.bw{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;justify-content:flex-end}
.bar{width:100%;max-width:48px;border-radius:6px 6px 2px 2px;transition:height .5s ease;min-height:4px;cursor:pointer}
.bar:hover{filter:brightness(1.2)}.blb{font-size:11px;color:var(--t3);font-weight:500}.bvl{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t2);font-weight:600}

/* ── Subscription Plans ── */
.plg{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:960px;margin:0 auto}
.plc{background:var(--bg2);border:1px solid var(--brd);border-radius:16px;padding:32px 28px;text-align:center;transition:var(--tr);position:relative}
.plc:hover{border-color:var(--brdl);transform:translateY(-4px);box-shadow:0 4px 24px rgba(0,0,0,.4)}
.plc.ft{border-color:var(--acc);background:linear-gradient(180deg,var(--accs),var(--bg2))}
.plc.ft::before{content:'⭐ Popular';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--acc);color:#fff;padding:4px 16px;border-radius:20px;font-size:11px;font-weight:700}
.pln{font-size:20px;font-weight:700;margin-bottom:8px}
.plp{font-family:'JetBrains Mono',monospace;font-size:36px;font-weight:700;color:var(--acc);margin-bottom:4px}.plp span{font-size:14px;color:var(--t3);font-weight:400}
.plf{list-style:none;margin:24px 0;text-align:left}.plf li{padding:8px 0;font-size:13px;color:var(--t2);display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--brd)}.plf li:last-child{border-bottom:none}
.plb{width:100%;padding:12px;border-radius:var(--rs);font-size:14px;font-weight:700;cursor:pointer;transition:var(--tr);font-family:'Outfit',sans-serif;border:none}
.plb-p{background:var(--acc);color:#fff;box-shadow:0 4px 16px rgba(46,139,255,.35)}.plb-p:hover{background:var(--acch)}
.plb-s{background:var(--bgi);color:var(--t2);border:1px solid var(--brd)}.plb-s:hover{border-color:var(--acc);color:var(--acc)}
.pe{background:var(--bgi);border:1px solid var(--brd);border-radius:6px;color:var(--t1);padding:6px 10px;width:100px;font-family:'JetBrains Mono',monospace;font-size:13px;text-align:right}
.pe:focus{outline:none;border-color:var(--acc);box-shadow:0 0 0 3px var(--accg)}
.catl{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--acc);font-weight:700;margin-bottom:12px;margin-top:20px}.catl:first-child{margin-top:0}
.rsm{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.rmc{background:var(--bg2);border:1px solid var(--brd);border-radius:var(--rs);padding:16px}
.rml{font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--t3);font-weight:600;margin-bottom:6px}
.rmv{font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:700}

/* ── Modal ── */
.modal-ov{position:fixed;inset:0;background:rgba(5,10,24,.85);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.modal{background:var(--bg1);border:1px solid var(--brd);border-radius:var(--r);padding:28px;width:90%;max-width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 16px 48px rgba(0,0,0,.5)}
.modal h3{font-size:18px;font-weight:700;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between}
.modal h3 button{background:none;border:none;color:var(--t3);font-size:20px;cursor:pointer;transition:var(--tr)}.modal h3 button:hover{color:var(--t1)}
.fg{margin-bottom:16px}.fg label{display:block;font-size:12px;font-weight:600;color:var(--t2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}
.fg input,.fg select,.fg textarea{width:100%;padding:10px 14px;background:var(--bgi);border:1px solid var(--brd);border-radius:var(--rs);color:var(--t1);font-family:'Outfit',sans-serif;font-size:14px;transition:var(--tr)}
.fg input:focus,.fg select:focus,.fg textarea:focus{outline:none;border-color:var(--acc);box-shadow:0 0 0 3px var(--accg)}
.fg select{cursor:pointer}.fg textarea{resize:vertical;min-height:80px}
.fg select option{background:var(--bg1);color:var(--t1)}

/* ── Toast ── */
.toast{position:fixed;top:20px;right:20px;background:var(--ok);color:#fff;padding:14px 24px;border-radius:var(--rs);font-weight:600;font-size:14px;z-index:300;box-shadow:0 8px 24px rgba(0,0,0,.4);animation:slideIn .3s ease}
@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}

/* ── Portal Login ── */
.portal-bg{min-height:100vh;background:linear-gradient(135deg,#050A18 0%,#0A1628 40%,#0F1D32 100%);display:flex;align-items:center;justify-content:center;padding:20px;position:relative;overflow:hidden}
.portal-bg::before{content:'';position:absolute;width:600px;height:600px;background:radial-gradient(circle,rgba(46,139,255,.08),transparent 70%);top:-200px;right:-100px;pointer-events:none}
.portal-bg::after{content:'';position:absolute;width:500px;height:500px;background:radial-gradient(circle,rgba(0,212,170,.06),transparent 70%);bottom:-200px;left:-100px;pointer-events:none}
.portal-box{text-align:center;z-index:1;max-width:900px;width:100%}
.portal-logo{font-family:'JetBrains Mono',monospace;font-size:36px;font-weight:700;margin-bottom:6px;background:linear-gradient(135deg,var(--acc),var(--acc2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.portal-sub{color:var(--t3);font-size:14px;margin-bottom:40px;letter-spacing:.5px}
.portal-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-bottom:32px}
.p-card{background:var(--bg2);border:2px solid var(--brd);border-radius:16px;padding:32px 24px;cursor:pointer;transition:var(--tr);text-align:center}
.p-card:hover{border-color:var(--acc);transform:translateY(-6px);box-shadow:0 12px 40px rgba(46,139,255,.15)}
.p-card.sel{border-color:var(--acc);background:linear-gradient(180deg,var(--accs),var(--bg2))}
.p-card-ico{width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 16px}
.p-card-ico.c{background:linear-gradient(135deg,#00D4AA,#00A885)}.p-card-ico.pr{background:linear-gradient(135deg,var(--acc),#1565C0)}.p-card-ico.ad{background:linear-gradient(135deg,var(--pur),#7C3AED)}
.p-card-t{font-size:18px;font-weight:700;margin-bottom:6px}.p-card-d{font-size:13px;color:var(--t3);line-height:1.5}

/* ── Activity & Schedule ── */
.si{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--brd)}.si:last-child{border-bottom:none}
.sit{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--acc);font-weight:600;min-width:56px}
.sif{flex:1;min-width:0}.sin{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sis{font-size:12px;color:var(--t3);margin-top:2px}
.ait{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--brd)}.ait:last-child{border-bottom:none}
.aid{width:8px;height:8px;border-radius:50%;margin-top:6px;flex-shrink:0}.aitx{font-size:13px;color:var(--t2);line-height:1.5}.aitx strong{color:var(--t1);font-weight:600}.aitm{font-size:11px;color:var(--t3);margin-top:2px}
.mt{display:none;background:none;border:none;color:var(--t1);font-size:22px;cursor:pointer;padding:4px}
.so{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:99}
.fw{grid-column:1/-1}
@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.ai{animation:fi .35s ease-out forwards}.d1{animation-delay:.05s;opacity:0}.d2{animation-delay:.1s;opacity:0}.d3{animation-delay:.15s;opacity:0}.d4{animation-delay:.2s;opacity:0}
@keyframes pu{0%,100%{opacity:1}50%{opacity:.5}}.ld{width:8px;height:8px;border-radius:50%;background:var(--ok);animation:pu 2s ease-in-out infinite;display:inline-block}

/* ── Customer Portal Cards ── */
.srv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-bottom:24px}
.srv-card{background:var(--bg2);border:1px solid var(--brd);border-radius:var(--r);padding:20px;cursor:pointer;transition:var(--tr);text-align:center}
.srv-card:hover{border-color:var(--acc);transform:translateY(-2px)}.srv-card.sel{border-color:var(--acc);background:var(--accs)}
.srv-card-ico{font-size:28px;margin-bottom:10px}.srv-card-nm{font-size:14px;font-weight:600;margin-bottom:4px}.srv-card-pr{font-family:'JetBrains Mono',monospace;font-size:16px;color:var(--acc);font-weight:700}

/* ── Responsive ── */
@media(max-width:1200px){.sg{grid-template-columns:repeat(2,1fr)}.tg,.zg{grid-template-columns:repeat(2,1fr)}.plg,.portal-cards{grid-template-columns:1fr 1fr}.kb{grid-template-columns:1fr}.rsm{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){.sb{position:fixed;left:-280px;top:0;bottom:0;z-index:101}.sb.op{left:0}.so.sh{display:block}.mt{display:block}.sg,.cg,.rsm{grid-template-columns:1fr}.tg,.zg,.plg{grid-template-columns:1fr}.srch{display:none}.pg{padding:16px}.hd{padding:0 16px}.portal-cards{grid-template-columns:1fr}}
`;

// ═══════════════════════════════════════
// TOAST NOTIFICATION
// ═══════════════════════════════════════
function Toast({msg,onClose}) {
  useEffect(()=>{const t=setTimeout(onClose,2500);return()=>clearTimeout(t);},[onClose]);
  return <div className="toast">{msg}</div>;
}

// ═══════════════════════════════════════
// MODAL
// ═══════════════════════════════════════
function Modal({title,onClose,children}) {
  return (<div className="modal-ov" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><h3>{title}<button onClick={onClose}>✕</button></h3>{children}</div></div>);
}

// ═══════════════════════════════════════
// MAIN APP — MULTI-TENANT ROUTER
// ═══════════════════════════════════════
function Home() {
  const [lang,setLang]=useState("tr");
  const [role,setRole]=useState(null); // null|"customer"|"provider"|"admin"
  const [page,setPage]=useState("dashboard");
  const [sbOpen,setSbOpen]=useState(false);
  const [toast,setToast]=useState(null);
  // Dynamic data state
  const [cList,setCList]=useState(initCustomers);
  const [invList,setInvList]=useState(initInvoices);
  const [jobData,setJobData]=useState(initJobs);
  const [prices,setPrices]=useState(pricingInit);

  const t=lang==="tr"?TR:EN;
  const showToast=(m)=>{setToast(m);};
  const go=(k)=>{setPage(k);setSbOpen(false);};

  // ── Portal Selection Screen ──
  if(!role) return (
    <LangCtx.Provider value={{lang,t}}>
      <SEOHead/>
      <style>{CSS}</style>
      <div className="portal-bg">
        <div className="portal-box">
          <div className="portal-logo">⊡ GarageFlow</div>
          <div className="portal-sub">{t.selectPortal}</div>
          <div className="portal-cards">
            <div className="p-card" onClick={()=>{setRole("customer");setPage("requestService");}}>
              <div className="p-card-ico c">👤</div>
              <div className="p-card-t">{t.customerPortal}</div>
              <div className="p-card-d">{t.custDesc}</div>
            </div>
            <div className="p-card" onClick={()=>{setRole("provider");setPage("dashboard");}}>
              <div className="p-card-ico pr">🔧</div>
              <div className="p-card-t">{t.providerPortal}</div>
              <div className="p-card-d">{t.provDesc}</div>
            </div>
            <div className="p-card" onClick={()=>{setRole("admin");setPage("dashboard");}}>
              <div className="p-card-ico ad">👑</div>
              <div className="p-card-t">{t.adminPortal}</div>
              <div className="p-card-d">{t.adminDesc}</div>
            </div>
          </div>
          <div className="ls" style={{maxWidth:240,margin:"0 auto"}}>
            <button className={`lb ${lang==="tr"?"a":""}`} onClick={()=>setLang("tr")}>🇹🇷 Türkçe</button>
            <button className={`lb ${lang==="en"?"a":""}`} onClick={()=>setLang("en")}>🇬🇧 English</button>
          </div>
        </div>
      </div>
    </LangCtx.Provider>
  );

  // ── Nav items per role ──
  const navMap = {
    customer:[
      {k:"requestService",i:"🔧",l:t.requestService},
      {k:"myServices",i:"📋",l:t.myServices},
      {k:"myInvoices",i:"💳",l:t.myInvoices},
    ],
    provider:[
      {k:"dashboard",i:"◫",l:t.dashboard},
      {k:"crm",i:"👥",l:t.crm,b:cList.length},
      {k:"invoices",i:"💳",l:t.invoices,b:invList.filter(i=>i.status==="unpaid").length},
      {k:"jobs",i:"☰",l:t.jobs,b:jobData.todo.length+jobData.doing.length},
      {k:"technicians",i:"⚙",l:t.technicians},
      {k:"locations",i:"◎",l:t.locations},
      {k:"pricing",i:"₺",l:t.pricing},
      {k:"revenue",i:"📊",l:t.revenue},
      {k:"subscription",i:"★",l:t.subscription},
    ],
    admin:[
      {k:"dashboard",i:"◫",l:t.dashboard},
      {k:"providers",i:"🏢",l:t.providers,b:providersList.length},
      {k:"revenue",i:"📊",l:t.platformRevenue},
      {k:"subscription",i:"★",l:t.subscription},
    ],
  };
  const navItems = navMap[role]||[];
  const roleLabel = role==="customer"?t.customerPortal:role==="provider"?t.providerPortal:t.adminPortal;
  const roleClass = role==="customer"?"cust":role==="provider"?"prov":"admin";

  return (
    <LangCtx.Provider value={{lang,t}}>
      <SEOHead/>
      <style>{CSS}</style>
      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}
      <div className="app">
        <div className={`so ${sbOpen?"sh":""}`} onClick={()=>setSbOpen(false)}/>
        <aside className={`sb ${sbOpen?"op":""}`}>
          <div className="sb-b"><div className="sb-ico">⊡</div><div><div className="sb-nm">GarageFlow</div><div className="sb-tg">{roleLabel}</div></div></div>
          <nav className="sb-nv">
            <div className={`sb-role ${roleClass}`}>{roleLabel}</div>
            {navItems.map(n=>(<div key={n.k} className={`ni ${page===n.k?"a":""}`} onClick={()=>go(n.k)}><span className="ni-i">{n.i}</span>{n.l}{n.b!=null&&<span className="ni-b">{n.b}</span>}</div>))}
          </nav>
          <div className="sb-ft">
            <div className="ls" style={{marginBottom:10}}>
              <button className={`lb ${lang==="tr"?"a":""}`} onClick={()=>setLang("tr")}>🇹🇷 TR</button>
              <button className={`lb ${lang==="en"?"a":""}`} onClick={()=>setLang("en")}>🇬🇧 EN</button>
            </div>
            <button className="btn btn-s btn-sm" style={{width:"100%",justifyContent:"center"}} onClick={()=>{setRole(null);setPage("dashboard");}}>← {t.logout}</button>
          </div>
        </aside>
        <div className="mc">
          <header className="hd">
            <div className="hd-l"><button className="mt" onClick={()=>setSbOpen(!sbOpen)}>☰</button><h2 className="hd-t">{navItems.find(n=>n.k===page)?.l||t.dashboard}</h2></div>
            <div className="srch"><span style={{color:"var(--t3)"}}>⌕</span><input placeholder={t.search}/></div>
            <div className="hd-r"><div className="hb">🔔<div className="nd"/></div><div className="ua">{role==="customer"?"MK":role==="admin"?"AD":"AK"}</div></div>
          </header>
          <div className="pg">
            {/* ── CUSTOMER PORTAL ── */}
            {role==="customer"&&page==="requestService"&&<CustomerRequest t={t} prices={prices} showToast={showToast}/>}
            {role==="customer"&&page==="myServices"&&<CustomerServices t={t} jobs={jobData}/>}
            {role==="customer"&&page==="myInvoices"&&<CustomerInvoices t={t} invs={invList}/>}
            {/* ── PROVIDER PORTAL ── */}
            {role==="provider"&&page==="dashboard"&&<ProvDash t={t} jobs={jobData} invs={invList} custs={cList}/>}
            {role==="provider"&&page==="crm"&&<ProvCRM t={t} custs={cList} setCusts={setCList} showToast={showToast}/>}
            {role==="provider"&&page==="invoices"&&<ProvInvoices t={t} invs={invList} setInvs={setInvList} custs={cList} showToast={showToast}/>}
            {role==="provider"&&page==="jobs"&&<ProvJobs t={t} jobs={jobData} setJobs={setJobData} custs={cList} showToast={showToast}/>}
            {role==="provider"&&page==="technicians"&&<ProvTechs t={t}/>}
            {role==="provider"&&page==="locations"&&<ProvLocations t={t}/>}
            {role==="provider"&&page==="pricing"&&<ProvPricing t={t} prices={prices} setPrices={setPrices}/>}
            {role==="provider"&&page==="revenue"&&<ProvRevenue t={t}/>}
            {role==="provider"&&page==="subscription"&&<ProvSubscription t={t}/>}
            {/* ── ADMIN PORTAL ── */}
            {role==="admin"&&page==="dashboard"&&<AdminDash t={t}/>}
            {role==="admin"&&page==="providers"&&<AdminProviders t={t}/>}
            {role==="admin"&&page==="revenue"&&<AdminRevenue t={t}/>}
            {role==="admin"&&page==="subscription"&&<AdminSubs t={t}/>}
          </div>
        </div>
      </div>
    </LangCtx.Provider>
  );
}

// ═══════════════════════════════════════
// CUSTOMER PORTAL PAGES
// ═══════════════════════════════════════
function CustomerRequest({t,prices,showToast}) {
  const [sel,setSel]=useState(null);
  const [desc,setDesc]=useState("");
  const [addr,setAddr]=useState("");
  const submit=()=>{if(sel&&addr){showToast(t.serviceRequested);setSel(null);setDesc("");setAddr("");}};
  return (<div>
    <h3 style={{fontSize:18,fontWeight:700,marginBottom:20}}>{t.requestService}</h3>
    <p style={{color:"var(--t2)",marginBottom:20,fontSize:14}}>{t.serviceType}</p>
    <div className="srv-grid">
      {prices.map(p=>(<div key={p.id} className={`srv-card ${sel===p.id?"sel":""}`} onClick={()=>setSel(p.id)}>
        <div className="srv-card-ico">{p.cat==="repair"?"🔧":p.cat==="maintenance"?"🛠️":p.cat==="installation"?"🏗️":"🚨"}</div>
        <div className="srv-card-nm">{p.name.split("/")[0].trim()}</div>
        <div className="srv-card-pr">₺{p.price.toLocaleString()}</div>
      </div>))}
    </div>
    <div className="cd" style={{maxWidth:500}}>
      <div className="cb">
        <div className="fg"><label>{t.address} *</label><input value={addr} onChange={e=>setAddr(e.target.value)} placeholder="Kadıköy, İstanbul"/></div>
        <div className="fg"><label>{t.description}</label><textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="..."/></div>
        <button className="btn btn-p" style={{width:"100%",justifyContent:"center"}} onClick={submit} disabled={!sel||!addr}>{t.submit}</button>
      </div>
    </div>
  </div>);
}
function CustomerServices({t,jobs}) {
  const all=[...jobs.todo,...jobs.doing,...jobs.done];
  return (<div>
    <h3 style={{fontSize:18,fontWeight:700,marginBottom:20}}>{t.myServices}</h3>
    <div className="cd"><div style={{overflowX:"auto"}}><table><thead><tr><th>ID</th><th>{t.service}</th><th>{t.status}</th><th>{t.technician}</th><th>{t.date}</th></tr></thead>
    <tbody>{all.map(j=>{const st=jobs.done.includes(j)?"completed":jobs.doing.includes(j)?"inProgress":"pending";return(<tr key={j.id}><td style={{fontFamily:"'JetBrains Mono',monospace",color:"var(--acc)"}}>{j.id}</td><td style={{fontWeight:600,color:"var(--t1)"}}>{j.title}</td><td><span className={`bdg ${st==="completed"?"bdg-ok":st==="inProgress"?"bdg-w":"bdg-i"}`}>{t[st]}</span></td><td>{j.tech||"—"}</td><td>{j.date}</td></tr>);})}</tbody></table></div></div>
  </div>);
}
function CustomerInvoices({t,invs}) {
  return (<div>
    <h3 style={{fontSize:18,fontWeight:700,marginBottom:20}}>{t.myInvoices}</h3>
    <div className="cd"><div style={{overflowX:"auto"}}><table><thead><tr><th>{t.invoiceNo}</th><th>{t.amount}</th><th>{t.date}</th><th>{t.dueDate}</th><th>{t.status}</th><th>{t.action}</th></tr></thead>
    <tbody>{invs.map(inv=>(<tr key={inv.id}><td style={{fontFamily:"'JetBrains Mono',monospace",color:"var(--acc)"}}>{inv.id}</td><td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>₺{inv.amount.toLocaleString()}</td><td>{inv.date}</td><td>{inv.dueDate}</td><td><span className={`bdg ${inv.status==="paid"?"bdg-ok":inv.status==="overdue"?"bdg-e":"bdg-w"}`}>{t[inv.status]}</span></td><td>{inv.status!=="paid"&&<button className="btn btn-p btn-sm">{t.payNow}</button>}</td></tr>))}</tbody></table></div></div>
  </div>);
}

// ═══════════════════════════════════════
// PROVIDER PORTAL PAGES
// ═══════════════════════════════════════
function ProvDash({t,jobs,invs,custs}) {
  const totalRev=invs.filter(i=>i.status==="paid").reduce((s,i)=>s+i.amount,0);
  const activeJ=jobs.todo.length+jobs.doing.length;
  return (<div>
    <div className="sg"><div className="sc o ai d1"><div className="sl">{t.totalRevenue}</div><div className="sv">₺{totalRev.toLocaleString()}</div><div className="sch pos">↑ +12.5%</div></div>
    <div className="sc g ai d2"><div className="sl">{t.activeJobs}</div><div className="sv">{activeJ}</div><div className="sch pos">↑ +3</div></div>
    <div className="sc b ai d3"><div className="sl">{t.techsOnField}</div><div className="sv">{techsList.filter(x=>x.status==="onJob").length}<span style={{fontSize:14,color:"var(--t3)"}}> / {techsList.length}</span></div><div className="sch pos"><span className="ld"/> {t.live}</div></div>
    <div className="sc p ai d4"><div className="sl">{t.customerSatisfaction}</div><div className="sv">4.7 ★</div><div className="sch pos">↑ +0.2</div></div></div>
    <div className="cg">
      <div className="cd ai d2"><div className="ch"><span className="ct">{t.todaySchedule}</span><button className="ca">{t.viewAll}</button></div><div className="cb">
        {[{t:"09:00",n:t.springRepair,s:"Fatma — Bornova"},{t:"10:30",n:t.motorRepair,s:"Hasan — Nilüfer"},{t:"13:00",n:t.panelReplace,s:"Ayşe — Beşiktaş"},{t:"15:00",n:t.remoteSetup,s:"Mehmet — Kadıköy"}].map((s,i)=>(<div key={i} className="si"><span className="sit">{s.t}</span><div className="sif"><div className="sin">{s.n}</div><div className="sis">{s.s}</div></div><span className={`bdg ${i<2?"bdg-w":"bdg-i"}`} style={{fontSize:10}}>{i<2?t.inProgress:t.pending}</span></div>))}
      </div></div>
      <div className="cd ai d3"><div className="ch"><span className="ct">{t.recentActivity}</span></div><div className="cb">
        {[{c:"var(--ok)",h:`<strong>Burak</strong> — ${t.completed}`,m:"5m"},{c:"var(--acc)",h:`<strong>Fatma Öztürk</strong> — ${t.requestService}`,m:"18m"},{c:"var(--inf)",h:`<strong>FTR-005</strong> ${t.paid} — ₺3,500`,m:"42m"},{c:"var(--warn)",h:`<strong>Ali Demir</strong> — ${t.remind}`,m:"1h"}].map((a,i)=>(<div key={i} className="ait"><div className="aid" style={{background:a.c}}/><div><div className="aitx" dangerouslySetInnerHTML={{__html:a.h}}/><div className="aitm">{a.m}</div></div></div>))}
      </div></div>
    </div>
    <div className="cd ai d4"><div className="ch"><span className="ct">{t.earnings}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:"var(--acc)"}}>₺37,800</span></div><div className="cb"><div className="bc">{revDaily.map((d,i)=>(<div key={i} className="bw"><div className="bvl">₺{(d.v/1000).toFixed(1)}k</div><div className="bar" style={{height:`${(d.v/8500)*100}%`,background:"linear-gradient(180deg,var(--acc),#1565C0)"}}/><span className="blb">{d.l}</span></div>))}</div></div></div>
  </div>);
}

function ProvCRM({t,custs,setCusts,showToast}) {
  const [q,setQ]=useState("");const [modal,setModal]=useState(false);
  const [form,setForm]=useState({name:"",phone:"",email:"",address:""});
  const fl=custs.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())||c.address.toLowerCase().includes(q.toLowerCase()));
  const addCust=()=>{if(!form.name||!form.phone)return;setCusts(p=>[...p,{id:Date.now(),name:form.name,phone:form.phone,email:form.email,address:form.address,services:0,lastService:"—",status:"active",rating:0}]);setForm({name:"",phone:"",email:"",address:""});setModal(false);showToast(t.custAdded);};
  const delCust=(id)=>setCusts(p=>p.filter(c=>c.id!==id));
  return (<div>
    {modal&&<Modal title={t.addCustomer} onClose={()=>setModal(false)}>
      <div className="fg"><label>{t.name} *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
      <div className="fg"><label>{t.phone} *</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
      <div className="fg"><label>{t.email}</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
      <div className="fg"><label>{t.address}</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></div>
      <button className="btn btn-p" style={{width:"100%",justifyContent:"center"}} onClick={addCust}>{t.save}</button>
    </Modal>}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <div className="srch" style={{width:260}}><span style={{color:"var(--t3)"}}>⌕</span><input placeholder={t.search} value={q} onChange={e=>setQ(e.target.value)}/></div>
      <button className="btn btn-p" onClick={()=>setModal(true)}>+ {t.addCustomer}</button>
    </div>
    <div className="cd"><div style={{overflowX:"auto"}}><table><thead><tr><th>{t.name}</th><th>{t.phone}</th><th>{t.address}</th><th>{t.lastService}</th><th>{t.status}</th><th>{t.avgRating}</th><th>{t.action}</th></tr></thead>
    <tbody>{fl.map(c=>(<tr key={c.id}><td style={{fontWeight:600,color:"var(--t1)"}}>{c.name}</td><td>{c.phone}</td><td>{c.address}</td><td>{c.lastService}</td><td><span className={`bdg ${c.status==="active"?"bdg-ok":c.status==="pending"?"bdg-w":"bdg-m"}`}>{t[c.status]}</span></td><td>{c.rating>0?<span style={{color:"var(--acc)",fontWeight:600}}>{c.rating} ★</span>:"—"}</td><td><button className="btn btn-g btn-sm" style={{color:"var(--err)"}} onClick={()=>delCust(c.id)}>✕</button></td></tr>))}</tbody></table></div></div>
  </div>);
}

function ProvInvoices({t,invs,setInvs,custs,showToast}) {
  const [f,setF]=useState("all");const [modal,setModal]=useState(false);
  const [form,setForm]=useState({customer:"",amount:"",dueDate:""});
  const fl=f==="all"?invs:invs.filter(i=>i.status===f);
  const sum=s=>invs.filter(i=>i.status===s).reduce((a,i)=>a+i.amount,0);
  const addInv=()=>{if(!form.customer||!form.amount)return;setInvs(p=>[...p,{id:`FTR-${String(p.length+1).padStart(3,"0")}`,customer:form.customer,amount:Number(form.amount),date:new Date().toISOString().split("T")[0],dueDate:form.dueDate||"2026-03-15",status:"unpaid",items:["Servis"]}]);setForm({customer:"",amount:"",dueDate:""});setModal(false);showToast(t.invAdded);};
  return (<div>
    {modal&&<Modal title={t.createInvoice} onClose={()=>setModal(false)}>
      <div className="fg"><label>{t.customer} *</label><select value={form.customer} onChange={e=>setForm({...form,customer:e.target.value})}><option value="">{t.selectCustomer}</option>{custs.map(c=>(<option key={c.id} value={c.name}>{c.name}</option>))}</select></div>
      <div className="fg"><label>{t.amount} (₺) *</label><input type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></div>
      <div className="fg"><label>{t.dueDate}</label><input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></div>
      <button className="btn btn-p" style={{width:"100%",justifyContent:"center"}} onClick={addInv}>{t.save}</button>
    </Modal>}
    <div className="sg" style={{gridTemplateColumns:"repeat(3,1fr)",marginBottom:24}}>
      <div className="sc g ai d1"><div className="sl">{t.paid}</div><div className="sv">₺{sum("paid").toLocaleString()}</div></div>
      <div className="sc w ai d2"><div className="sl">{t.unpaid}</div><div className="sv">₺{sum("unpaid").toLocaleString()}</div></div>
      <div className="sc p ai d3"><div className="sl">{t.overdue}</div><div className="sv" style={{color:"var(--err)"}}>₺{sum("overdue").toLocaleString()}</div></div>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <div className="chtb">{["all","paid","unpaid","overdue"].map(x=>(<button key={x} className={`chtbi ${f===x?"a":""}`} onClick={()=>setF(x)}>{x==="all"?t.all:t[x]}</button>))}</div>
      <button className="btn btn-p" onClick={()=>setModal(true)}>+ {t.createInvoice}</button>
    </div>
    <div className="cd"><div style={{overflowX:"auto"}}><table><thead><tr><th>{t.invoiceNo}</th><th>{t.customer}</th><th>{t.amount}</th><th>{t.date}</th><th>{t.dueDate}</th><th>{t.status}</th></tr></thead>
    <tbody>{fl.map(inv=>(<tr key={inv.id}><td style={{fontFamily:"'JetBrains Mono',monospace",color:"var(--acc)",fontWeight:600}}>{inv.id}</td><td style={{fontWeight:500,color:"var(--t1)"}}>{inv.customer}</td><td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>₺{inv.amount.toLocaleString()}</td><td>{inv.date}</td><td>{inv.dueDate}</td><td><span className={`bdg ${inv.status==="paid"?"bdg-ok":inv.status==="overdue"?"bdg-e":"bdg-w"}`}>{t[inv.status]}</span></td></tr>))}</tbody></table></div></div>
  </div>);
}

function ProvJobs({t,jobs,setJobs,custs,showToast}) {
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({title:"",customer:"",address:"",priority:"medium",tech:""});
  const cols=[{k:"todo",l:t.todo,d:"kd-t"},{k:"doing",l:t.doing,d:"kd-d"},{k:"done",l:t.done,d:"kd-n"}];
  const move=(id,from,to)=>setJobs(p=>{const j=p[from].find(x=>x.id===id);if(!j)return p;return{...p,[from]:p[from].filter(x=>x.id!==id),[to]:[...p[to],j]};});
  const addJob=()=>{if(!form.title||!form.customer)return;const nj={id:`J-${Date.now()%10000}`,title:form.title,customer:form.customer,address:form.address,priority:form.priority,tech:form.tech,date:new Date().toISOString().split("T")[0]};setJobs(p=>({...p,todo:[nj,...p.todo]}));setForm({title:"",customer:"",address:"",priority:"medium",tech:""});setModal(false);showToast(t.jobAdded);};
  return (<div>
    {modal&&<Modal title={t.addJob} onClose={()=>setModal(false)}>
      <div className="fg"><label>{t.jobTitle} *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder={t.springRepair}/></div>
      <div className="fg"><label>{t.customer} *</label><select value={form.customer} onChange={e=>setForm({...form,customer:e.target.value})}><option value="">{t.selectCustomer}</option>{custs.map(c=>(<option key={c.id} value={c.name}>{c.name}</option>))}</select></div>
      <div className="fg"><label>{t.address}</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></div>
      <div className="fg"><label>{t.priority}</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option value="high">{t.high}</option><option value="medium">{t.medium}</option><option value="low">{t.low}</option></select></div>
      <div className="fg"><label>{t.technician}</label><select value={form.tech} onChange={e=>setForm({...form,tech:e.target.value})}><option value="">{t.unassigned}</option>{techsList.filter(x=>x.status!=="offDuty").map(tc=>(<option key={tc.id} value={tc.name}>{tc.name}</option>))}</select></div>
      <button className="btn btn-p" style={{width:"100%",justifyContent:"center"}} onClick={addJob}>{t.save}</button>
    </Modal>}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <div style={{fontSize:13,color:"var(--t3)"}}>{t.jobs} — {jobs.todo.length+jobs.doing.length+jobs.done.length} total</div>
      <button className="btn btn-p" onClick={()=>setModal(true)}>+ {t.addJob}</button>
    </div>
    <div className="kb">{cols.map(col=>(<div key={col.k} className="kc ai">
      <div className="kh"><div className="khl"><div className={`kd ${col.d}`}/><span style={{fontWeight:600,fontSize:14}}>{col.l}</span></div><span className="kcn">{jobs[col.k].length}</span></div>
      <div className="kcs">{jobs[col.k].map(j=>(<div key={j.id} className="kcd">
        <div className="kcd-id">{j.id}</div><div className="kcd-tt">{j.title}</div><div className="kcd-cu">{j.customer}</div><div className="kcd-ad">{j.address}</div>
        <div className="kcd-mt"><span><span className={`pd pd-${j.priority[0]}`}/>{t[j.priority]}</span><span>{j.tech||t.unassigned}</span></div>
        <div style={{display:"flex",gap:4,marginTop:10}}>
          {col.k!=="todo"&&<button className="btn btn-g btn-sm" style={{flex:1,fontSize:11,justifyContent:"center"}} onClick={()=>move(j.id,col.k,col.k==="doing"?"todo":"doing")}>← {col.k==="doing"?t.todo:t.doing}</button>}
          {col.k!=="done"&&<button className="btn btn-p btn-sm" style={{flex:1,fontSize:11,justifyContent:"center"}} onClick={()=>move(j.id,col.k,col.k==="todo"?"doing":"done")}>{col.k==="todo"?t.doing:t.done} →</button>}
        </div>
      </div>))}</div>
    </div>))}</div>
  </div>);
}

function ProvTechs({t}) {
  return (<div>
    <div className="sg" style={{gridTemplateColumns:"repeat(3,1fr)",marginBottom:24}}>
      <div className="sc g ai d1"><div className="sl">{t.available}</div><div className="sv">{techsList.filter(x=>x.status==="available").length}</div></div>
      <div className="sc o ai d2"><div className="sl">{t.onJob}</div><div className="sv">{techsList.filter(x=>x.status==="onJob").length}</div></div>
      <div className="sc p ai d3"><div className="sl">{t.offDuty}</div><div className="sv">{techsList.filter(x=>x.status==="offDuty").length}</div></div>
    </div>
    <div className="tg">{techsList.map(tc=>(<div key={tc.id} className="tc ai">
      <div className="th_"><div className={`tav ${tc.status==="available"?"tav-a":tc.status==="onJob"?"tav-o":"tav-f"}`}>{tc.ini}</div><div><div className="tn">{tc.name}</div><div className="tz">{tc.zone}</div><span className={`bdg ${tc.status==="available"?"bdg-ok":tc.status==="onJob"?"bdg-w":"bdg-m"}`} style={{marginTop:4}}>{tc.status==="onJob"&&<span className="ld" style={{width:6,height:6,marginRight:4}}/>}{t[tc.status]}</span></div></div>
      <div className="ts"><div><div className="tsl">{t.jobsCompleted}</div><div className="tsv">{tc.jobs}</div></div><div><div className="tsl">{t.avgRating}</div><div className="tsv" style={{color:"var(--acc)"}}>{tc.rating} ★</div></div></div>
      <div style={{marginTop:14,display:"flex",gap:6}}><button className="btn btn-s btn-sm" style={{flex:1,justifyContent:"center"}}>✆ {t.call}</button><button className="btn btn-p btn-sm" style={{flex:1,justifyContent:"center"}}>▷ Assign</button></div>
    </div>))}</div>
  </div>);
}

function ProvLocations({t}) {
  const cc=p=>p>=85?"var(--ok)":p>=65?"var(--warn)":"var(--err)";
  return (<div>
    <div className="zg">{zonesList.map((z,i)=>(<div key={i} className="zc ai" style={{animationDelay:`${i*.05}s`,opacity:0}}>
      <div className="zn">{z.zone}</div>
      {[[t.techCount,z.techs],[t.activeJobs,z.jobs],[t.avgResponse,z.avgResp],["₺",`₺${z.rev.toLocaleString()}`]].map(([k,v],j)=>(<div key={j} className="zr"><span className="zrk">{k}</span><span className="zrv">{v}</span></div>))}
      <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}><span style={{fontSize:12,color:"var(--t3)"}}>{t.coverage}</span><span style={{fontSize:13,fontWeight:700,color:cc(z.coverage)}}>{z.coverage}%</span></div>
      <div className="cvb"><div className="cvf" style={{width:`${z.coverage}%`,background:cc(z.coverage)}}/></div>
    </div>))}</div>
    <div className="cd" style={{marginTop:24}}><div className="ch"><span className="ct">{t.dispatchRec}</span></div><div className="cb" style={{display:"flex",flexDirection:"column",gap:12}}>
      {[{z:"Bursa",c:"err"},{z:"Antalya",c:"warn"},{z:"İst. Anadolu",c:"ok"}].map((r,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"var(--bgi)",borderRadius:"var(--rs)",borderLeft:`3px solid var(--${r.c})`}}><span style={{fontWeight:600,fontSize:13,minWidth:120}}>{r.z}</span><span style={{fontSize:13,color:"var(--t2)"}}>{r.c==="err"?"⚠ Low coverage":r.c==="warn"?"⏱ Slow response":"✓ Optimal"}</span></div>))}
    </div></div>
  </div>);
}

function ProvPricing({t,prices,setPrices}) {
  const cats=[{k:"repair",l:t.repairServices},{k:"maintenance",l:t.maintenanceServices},{k:"installation",l:t.installServices},{k:"emergency",l:t.emergencyServices}];
  return (<div>
    <div className="cd"><div className="cb">{cats.map(cat=>{const items=prices.filter(p=>p.cat===cat.k);if(!items.length)return null;return(<div key={cat.k}><div className="catl">{cat.l}</div><table><thead><tr><th>{t.serviceName}</th><th style={{textAlign:"right"}}>{t.basePrice} (₺)</th></tr></thead>
    <tbody>{items.map(it=>(<tr key={it.id}><td style={{fontWeight:500,color:"var(--t1)"}}>{it.name}</td><td style={{textAlign:"right"}}><input className="pe" type="number" value={it.price} onChange={e=>setPrices(p=>p.map(x=>x.id===it.id?{...x,price:Number(e.target.value)||0}:x))}/></td></tr>))}</tbody></table></div>);})}</div></div>
  </div>);
}

function ProvRevenue({t}) {
  const [period,setPeriod]=useState("monthly");
  const data=period==="daily"?revDaily:revMonthly;const mx=Math.max(...data.map(d=>d.v));
  return (<div>
    <div className="rsm"><div className="rmc ai d1"><div className="rml">{t.daily} {t.earnings}</div><div className="rmv" style={{color:"var(--acc)"}}>₺8,500</div></div><div className="rmc ai d2"><div className="rml">{t.monthly} {t.earnings}</div><div className="rmv" style={{color:"var(--ok)"}}>₺245,800</div></div><div className="rmc ai d3"><div className="rml">{t.annual} {t.earnings}</div><div className="rmv" style={{color:"var(--inf)"}}>₺2.28M</div></div><div className="rmc ai d4"><div className="rml">{t.growth}</div><div className="rmv" style={{color:"var(--ok)"}}>+12.5%</div></div></div>
    <div className="cd fw" style={{marginBottom:20}}><div className="ch"><span className="ct">{t.revenueChart}</span><div className="chtb"><button className={`chtbi ${period==="daily"?"a":""}`} onClick={()=>setPeriod("daily")}>{t.daily}</button><button className={`chtbi ${period==="monthly"?"a":""}`} onClick={()=>setPeriod("monthly")}>{t.monthly}</button></div></div>
    <div className="cb"><div className="bc" style={{height:240}}>{data.map((d,i)=>(<div key={i} className="bw"><div className="bvl">{period==="daily"?`₺${(d.v/1000).toFixed(1)}k`:`₺${d.v}k`}</div><div className="bar" style={{height:`${(d.v/mx)*100}%`,background:d.v===mx?"linear-gradient(180deg,var(--acc),#1565C0)":"linear-gradient(180deg,rgba(46,139,255,.5),rgba(21,101,192,.3))"}}/><span className="blb">{d.l}</span></div>))}</div></div></div>
  </div>);
}

function ProvSubscription({t}) {
  const [sel,setSel]=useState("professional");
  const plans=[
    {k:"starter",n:t.starter,p:"799",feats:["5 Teknisyen","100 Müşteri","Temel CRM","Fatura Takibi","Kanban","E-posta Destek"]},
    {k:"professional",n:t.professional,p:"1,499",ft:true,feats:["15 Teknisyen","Sınırsız Müşteri","Gelişmiş CRM","Otomatik Fatura","Konum Matrisi","Gelir Raporları","Canlı Takip","Öncelikli Destek"]},
    {k:"enterprise",n:t.enterprise,p:"2,999",feats:["Sınırsız Teknisyen","Sınırsız Müşteri","Tüm Özellikler","API Erişimi","Çoklu Şube","Özel Raporlar","7/24 Destek","Hesap Yöneticisi"]},
  ];
  return (<div>
    <div style={{textAlign:"center",marginBottom:40}}><h2 style={{fontSize:28,fontWeight:700,marginBottom:8}}>{t.choosePlan}</h2><p style={{fontSize:14,color:"var(--t2)",maxWidth:500,margin:"0 auto"}}>{t.trialInfo}</p></div>
    <div className="plg">{plans.map(pl=>(<div key={pl.k} className={`plc ai ${pl.ft?"ft":""}`}><div className="pln">{pl.n}</div><div className="plp">₺{pl.p}<span> {t.perMonth}</span></div><ul className="plf">{pl.feats.map((f,i)=>(<li key={i}><span style={{color:"var(--ok)"}}>✓</span>{f}</li>))}</ul><button className={`plb ${pl.ft||sel===pl.k?"plb-p":"plb-s"}`} onClick={()=>setSel(pl.k)}>{sel===pl.k?`✓ ${t.selected}`:t.subscribe}</button></div>))}</div>
  </div>);
}

// ═══════════════════════════════════════
// ADMIN PORTAL PAGES
// ═══════════════════════════════════════
function AdminDash({t}) {
  const totalRev=providersList.reduce((s,p)=>s+p.monthlyRev,0);
  const totalJobs=providersList.reduce((s,p)=>s+p.jobs,0);
  const totalCusts=providersList.reduce((s,p)=>s+p.customers,0);
  return (<div>
    <div className="sg"><div className="sc p ai d1"><div className="sl">{t.totalProviders}</div><div className="sv">{providersList.length}</div></div>
    <div className="sc g ai d2"><div className="sl">{t.totalCustomersAll}</div><div className="sv">{totalCusts}</div></div>
    <div className="sc o ai d3"><div className="sl">{t.platformRevenue}</div><div className="sv">₺{totalRev.toLocaleString()}</div></div>
    <div className="sc b ai d4"><div className="sl">{t.activeSubscriptions}</div><div className="sv">{providersList.filter(p=>p.status==="active").length}</div></div></div>
    <div className="cd ai d2"><div className="ch"><span className="ct">{t.providers} — Overview</span></div><div className="cb"><div style={{overflowX:"auto"}}><table><thead><tr><th>{t.providerName}</th><th>{t.plan}</th><th>{t.monthlyRev}</th><th>{t.providerJobs}</th><th>Müşteri</th><th>{t.status}</th></tr></thead>
    <tbody>{providersList.map(p=>(<tr key={p.id}><td style={{fontWeight:600,color:"var(--t1)"}}>{p.name}</td><td><span className={`bdg ${p.plan==="enterprise"?"bdg-p":p.plan==="professional"?"bdg-i":"bdg-m"}`}>{p.plan}</span></td><td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"var(--acc)"}}>₺{p.monthlyRev.toLocaleString()}</td><td>{p.jobs}</td><td>{p.customers}</td><td><span className={`bdg ${p.status==="active"?"bdg-ok":"bdg-w"}`}>{p.status==="active"?t.active:t.pending}</span></td></tr>))}</tbody></table></div></div></div>
    <div className="cg" style={{marginTop:20}}>
      <div className="cd ai d3"><div className="ch"><span className="ct">{t.byZone}</span></div><div className="cb">
        {[{z:"İstanbul",v:113000},{z:"Ankara",v:35000},{z:"İzmir",v:52000},{z:"Antalya",v:52000},{z:"Bursa",v:18000}].map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<4?"1px solid var(--brd)":"none"}}><span style={{fontSize:13,fontWeight:500}}>{r.z}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"var(--acc)"}}>₺{r.v.toLocaleString()}</span></div>))}
      </div></div>
      <div className="cd ai d4"><div className="ch"><span className="ct">{t.plan} Distribution</span></div><div className="cb">
        {[{p:"Enterprise",n:1,c:"var(--pur)"},{p:"Professional",n:2,c:"var(--acc)"},{p:"Starter",n:2,c:"var(--t3)"}].map((r,i)=>(<div key={i} style={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,color:"var(--t2)"}}>{r.p}</span><span style={{fontWeight:600}}>{r.n}</span></div><div className="cvb"><div className="cvf" style={{width:`${(r.n/5)*100}%`,background:r.c}}/></div></div>))}
      </div></div>
    </div>
  </div>);
}

function AdminProviders({t}) {
  const [sel,setSel]=useState(null);
  if(sel){const p=providersList.find(x=>x.id===sel);if(!p)return null;return(<div>
    <button className="btn btn-s" style={{marginBottom:20}} onClick={()=>setSel(null)}>← {t.back}</button>
    <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:20}}>
      <div className="cd"><div className="cb">
        <div style={{width:72,height:72,borderRadius:16,background:"linear-gradient(135deg,var(--acc),var(--pur))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,color:"#fff",marginBottom:16}}>{p.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
        <h3 style={{fontSize:18,fontWeight:700,marginBottom:16}}>{p.name}</h3>
        {[["Owner",p.owner],["Email",p.email],[t.plan,p.plan],[t.joinDate,p.joined],[t.avgRating,p.rating>0?`${p.rating} ★`:"—"]].map(([l,v],i)=>(<div key={i} style={{marginBottom:12}}><div style={{fontSize:11,textTransform:"uppercase",color:"var(--t3)",marginBottom:3}}>{l}</div><div style={{fontSize:14}}>{v}</div></div>))}
        <button className="btn btn-err btn-sm" style={{width:"100%",justifyContent:"center",marginTop:16}}>{t.suspendAccount}</button>
      </div></div>
      <div><div className="sg" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        <div className="sc o"><div className="sl">{t.monthlyRev}</div><div className="sv">₺{p.monthlyRev.toLocaleString()}</div></div>
        <div className="sc g"><div className="sl">{t.providerJobs}</div><div className="sv">{p.jobs}</div></div>
        <div className="sc b"><div className="sl">{t.technicians}</div><div className="sv">{p.techs}</div></div>
      </div></div>
    </div>
  </div>);}
  return (<div>
    <div className="cd"><div style={{overflowX:"auto"}}><table><thead><tr><th>{t.providerName}</th><th>Owner</th><th>{t.plan}</th><th>{t.monthlyRev}</th><th>{t.providerJobs}</th><th>Techs</th><th>{t.status}</th><th>{t.action}</th></tr></thead>
    <tbody>{providersList.map(p=>(<tr key={p.id}><td style={{fontWeight:600,color:"var(--t1)"}}>{p.name}</td><td>{p.owner}</td><td><span className={`bdg ${p.plan==="enterprise"?"bdg-p":p.plan==="professional"?"bdg-i":"bdg-m"}`}>{p.plan}</span></td><td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"var(--acc)"}}>₺{p.monthlyRev.toLocaleString()}</td><td>{p.jobs}</td><td>{p.techs}</td><td><span className={`bdg ${p.status==="active"?"bdg-ok":"bdg-w"}`}>{p.status==="active"?t.active:t.pending}</span></td><td><button className="btn btn-p btn-sm" onClick={()=>setSel(p.id)}>→</button></td></tr>))}</tbody></table></div></div>
  </div>);
}

function AdminRevenue({t}) {
  const totalMonthly=providersList.reduce((s,p)=>s+p.monthlyRev,0);
  return (<div>
    <div className="rsm"><div className="rmc ai d1"><div className="rml">{t.monthly} {t.platformRevenue}</div><div className="rmv" style={{color:"var(--acc)"}}>₺{totalMonthly.toLocaleString()}</div></div><div className="rmc ai d2"><div className="rml">{t.annual} (est.)</div><div className="rmv" style={{color:"var(--ok)"}}>₺{(totalMonthly*12).toLocaleString()}</div></div><div className="rmc ai d3"><div className="rml">ARPU</div><div className="rmv" style={{color:"var(--pur)"}}>₺{Math.round(totalMonthly/providersList.length).toLocaleString()}</div></div><div className="rmc ai d4"><div className="rml">{t.growth}</div><div className="rmv" style={{color:"var(--ok)"}}>+18.2%</div></div></div>
    <div className="cd fw"><div className="ch"><span className="ct">{t.providers} {t.revenue}</span></div><div className="cb"><div className="bc" style={{height:240}}>
      {providersList.map((p,i)=>{const mx=Math.max(...providersList.map(x=>x.monthlyRev));return(<div key={i} className="bw"><div className="bvl">₺{(p.monthlyRev/1000).toFixed(0)}k</div><div className="bar" style={{height:`${(p.monthlyRev/mx)*100}%`,background:p.monthlyRev===mx?"linear-gradient(180deg,var(--acc),#1565C0)":"linear-gradient(180deg,rgba(46,139,255,.5),rgba(21,101,192,.3))"}}/><span className="blb" style={{fontSize:10}}>{p.name.split(" ")[0]}</span></div>);})}
    </div></div></div>
  </div>);
}

function AdminSubs({t}) {
  return (<div>
    <h3 style={{fontSize:18,fontWeight:700,marginBottom:20}}>{t.subscription} Management</h3>
    <div className="cd"><div style={{overflowX:"auto"}}><table><thead><tr><th>{t.providerName}</th><th>{t.plan}</th><th>{t.joinDate}</th><th>{t.monthlyRev}</th><th>{t.status}</th></tr></thead>
    <tbody>{providersList.map(p=>(<tr key={p.id}><td style={{fontWeight:600,color:"var(--t1)"}}>{p.name}</td><td><span className={`bdg ${p.plan==="enterprise"?"bdg-p":p.plan==="professional"?"bdg-i":"bdg-m"}`}>{p.plan}</span></td><td>{p.joined}</td><td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>₺{p.monthlyRev.toLocaleString()}</td><td><span className={`bdg ${p.status==="active"?"bdg-ok":"bdg-w"}`}>{t[p.status]||p.status}</span></td></tr>))}</tbody></table></div></div>
  </div>);
}

export default Home;

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Proposal, Voucher, Hotel, Destination, Agency, User, CompanyInfo } from '../contexts/DataContext';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

interface PDFGeneratorOptions {
  language?: string;
  includeBreakdown?: boolean;
  showPricing?: boolean;
}

// Translation helper
const translations: Record<string, Record<string, string>> = {
  english: {
    proposal: 'TRAVEL PROPOSAL',
    voucher: 'SERVICE VOUCHER',
    reference: 'Reference',
    date: 'Date',
    agency: 'Agency',
    salesPerson: 'Sales Person',
    destinations: 'Destinations',
    contact: 'Contact',
    email: 'Email',
    phone: 'Phone',
    hotels: 'Hotels',
    transportation: 'Transportation',
    flights: 'Flights',
    rentACar: 'Rent-A-Car',
    additionalServices: 'Additional Services',
    hotel: 'Hotel',
    destination: 'Destination',
    checkin: 'Check-in',
    checkout: 'Check-out',
    nights: 'Nights',
    rooms: 'Rooms',
    roomType: 'Room Type',
    mealPlan: 'Meal Plan',
    pricePerNight: 'Price/Night',
    total: 'Total',
    vehicleType: 'Vehicle Type',
    numVehicles: 'Vehicles',
    days: 'Days',
    pricePerDay: 'Price/Day',
    flightType: 'Flight Type',
    route: 'Route',
    flightDate: 'Date',
    time: 'Time',
    passengers: 'Passengers',
    pricePerPax: 'Price/Pax',
    carType: 'Car Type',
    pickupDate: 'Pickup Date',
    dropoffDate: 'Drop-off Date',
    pickupLocation: 'Pickup Location',
    dropoffLocation: 'Drop-off Location',
    serviceType: 'Service Type',
    description: 'Description',
    subtotal: 'Subtotal',
    margin: 'Margin',
    commission: 'Commission',
    grandTotal: 'Grand Total',
    guests: 'Guests',
    name: 'Name',
    passport: 'Passport',
    nationality: 'Nationality',
    birthDate: 'Date of Birth',
    adults: 'Adults',
    children: 'Children',
    totalPax: 'Total Passengers',
    notes: 'Notes',
    serviceDetails: 'Service Details',
    status: 'Status',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    new: 'New',
    termsConditions: 'Terms & Conditions',
    footer: 'Thank you for choosing our services',
    page: 'Page',
  },
  arabic: {
    proposal: 'عرض سفر',
    voucher: 'قسيمة خدمة',
    reference: 'المرجع',
    date: 'التاريخ',
    agency: 'الوكالة',
    salesPerson: 'مندوب المبيعات',
    destinations: 'الوجهات',
    contact: 'جهة الاتصال',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    hotels: 'الفنادق',
    transportation: 'النقل',
    flights: 'الرحلات الجوية',
    rentACar: 'استئجار سيارة',
    additionalServices: 'خدمات إضافية',
    hotel: 'الفندق',
    destination: 'الوجهة',
    checkin: 'تسجيل الوصول',
    checkout: 'تسجيل المغادرة',
    nights: 'الليالي',
    rooms: 'الغرف',
    roomType: 'نوع الغرفة',
    mealPlan: 'نظام الوجبات',
    pricePerNight: 'السعر/الليلة',
    total: 'المجموع',
    vehicleType: 'نوع المركبة',
    numVehicles: 'المركبات',
    days: 'الأيام',
    pricePerDay: 'السعر/اليوم',
    flightType: 'نوع الرحلة',
    route: 'المسار',
    flightDate: 'التاريخ',
    time: 'الوقت',
    passengers: 'الركاب',
    pricePerPax: 'السعر/الراكب',
    carType: 'نوع السيارة',
    pickupDate: 'تاريخ الاستلام',
    dropoffDate: 'تاريخ التسليم',
    pickupLocation: 'موقع الاستلام',
    dropoffLocation: 'موقع التسليم',
    serviceType: 'نوع الخدمة',
    description: 'الوصف',
    subtotal: 'المجموع الفرعي',
    margin: 'الهامش',
    commission: 'العمولة',
    grandTotal: 'المجموع الإجمالي',
    guests: 'الضيوف',
    name: 'الاسم',
    passport: 'جواز السفر',
    nationality: 'الجنسية',
    birthDate: 'تاريخ الميلاد',
    adults: 'البالغون',
    children: 'الأطفال',
    totalPax: 'إجمالي الركاب',
    notes: 'الملاحظات',
    serviceDetails: 'تفاصيل الخدمة',
    status: 'الحالة',
    confirmed: 'مؤكد',
    cancelled: 'ملغي',
    new: 'جديد',
    termsConditions: 'الشروط والأحكام',
    footer: 'شكرا لاختياركم خدماتنا',
    page: 'صفحة',
  },
  turkish: {
    proposal: 'SEYAHAT TEKLİFİ',
    voucher: 'HİZMET KUPONU',
    reference: 'Referans',
    date: 'Tarih',
    agency: 'Acenta',
    salesPerson: 'Satış Temsilcisi',
    destinations: 'Destinasyonlar',
    contact: 'İletişim',
    email: 'E-posta',
    phone: 'Telefon',
    hotels: 'Oteller',
    transportation: 'Ulaşım',
    flights: 'Uçuşlar',
    rentACar: 'Araç Kiralama',
    additionalServices: 'Ek Hizmetler',
    hotel: 'Otel',
    destination: 'Destinasyon',
    checkin: 'Giriş',
    checkout: 'Çıkış',
    nights: 'Gece',
    rooms: 'Odalar',
    roomType: 'Oda Tipi',
    mealPlan: 'Pansiyon',
    pricePerNight: 'Gece Fiyatı',
    total: 'Toplam',
    vehicleType: 'Araç Tipi',
    numVehicles: 'Araçlar',
    days: 'Günler',
    pricePerDay: 'Günlük Fiyat',
    flightType: 'Uçuş Tipi',
    route: 'Güzergah',
    flightDate: 'Tarih',
    time: 'Saat',
    passengers: 'Yolcular',
    pricePerPax: 'Kişi Başı Fiyat',
    carType: 'Araç Tipi',
    pickupDate: 'Alış Tarihi',
    dropoffDate: 'Bırakış Tarihi',
    pickupLocation: 'Alış Yeri',
    dropoffLocation: 'Bırakış Yeri',
    serviceType: 'Hizmet Tipi',
    description: 'Açıklama',
    subtotal: 'Ara Toplam',
    margin: 'Kar Marjı',
    commission: 'Komisyon',
    grandTotal: 'Genel Toplam',
    guests: 'Misafirler',
    name: 'İsim',
    passport: 'Pasaport',
    nationality: 'Uyruk',
    birthDate: 'Doğum Tarihi',
    adults: 'Yetişkin',
    children: 'Çocuk',
    totalPax: 'Toplam Yolcu',
    notes: 'Notlar',
    serviceDetails: 'Hizmet Detayları',
    status: 'Durum',
    confirmed: 'Onaylandı',
    cancelled: 'İptal Edildi',
    new: 'Yeni',
    termsConditions: 'Şartlar ve Koşullar',
    footer: 'Hizmetlerimizi tercih ettiğiniz için teşekkür ederiz',
    page: 'Sayfa',
  },
};

const t = (key: string, lang: string = 'english'): string => {
  const language = lang.toLowerCase();
  return translations[language]?.[key] || translations.english[key] || key;
};

// Calculate nights between dates
const calculateNights = (checkin: string, checkout: string): number => {
  if (!checkin || !checkout) return 0;
  const start = new Date(checkin);
  const end = new Date(checkout);
  const diff = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// Format currency
const formatCurrency = (amount: number, currency: string): string => {
  const symbols: Record<string, string> = {
    usd: '$',
    eur: '€',
    gbp: '£',
    try: '₺',
    aed: 'AED',
    sar: 'SAR',
  };
  const symbol = symbols[currency.toLowerCase()] || currency.toUpperCase();
  return `${symbol} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Format date
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const generateProposalPDF = (
  proposal: Proposal,
  agency: Agency | undefined,
  salesPerson: User | undefined,
  destinations: (Destination | undefined)[],
  hotels: (Hotel | undefined)[],
  companyInfo: CompanyInfo | null,
  options: PDFGeneratorOptions = {}
): void => {
  const { language = proposal.pdfLanguage || 'english', showPricing = true } = options;
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Helper to add new page if needed
  const checkPageBreak = (requiredSpace: number = 20): void => {
    if (yPos + requiredSpace > pageHeight - 25) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Top right - Date
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0);
  const currentDate = new Date();
  const dateStr = `DATE : ${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;
  const timeStr = `TIME : ${currentDate.getHours()}:${String(currentDate.getMinutes()).padStart(2, '0')}`;
  doc.text(dateStr, pageWidth - margin, yPos, { align: 'right' });
  doc.text(timeStr, pageWidth - margin, yPos + 5, { align: 'right' });

  // Company Name (centered, bold)
  yPos = 35;
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(companyInfo?.name.toUpperCase() || 'TRAVEL COMPANY', pageWidth / 2, yPos, { align: 'center' });

  // "TRAVEL PROPOSAL" (centered)
  yPos += 8;
  doc.setFontSize(14);
  doc.setFont(undefined, 'italic');
  doc.text(t('proposal', language), pageWidth / 2, yPos, { align: 'center' });

  yPos += 15;

  // Reference and Basic Info
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text(`${t('reference', language)}: ${proposal.reference}`, margin, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(`${t('date', language)}: ${formatDate(proposal.createdAt)}`, margin + 80, yPos);
  
  yPos += 6;
  doc.text(`${t('status', language)}: ${t(proposal.status.toLowerCase(), language)}`, margin, yPos);
  
  yPos += 12;

  // Client Information
  doc.setFont(undefined, 'bold');
  doc.text(`${t('agency', language)}:`, margin, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(agency?.name || 'N/A', margin + 50, yPos);
  
  yPos += 6;
  doc.setFont(undefined, 'bold');
  doc.text(`${t('contact', language)}:`, margin, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(agency?.contactPerson || 'N/A', margin + 50, yPos);
  
  yPos += 6;
  doc.setFont(undefined, 'bold');
  doc.text(`${t('salesPerson', language)}:`, margin, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(salesPerson?.name || 'N/A', margin + 50, yPos);
  
  yPos += 10;

  // Destinations
  doc.setFont(undefined, 'bold');
  doc.text(`${t('destinations', language)}:`, margin, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(destinations.map(d => d?.name).filter(Boolean).join(', ') || 'N/A', margin + 50, yPos);
  
  yPos += 15;

  // Hotels Section
  if (proposal.hotels.length > 0) {
    checkPageBreak(30);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(t('hotels', language).toUpperCase(), margin, yPos);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
    
    yPos += 8;

    const hotelTableData = proposal.hotels.map((hotel) => {
      const hotelData = hotels.find(h => h?.id === hotel.hotelId);
      const nights = calculateNights(hotel.checkin, hotel.checkout);
      const total = nights * parseFloat(hotel.pricePerNight) * hotel.numRooms;
      
      return [
        hotelData?.name || 'N/A',
        formatDate(hotel.checkin),
        formatDate(hotel.checkout),
        nights.toString(),
        hotel.numRooms.toString(),
        hotel.roomType,
        hotel.mealPlan,
        showPricing ? formatCurrency(parseFloat(hotel.pricePerNight), hotel.currency) : '-',
        showPricing ? formatCurrency(total, hotel.currency) : '-',
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [[
        t('hotel', language),
        t('checkin', language),
        t('checkout', language),
        t('nights', language),
        t('rooms', language),
        t('roomType', language),
        t('mealPlan', language),
        t('pricePerNight', language),
        t('total', language),
      ]],
      body: hotelTableData,
      theme: 'plain',
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1, lineColor: [0, 0, 0] },
      styles: { fontSize: 8, cellPadding: 2, lineWidth: 0.1, lineColor: [200, 200, 200] },
      margin: { left: margin, right: margin },
    });

    yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPos + 10;
  }

  // Transportation Section
  if (proposal.transportation.length > 0) {
    checkPageBreak(30);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(t('transportation', language).toUpperCase(), margin, yPos);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
    
    yPos += 8;

    const transportTableData = proposal.transportation.map((transport) => {
      const total = parseFloat(transport.pricePerDay) * transport.numDays;
      
      return [
        transport.vehicleType,
        transport.numVehicles.toString(),
        transport.numDays.toString(),
        showPricing ? formatCurrency(parseFloat(transport.pricePerDay), transport.currency) : '-',
        showPricing ? formatCurrency(total, transport.currency) : '-',
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [[
        t('vehicleType', language),
        t('numVehicles', language),
        t('days', language),
        t('pricePerDay', language),
        t('total', language),
      ]],
      body: transportTableData,
      theme: 'plain',
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1, lineColor: [0, 0, 0] },
      styles: { fontSize: 8, cellPadding: 2, lineWidth: 0.1, lineColor: [200, 200, 200] },
      margin: { left: margin, right: margin },
    });

    yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPos + 10;
  }

  // Flights Section
  if (proposal.flights.length > 0) {
    checkPageBreak(30);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(t('flights', language).toUpperCase(), margin, yPos);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
    
    yPos += 8;

    const flightTableData = proposal.flights.map((flight) => {
      const total = parseFloat(flight.pricePerPax) * flight.pax;
      
      return [
        flight.flightType,
        `${flight.departure} → ${flight.arrival}`,
        formatDate(flight.date),
        flight.time,
        flight.pax.toString(),
        showPricing ? formatCurrency(parseFloat(flight.pricePerPax), flight.currency) : '-',
        showPricing ? formatCurrency(total, flight.currency) : '-',
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [[
        t('flightType', language),
        t('route', language),
        t('flightDate', language),
        t('time', language),
        t('passengers', language),
        t('pricePerPax', language),
        t('total', language),
      ]],
      body: flightTableData,
      theme: 'plain',
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1, lineColor: [0, 0, 0] },
      styles: { fontSize: 8, cellPadding: 2, lineWidth: 0.1, lineColor: [200, 200, 200] },
      margin: { left: margin, right: margin },
    });

    yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPos + 10;
  }

  // Rent-A-Car Section
  if (proposal.rentACar.length > 0) {
    checkPageBreak(30);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(t('rentACar', language).toUpperCase(), margin, yPos);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
    
    yPos += 8;

    const carTableData = proposal.rentACar.map((car) => {
      const total = parseFloat(car.pricePerDay) * car.numDays;
      
      return [
        car.carType,
        formatDate(car.pickupDate),
        formatDate(car.dropoffDate),
        car.numDays.toString(),
        car.numCars.toString(),
        showPricing ? formatCurrency(parseFloat(car.pricePerDay), car.currency) : '-',
        showPricing ? formatCurrency(total, car.currency) : '-',
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [[
        t('carType', language),
        t('pickupDate', language),
        t('dropoffDate', language),
        t('days', language),
        'Cars',
        t('pricePerDay', language),
        t('total', language),
      ]],
      body: carTableData,
      theme: 'plain',
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1, lineColor: [0, 0, 0] },
      styles: { fontSize: 8, cellPadding: 2, lineWidth: 0.1, lineColor: [200, 200, 200] },
      margin: { left: margin, right: margin },
    });

    yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPos + 10;
  }

  // Additional Services Section
  if (proposal.additionalServices.length > 0) {
    checkPageBreak(30);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(t('additionalServices', language).toUpperCase(), margin, yPos);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
    
    yPos += 8;

    const serviceTableData = proposal.additionalServices.map((service) => {
      const total = parseFloat(service.pricePerPax) * service.numPax * service.numDays;
      
      return [
        service.serviceType,
        service.description,
        formatDate(service.date),
        service.numDays.toString(),
        service.numPax.toString(),
        showPricing ? formatCurrency(parseFloat(service.pricePerPax), service.currency) : '-',
        showPricing ? formatCurrency(total, service.currency) : '-',
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [[
        t('serviceType', language),
        t('description', language),
        t('date', language),
        t('days', language),
        t('passengers', language),
        'Price/Pax',
        t('total', language),
      ]],
      body: serviceTableData,
      theme: 'plain',
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1, lineColor: [0, 0, 0] },
      styles: { fontSize: 8, cellPadding: 2, lineWidth: 0.1, lineColor: [200, 200, 200] },
      margin: { left: margin, right: margin },
    });

    yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPos + 10;
  }

  // Financial Summary
  if (showPricing) {
    checkPageBreak(20);
    
    const hotelTotal = proposal.hotels.reduce((sum, h) => {
      const nights = calculateNights(h.checkin, h.checkout);
      return sum + nights * parseFloat(h.pricePerNight) * h.numRooms;
    }, 0);
    
    const transportTotal = proposal.transportation.reduce((sum, t) => 
      sum + parseFloat(t.pricePerDay) * t.numDays, 0);
    
    const flightTotal = proposal.flights.reduce((sum, f) => 
      sum + parseFloat(f.pricePerPax) * f.pax, 0);
    
    const carTotal = proposal.rentACar.reduce((sum, c) => 
      sum + parseFloat(c.pricePerDay) * c.numDays, 0);
    
    const additionalTotal = proposal.additionalServices.reduce((sum, a) => 
      sum + parseFloat(a.pricePerPax) * a.numPax * a.numDays, 0);
    
    const subtotal = hotelTotal + transportTotal + flightTotal + carTotal + additionalTotal;
    const grandTotal = subtotal;

    doc.setLineWidth(0.5);
    doc.line(pageWidth - margin - 70, yPos, pageWidth - margin, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(t('subtotal', language), pageWidth - margin - 65, yPos);
    doc.text(formatCurrency(subtotal, proposal.displayCurrency), pageWidth - margin - 5, yPos, { align: 'right' });
    
    yPos += 8;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text(t('grandTotal', language), pageWidth - margin - 65, yPos);
    doc.text(formatCurrency(grandTotal, proposal.displayCurrency), pageWidth - margin - 5, yPos, { align: 'right' });
    
    yPos += 3;
    doc.setLineWidth(0.5);
    doc.line(pageWidth - margin - 70, yPos, pageWidth - margin, yPos);
  }

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    
    // Bottom line
    const footerY = pageHeight - 15;
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    
    // Contact info
    doc.setFont(undefined, 'normal');
    doc.text(
      `${companyInfo?.phone || 'Phone'} | ${companyInfo?.email || 'Email'} | ${companyInfo?.website || 'Website'}`,
      pageWidth / 2,
      footerY + 5,
      { align: 'center' }
    );
    doc.text(
      `${t('page', language)} ${i} / ${pageCount}`,
      pageWidth - margin,
      footerY + 5,
      { align: 'right' }
    );
  }

  // Save PDF
  doc.save(`proposal-${proposal.reference}.pdf`);
};

export const generateVoucherPDF = (
  voucher: Voucher,
  agency: Agency | undefined,
  salesPerson: User | undefined,
  companyInfo: CompanyInfo | null,
  language: string = 'english'
): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  let yPos = 15;

  // Top right - Date and Time
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  const currentDate = new Date();
  const dateStr = `DATE : ${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;
  const timeStr = `TIME : ${currentDate.getHours()}:${String(currentDate.getMinutes()).padStart(2, '0')}`;
  doc.text(dateStr, pageWidth - margin, yPos, { align: 'right' });
  doc.text(timeStr, pageWidth - margin, yPos + 5, { align: 'right' });

  // Company Name (centered, bold)
  yPos = 35;
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(companyInfo?.name.toUpperCase() || 'TRAVEL COMPANY', pageWidth / 2, yPos, { align: 'center' });

  // "HOTEL RESERVATION FORM" (centered, italic)
  yPos += 8;
  doc.setFontSize(14);
  doc.setFont(undefined, 'italic');
  doc.text('HOTEL RESERVATION FORM', pageWidth / 2, yPos, { align: 'center' });

  // Hotel Name (centered, bold)
  yPos += 8;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  const hotelName = getHotelName(voucher);
  doc.text(hotelName.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });

  // Operator/Agency location name
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  const locationName = getLocationName(voucher);
  doc.text(locationName.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });

  // Left column - Voucher No and Operator
  yPos += 15;
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text(`Voucher No:  ${voucher.id}`, margin, yPos);
  yPos += 6;
  doc.text('Operator :', margin, yPos);

  // Center - Status (large)
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  const statusText = voucher.status.replace('_', ' ');
  doc.text(statusText, pageWidth / 2, yPos - 3, { align: 'center' });

  // Booking details section
  yPos += 15;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');

  // Left section - Dates
  const serviceData = voucher.serviceData;
  let checkinDate = '';
  let checkoutDate = '';
  let nights = 0;

  if (serviceData) {
    if (serviceData.checkin) checkinDate = serviceData.checkin;
    if (serviceData.checkout) checkoutDate = serviceData.checkout;
    if (serviceData.nights) nights = serviceData.nights;
  }

  doc.setFont(undefined, 'bold');
  doc.text('1.', margin, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(`C/in Date :${checkinDate || 'N/A'}`, margin + 10, yPos);
  yPos += 6;
  doc.text(`C/Out Date :${checkoutDate || 'N/A'}`, margin + 10, yPos);
  yPos += 6;
  doc.text(`Day :${nights}`, margin + 10, yPos);

  // Center section - Room details
  const centerX = pageWidth / 2 - 20;
  yPos -= 12;
  doc.text(`Room Count :${serviceData?.numRooms || 1}`, centerX, yPos);
  yPos += 6;
  doc.text(`Room :${serviceData?.roomType || 'DBL'}`, centerX, yPos);
  yPos += 6;
  doc.text(`Room Type :${getRoomCategory(serviceData)}`, centerX, yPos);
  yPos += 6;
  doc.text(`Board :${serviceData?.boardType || 'BB'}`, centerX, yPos);

  // Right section - Passenger details
  const rightX = pageWidth - margin - 50;
  yPos -= 18;
  doc.text(`Adult :${voucher.adults}`, rightX, yPos, { align: 'right' });
  yPos += 6;
  doc.text(`Ext. Bed :`, rightX, yPos, { align: 'right' });
  yPos += 6;
  doc.text(`Child :${voucher.children}`, rightX, yPos, { align: 'right' });
  yPos += 6;
  doc.text(`Infant :`, rightX, yPos, { align: 'right' });
  yPos += 6;
  doc.text(`Total Pax :${voucher.totalPax}`, rightX, yPos, { align: 'right' });

  // NOTE section
  yPos += 10;
  doc.setFont(undefined, 'bold');
  doc.text('NOTE :', margin, yPos);
  doc.setFont(undefined, 'normal');
  if (voucher.notes) {
    yPos += 6;
    const splitNotes = doc.splitTextToSize(voucher.notes, pageWidth - 2 * margin);
    doc.text(splitNotes, margin, yPos);
    yPos += splitNotes.length * 5;
  }

  // Guest table
  yPos += 10;
  const tableStartY = yPos;
  
  // Table headers
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  const col1 = margin;
  const col2 = margin + 60;
  const col3 = margin + 80;
  const col4 = margin + 120;
  const col5 = margin + 145;
  const col6 = margin + 170;
  
  doc.text('SURNAME, NAME', col1, yPos);
  doc.text('AGE', col2, yPos);
  doc.text('ARRIV POINT', col3, yPos);
  doc.text('TIME', col4, yPos);
  doc.text('DEPAR.POINT', col5, yPos);
  doc.text('SAAT', col6, yPos);
  
  yPos += 6;
  
  // Guest rows
  doc.setFont(undefined, 'normal');
  if (voucher.guests && voucher.guests.length > 0) {
    voucher.guests.forEach((guest, index) => {
      const age = calculateAge(guest.birthDate);
      doc.text(`${guest.firstName} ${guest.lastName}`, col1, yPos);
      doc.text(age.toString(), col2, yPos);
      yPos += 6;
    });
  } else {
    doc.text('No guests listed', col1, yPos);
    yPos += 6;
  }

  // Bottom line
  yPos = pageHeight - 40;
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // Footer - Contact info
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text(`CEP: ${companyInfo?.phone || '+90XXXXXXXXXX'}`, margin, yPos);
  yPos += 6;
  doc.text(`EMAIL: ${companyInfo?.email || 'info@company.com'}`, margin, yPos);

  // Save PDF
  doc.save(`voucher-${voucher.id}.pdf`);
};

// Helper functions
function getHotelName(voucher: Voucher): string {
  const serviceData = voucher.serviceData;
  if (serviceData && serviceData.hotelId) {
    // In a real scenario, you'd fetch hotel name from context
    return 'HOTEL NAME';
  }
  return 'HOTEL RESERVATION';
}

function getLocationName(voucher: Voucher): string {
  const serviceData = voucher.serviceData;
  if (serviceData && serviceData.destinationId) {
    // In a real scenario, you'd fetch destination name from context
    return 'LOCATION';
  }
  return '';
}

function getRoomCategory(serviceData: any): string {
  if (!serviceData || !serviceData.roomType) return 'STANDARD';
  const roomType = serviceData.roomType.toUpperCase();
  if (roomType.includes('SUPERIOR') || roomType.includes('DELUXE')) return 'SUPERIOR';
  if (roomType.includes('SUITE')) return 'SUITE';
  return 'STANDARD';
}

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Colorful Modern Voucher PDF Generator
export const generateColorfulVouchersPDF = (
  vouchers: Voucher[],
  proposal: Proposal,
  agency: Agency | undefined,
  salesPerson: User | undefined,
  hotels: Hotel[],
  destinations: Destination[],
  companyInfo: CompanyInfo | null,
  language: string = 'english'
): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Color palette
  const colors = {
    primary: [41, 128, 185],      // Blue
    secondary: [243, 156, 18],     // Orange
    success: [46, 204, 113],       // Green
    danger: [231, 76, 60],         // Red
    warning: [241, 196, 15],       // Yellow
    info: [52, 152, 219],          // Light Blue
    purple: [155, 89, 182],        // Purple
    pink: [236, 64, 122],          // Pink
    teal: [26, 188, 156],          // Teal
  };

  vouchers.forEach((voucher, voucherIndex) => {
    if (voucherIndex > 0) {
      doc.addPage();
    }

    let yPos = 10;

    // Decorative circles in corners (very transparent)
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setGState(new doc.GState({ opacity: 0.03 }));
    doc.circle(10, 10, 30, 'F');
    doc.circle(pageWidth - 10, 10, 25, 'F');
    doc.circle(10, pageHeight - 10, 20, 'F');
    doc.circle(pageWidth - 10, pageHeight - 10, 35, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));

    // Header with gradient effect
    const headerHeight = 45;
    for (let i = 0; i < headerHeight; i++) {
      const opacity = 1 - (i / headerHeight) * 0.4;
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setGState(new doc.GState({ opacity: opacity }));
      doc.rect(0, i, pageWidth, 1, 'F');
    }
    doc.setGState(new doc.GState({ opacity: 1 }));

    // Company name
    yPos = 15;
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text(companyInfo?.name.toUpperCase() || 'TRAVEL COMPANY', pageWidth / 2, yPos, { align: 'center' });

    // Voucher title
    yPos += 8;
    doc.setFontSize(12);
    doc.setFont(undefined, 'italic');
    doc.text('SERVICE VOUCHER', pageWidth / 2, yPos, { align: 'center' });

    // Voucher number badge
    yPos += 10;
    const badgeWidth = 60;
    const badgeX = pageWidth / 2 - badgeWidth / 2;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(badgeX, yPos - 5, badgeWidth, 10, 2, 2, 'F');
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(`VOUCHER #${voucher.id}`, pageWidth / 2, yPos, { align: 'center' });

    yPos = headerHeight + 8;

    // Status badge
    const statusColors: Record<string, number[]> = {
      'PENDING_PAYMENT': colors.warning,
      'PAID': colors.teal,
      'COMPLETED': colors.success,
      'CANCELLED': colors.danger,
    };
    const statusColor = statusColors[voucher.status] || colors.info;
    
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(margin, yPos, 45, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text(voucher.status.replace('_', ' '), margin + 22.5, yPos + 5.5, { align: 'center' });

    // Reference number (top right)
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text(`Ref: ${voucher.proposalReference}`, pageWidth - margin, yPos + 5, { align: 'right' });

    yPos += 15;

    // Agency Section
    doc.setFillColor(colors.info[0], colors.info[1], colors.info[2]);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('AGENCY INFORMATION', margin + 3, yPos + 5.5);

    yPos += 12;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(agency?.name || 'N/A', margin + 3, yPos);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    yPos += 5;
    doc.text(`Contact: ${agency?.contactPerson || 'N/A'}`, margin + 3, yPos);
    yPos += 5;
    doc.text(`Sales Person: ${salesPerson?.name || 'N/A'}`, margin + 3, yPos);

    yPos += 15;

    // Service Details Section
    const serviceData = voucher.serviceData;
    const hotel = hotels.find(h => h.id === serviceData?.hotelId);
    const destination = destinations.find(d => d.id === serviceData?.destinationId);

    doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('SERVICE DETAILS', margin + 3, yPos + 5.5);

    yPos += 12;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(hotel?.name || 'Hotel Service', margin + 3, yPos);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'italic');
    doc.setTextColor(100, 100, 100);
    yPos += 5;
    doc.text(destination?.name || '', margin + 3, yPos);

    yPos += 12;

    // Booking Details Cards
    const cardWidth = (pageWidth - 2 * margin - 8) / 3;
    const card1X = margin;
    const card2X = margin + cardWidth + 4;
    const card3X = margin + 2 * (cardWidth + 4);

    // Card 1 - Dates (Green)
    doc.setFillColor(colors.success[0], colors.success[1], colors.success[2]);
    doc.setGState(new doc.GState({ opacity: 0.08 }));
    doc.roundedRect(card1X, yPos, cardWidth, 32, 2, 2, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));
    doc.setDrawColor(colors.success[0], colors.success[1], colors.success[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(card1X, yPos, cardWidth, 32, 2, 2, 'S');

    doc.setTextColor(colors.success[0], colors.success[1], colors.success[2]);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text('CHECK-IN', card1X + cardWidth / 2, yPos + 6, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(serviceData?.checkin ? formatDate(serviceData.checkin) : 'N/A', card1X + cardWidth / 2, yPos + 13, { align: 'center' });

    doc.setTextColor(colors.success[0], colors.success[1], colors.success[2]);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text('CHECK-OUT', card1X + cardWidth / 2, yPos + 20, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(serviceData?.checkout ? formatDate(serviceData.checkout) : 'N/A', card1X + cardWidth / 2, yPos + 27, { align: 'center' });

    // Card 2 - Room Details (Purple)
    doc.setFillColor(colors.purple[0], colors.purple[1], colors.purple[2]);
    doc.setGState(new doc.GState({ opacity: 0.08 }));
    doc.roundedRect(card2X, yPos, cardWidth, 32, 2, 2, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));
    doc.setDrawColor(colors.purple[0], colors.purple[1], colors.purple[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(card2X, yPos, cardWidth, 32, 2, 2, 'S');

    doc.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text('ACCOMMODATION', card2X + cardWidth / 2, yPos + 6, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(`${serviceData?.numRooms || 1} x ${serviceData?.roomType || 'DBL'}`, card2X + cardWidth / 2, yPos + 13, { align: 'center' });
    doc.text(`${serviceData?.nights || 0} Nights`, card2X + cardWidth / 2, yPos + 19, { align: 'center' });
    
    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.text(serviceData?.boardType || 'BB', card2X + cardWidth / 2, yPos + 26, { align: 'center' });

    // Card 3 - Passengers (Pink)
    doc.setFillColor(colors.pink[0], colors.pink[1], colors.pink[2]);
    doc.setGState(new doc.GState({ opacity: 0.08 }));
    doc.roundedRect(card3X, yPos, cardWidth, 32, 2, 2, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));
    doc.setDrawColor(colors.pink[0], colors.pink[1], colors.pink[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(card3X, yPos, cardWidth, 32, 2, 2, 'S');

    doc.setTextColor(colors.pink[0], colors.pink[1], colors.pink[2]);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text('PASSENGERS', card3X + cardWidth / 2, yPos + 6, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(`Adults: ${voucher.adults}`, card3X + cardWidth / 2, yPos + 13, { align: 'center' });
    doc.text(`Children: ${voucher.children}`, card3X + cardWidth / 2, yPos + 19, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: ${voucher.totalPax}`, card3X + cardWidth / 2, yPos + 26, { align: 'center' });

    yPos += 40;

    // Guest List Section
    if (voucher.guests && voucher.guests.length > 0) {
      doc.setFillColor(colors.teal[0], colors.teal[1], colors.teal[2]);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('GUEST LIST', margin + 3, yPos + 5.5);

      yPos += 12;

      const guestTableData = voucher.guests.map((guest) => [
        `${guest.firstName} ${guest.lastName}`,
        calculateAge(guest.birthDate).toString(),
        guest.nationality,
        guest.passportNumber,
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Name', 'Age', 'Nationality', 'Passport Number']],
        body: guestTableData,
        theme: 'striped',
        headStyles: { 
          fillColor: [colors.teal[0], colors.teal[1], colors.teal[2]], 
          fontSize: 9,
          fontStyle: 'bold',
          textColor: [255, 255, 255],
        },
        styles: { 
          fontSize: 8, 
          cellPadding: 3,
          lineColor: [220, 220, 220],
          lineWidth: 0.1,
        },
        alternateRowStyles: {
          fillColor: [245, 250, 252],
        },
        margin: { left: margin, right: margin },
      });

      yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : yPos + 12;
    }

    // Notes Section
    if (voucher.notes) {
      // Check if we need a new page for notes
      if (yPos + 30 > pageHeight - 35) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFillColor(colors.warning[0], colors.warning[1], colors.warning[2]);
      doc.setGState(new doc.GState({ opacity: 0.15 }));
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 28, 2, 2, 'F');
      doc.setGState(new doc.GState({ opacity: 1 }));
      doc.setDrawColor(colors.warning[0], colors.warning[1], colors.warning[2]);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 28, 2, 2, 'S');

      doc.setTextColor(colors.warning[0] - 60, colors.warning[1] - 60, colors.warning[2] - 60);
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text('IMPORTANT NOTES', margin + 3, yPos + 6);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      const splitNotes = doc.splitTextToSize(voucher.notes, pageWidth - 2 * margin - 6);
      doc.text(splitNotes, margin + 3, yPos + 12);

      yPos += 32;
    }

    // Footer
    const footerY = pageHeight - 25;
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setGState(new doc.GState({ opacity: 0.08 }));
    doc.rect(0, footerY, pageWidth, 25, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));

    doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text(companyInfo?.name || 'Travel Company', pageWidth / 2, footerY + 6, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.text(
      `${companyInfo?.phone || 'Phone'} | ${companyInfo?.email || 'Email'} | ${companyInfo?.website || 'Website'}`,
      pageWidth / 2,
      footerY + 11,
      { align: 'center' }
    );

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.text(
      `Page ${voucherIndex + 1} of ${vouchers.length}`,
      pageWidth / 2,
      footerY + 16,
      { align: 'center' }
    );
  });

  // Save PDF
  const timestamp = new Date().getTime();
  doc.save(`vouchers-${proposal.reference}-${timestamp}.pdf`);
};
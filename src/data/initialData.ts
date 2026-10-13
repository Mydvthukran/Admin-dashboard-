import type {
  User,
  KYCDocument,
  Banner,
  ServiceCategory,
  ServiceListing,
  StaticContentPage,
  FAQItem,
  PaymentTransaction,
  RefundRequest,
  FailedTransaction,
  CommissionSettlement,
  OfferCoupon,
  Announcement,
  AdminRole,
  AdminUser,
  AuditLog
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_001',
    name: 'Debashis Banerjee',
    email: 'debashis.b@gmail.com',
    phone: '+91 98301 24590',
    role: 'customer',
    status: 'active',
    location: 'Salt Lake, Sector V, Kolkata',
    city: 'Kolkata',
    joinedDate: '2025-11-12',
    totalBookings: 14,
    walletBalance: 450
  },
  {
    id: 'usr_002',
    name: 'Subhashish Roy',
    email: 'subhash.ac@punchxpro.in',
    phone: '+91 94330 88211',
    role: 'professional',
    status: 'active',
    location: 'Baguiati, Kolkata',
    city: 'Kolkata',
    joinedDate: '2025-08-19',
    totalBookings: 86,
    rating: 4.85,
    walletBalance: 12400,
    tier: 'Gold',
    serviceCategory: 'Repairs and installations'
  },
  {
    id: 'usr_003',
    name: 'Priyanka Mukherjee',
    email: 'priyanka.mukh@yahoo.co.in',
    phone: '+91 98314 99012',
    role: 'customer',
    status: 'active',
    location: 'Ballygunge Circular Rd, Kolkata',
    city: 'Kolkata',
    joinedDate: '2026-01-05',
    totalBookings: 8,
    walletBalance: 120
  },
  {
    id: 'usr_004',
    name: 'Tapan Karmakar',
    email: 'tapan.plumb@gmail.com',
    phone: '+91 97321 44589',
    role: 'professional',
    status: 'pending_verification',
    location: 'Dhananjay Sarani, Nabadwip',
    city: 'Nabadwip',
    joinedDate: '2026-03-28',
    totalBookings: 3,
    rating: 4.6,
    walletBalance: 1850,
    tier: 'Bronze',
    serviceCategory: 'Electrical and plumbing'
  },
  {
    id: 'usr_005',
    name: 'Rahul Sen',
    email: 'rahul.sen.kol@gmail.com',
    phone: '+91 98366 12389',
    role: 'customer',
    status: 'blocked',
    location: 'New Town Action Area I, Kolkata',
    city: 'Kolkata',
    joinedDate: '2025-10-02',
    totalBookings: 1,
    walletBalance: 0,
    blockReason: 'Repeated abusive behavior toward home salon service professional & false cancellation chargebacks.',
    blockedAt: '2026-02-14 18:30',
    blockedBy: 'Amitava Sen (Super Admin)'
  },
  {
    id: 'usr_006',
    name: 'Anjali Sharma',
    email: 'anjali.salon@punchxpro.in',
    phone: '+91 98745 61234',
    role: 'professional',
    status: 'active',
    location: 'Alipore, Kolkata',
    city: 'Kolkata',
    joinedDate: '2025-09-14',
    totalBookings: 112,
    rating: 4.92,
    walletBalance: 24600,
    tier: 'Platinum',
    serviceCategory: 'Beauty and personal care'
  },
  {
    id: 'usr_007',
    name: 'Soumitra Ghosh',
    email: 'soumitra.ghosh@outlook.com',
    phone: '+91 98305 77123',
    role: 'customer',
    status: 'active',
    location: 'Garia Station Rd, Kolkata',
    city: 'Kolkata',
    joinedDate: '2026-02-11',
    totalBookings: 5,
    walletBalance: 50
  },
  {
    id: 'usr_008',
    name: 'Biswajit Paul',
    email: 'biswajit.p@gmail.com',
    phone: '+91 98322 99401',
    role: 'professional',
    status: 'blocked',
    location: 'Howrah Maidan, Howrah',
    city: 'Howrah',
    joinedDate: '2025-11-20',
    totalBookings: 24,
    rating: 3.2,
    walletBalance: 420,
    tier: 'Bronze',
    serviceCategory: 'Electrical and plumbing',
    blockReason: 'Severe customer complaints: Demanded offline cash payments without booking on platform and failed background check.',
    blockedAt: '2026-03-01 11:15',
    blockedBy: 'Soumen Roy (Operations Admin)'
  },
  {
    id: 'usr_009',
    name: 'Mousumi Chatterjee',
    email: 'mousumi.c@rediffmail.com',
    phone: '+91 94331 55678',
    role: 'customer',
    status: 'active',
    location: 'Behala Chowrasta, Kolkata',
    city: 'Kolkata',
    joinedDate: '2025-12-19',
    totalBookings: 19,
    walletBalance: 800
  },
  {
    id: 'usr_010',
    name: 'Prabir Das',
    email: 'prabir.ac@gmail.com',
    phone: '+91 91632 88471',
    role: 'professional',
    status: 'pending_verification',
    location: 'Teghoria, Rajarhat, Kolkata',
    city: 'Kolkata',
    joinedDate: '2026-04-01',
    totalBookings: 0,
    walletBalance: 0,
    tier: 'Bronze',
    serviceCategory: 'Repairs and installations'
  },
  {
    id: 'usr_011',
    name: 'Sneha Roy Chowdhury',
    email: 'sneha.rc@gmail.com',
    phone: '+91 98311 00293',
    role: 'customer',
    status: 'active',
    location: 'Shyambazar, Kolkata',
    city: 'Kolkata',
    joinedDate: '2026-01-22',
    totalBookings: 6,
    walletBalance: 200
  },
  {
    id: 'usr_012',
    name: 'Kartik Adhikary',
    email: 'kartik.adhikary@punchxpro.in',
    phone: '+91 98328 11490',
    role: 'professional',
    status: 'active',
    location: 'Prachin Mayapur, Nabadwip',
    city: 'Nabadwip',
    joinedDate: '2025-10-10',
    totalBookings: 47,
    rating: 4.78,
    walletBalance: 8900,
    tier: 'Silver',
    serviceCategory: 'Cleaning and home care'
  }
];

export const INITIAL_KYC_DOCS: KYCDocument[] = [
  {
    id: 'kyc_001',
    userId: 'usr_004',
    userName: 'Tapan Karmakar',
    userPhone: '+91 97321 44589',
    serviceCategory: 'Electrical and plumbing',
    experienceYears: 7,
    location: 'Dhananjay Sarani, Nabadwip',
    docType: 'Aadhaar',
    docNumber: 'XXXX-XXXX-4812',
    docFileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    submittedAt: '2026-03-29 14:15',
    status: 'pending'
  },
  {
    id: 'kyc_002',
    userId: 'usr_010',
    userName: 'Prabir Das',
    userPhone: '+91 91632 88471',
    serviceCategory: 'Repairs and installations',
    experienceYears: 5,
    location: 'Teghoria, Rajarhat, Kolkata',
    docType: 'Skill Certificate',
    docNumber: 'ITI-AC-WB-2019-902',
    docFileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    submittedAt: '2026-04-01 10:45',
    status: 'pending'
  },
  {
    id: 'kyc_003',
    userId: 'usr_002',
    userName: 'Subhashish Roy',
    userPhone: '+91 94330 88211',
    serviceCategory: 'Repairs and installations',
    experienceYears: 10,
    location: 'Baguiati, Kolkata',
    docType: 'Trade License',
    docNumber: 'KMC-TRD-2023-8819',
    docFileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    submittedAt: '2025-08-20 11:00',
    status: 'verified',
    reviewedBy: 'Amitava Sen',
    reviewedAt: '2025-08-21 16:40'
  },
  {
    id: 'kyc_004',
    userId: 'usr_006',
    userName: 'Anjali Sharma',
    userPhone: '+91 98745 61234',
    serviceCategory: 'Beauty and personal care',
    experienceYears: 6,
    location: 'Alipore, Kolkata',
    docType: 'Skill Certificate',
    docNumber: 'VLCC-DIP-2018-441',
    docFileUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    submittedAt: '2025-09-15 09:30',
    status: 'verified',
    reviewedBy: 'Soumen Roy',
    reviewedAt: '2025-09-16 14:10'
  },
  {
    id: 'kyc_005',
    userId: 'usr_013',
    userName: 'Ranjan Barman',
    userPhone: '+91 98319 77800',
    serviceCategory: 'Home improvement',
    experienceYears: 4,
    location: 'Kasba, Kolkata',
    docType: 'Aadhaar',
    docNumber: 'XXXX-XXXX-9931',
    docFileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    submittedAt: '2026-03-15 16:20',
    status: 'rejected',
    reviewedBy: 'Amitava Sen',
    reviewedAt: '2026-03-16 11:00',
    rejectionReason: 'Aadhaar photo is completely blurred and name does not match bank account passbook name.'
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'ban_001',
    title: 'Pre-Summer AC Servicing & Gas Refill',
    subtitle: 'Flat ₹200 OFF with 30-Day Cooling Warranty | Certified Technicians',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    targetCategory: 'Repairs and installations',
    badgeText: 'HOT OFFER',
    placement: 'hero_carousel',
    startDate: '2026-03-01',
    endDate: '2026-06-30',
    isActive: true,
    clicks: 1420
  },
  {
    id: 'ban_002',
    title: 'Trusted Home Deep Cleaning in Kolkata',
    subtitle: 'Professional team with hospital-grade sanitisation & vacuum equipment',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    targetCategory: 'Cleaning and home care',
    badgeText: 'POPULAR',
    placement: 'hero_carousel',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    clicks: 980
  },
  {
    id: 'ban_003',
    title: 'Nabadwip Geofence Expansion Special',
    subtitle: 'Now live in Nabadwip! First service free platform fee code NABADWIP100',
    imageUrl: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=1200&q=80',
    targetCategory: 'Electrical and plumbing',
    badgeText: 'NEW CITY',
    placement: 'mid_feed',
    startDate: '2026-03-15',
    endDate: '2026-05-15',
    isActive: true,
    clicks: 412
  },
  {
    id: 'ban_004',
    title: 'Salon & Spa at Home for Women',
    subtitle: 'Trained female beauticians with sealed disposable kits for safety',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    targetCategory: 'Beauty and personal care',
    badgeText: 'PREMIUM',
    placement: 'category_header',
    startDate: '2026-02-01',
    endDate: '2026-08-31',
    isActive: false,
    clicks: 654
  }
];

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat_01',
    name: 'Electrical and plumbing',
    slug: 'electrical-plumbing',
    iconName: 'Zap',
    description: 'Electrical repairs, wiring, short circuit fixes, taps, pipes, sanitary fittings and drainage.',
    serviceCount: 14,
    commissionRate: 12,
    isActive: true,
    geofenceAvailability: ['Kolkata', 'Nabadwip', 'All West Bengal'],
    orderPriority: 1
  },
  {
    id: 'cat_02',
    name: 'Repairs and installations',
    slug: 'repairs-installations',
    iconName: 'Wrench',
    description: 'Carpentry, appliance repairs, split/window AC servicing, RO water purifiers, washing machine fixes.',
    serviceCount: 22,
    commissionRate: 15,
    isActive: true,
    geofenceAvailability: ['Kolkata', 'Nabadwip', 'All West Bengal'],
    orderPriority: 2
  },
  {
    id: 'cat_03',
    name: 'Devices and technology',
    slug: 'devices-technology',
    iconName: 'Smartphone',
    description: 'Mobile screen replacement, laptop troubleshooting, TV mounting, CCTV surveillance, Wi-Fi router setup.',
    serviceCount: 10,
    commissionRate: 14,
    isActive: true,
    geofenceAvailability: ['Kolkata', 'All West Bengal'],
    orderPriority: 3
  },
  {
    id: 'cat_04',
    name: 'Cleaning and home care',
    slug: 'cleaning-home-care',
    iconName: 'Sparkles',
    description: 'Full house deep cleaning, kitchen & bathroom degreasing, sofa shampooing, termite & pest control.',
    serviceCount: 16,
    commissionRate: 18,
    isActive: true,
    geofenceAvailability: ['Kolkata', 'Nabadwip', 'All West Bengal'],
    orderPriority: 4
  },
  {
    id: 'cat_05',
    name: 'Home improvement',
    slug: 'home-improvement',
    iconName: 'Paintbrush',
    description: 'Interior & exterior painting, wall putty, tile masonry, roof waterproofing, false ceilings, grill welding.',
    serviceCount: 12,
    commissionRate: 10,
    isActive: true,
    geofenceAvailability: ['Kolkata', 'All West Bengal'],
    orderPriority: 5
  },
  {
    id: 'cat_06',
    name: 'Beauty and personal care',
    slug: 'beauty-personal-care',
    iconName: 'Heart',
    description: 'At-home salon, waxing, facial, bridal grooming, relaxing head massage, manicure & pedicure.',
    serviceCount: 18,
    commissionRate: 20,
    isActive: true,
    geofenceAvailability: ['Kolkata', 'All West Bengal'],
    orderPriority: 6
  },
  {
    id: 'cat_07',
    name: 'Clothing and personal items',
    slug: 'clothing-personal-items',
    iconName: 'Scissors',
    description: 'Doorstep custom tailoring, blouse alteration, steam ironing, shoe restoration, luxury bag repair.',
    serviceCount: 8,
    commissionRate: 12,
    isActive: true,
    geofenceAvailability: ['Kolkata'],
    orderPriority: 7
  },
  {
    id: 'cat_08',
    name: 'Household and outdoor help',
    slug: 'household-help',
    iconName: 'Users',
    description: 'Verified cooks, domestic help, elderly companion care, balcony gardening, lawn maintenance.',
    serviceCount: 9,
    commissionRate: 10,
    isActive: true,
    geofenceAvailability: ['Kolkata', 'Nabadwip'],
    orderPriority: 8
  },
  {
    id: 'cat_09',
    name: 'Moving and local assistance',
    slug: 'moving-local-assistance',
    iconName: 'Truck',
    description: 'Packers & movers within Kolkata & Bengal, mini truck booking, urgent courier, local errand runner.',
    serviceCount: 7,
    commissionRate: 12,
    isActive: true,
    geofenceAvailability: ['Kolkata', 'Nabadwip', 'All West Bengal'],
    orderPriority: 9
  },
  {
    id: 'cat_10',
    name: 'Events and lifestyle',
    slug: 'events-lifestyle',
    iconName: 'Camera',
    description: 'Event photography, cinematic wedding video, catering staff, balloon decoration, sound & DJ console.',
    serviceCount: 11,
    commissionRate: 15,
    isActive: true,
    geofenceAvailability: ['Kolkata'],
    orderPriority: 10
  }
];

export const INITIAL_LISTINGS: ServiceListing[] = [
  {
    id: 'lst_001',
    categoryId: 'cat_02',
    categoryName: 'Repairs and installations',
    title: 'Split AC Comprehensive Jet Service',
    basePrice: 599,
    durationMinutes: 60,
    description: 'High-pressure water jet cleaning of indoor cooling coils and outdoor condenser, filter deep wash, gas check.',
    features: ['High pressure jet pump', '30 days cooling guarantee', 'Gas pressure audit included'],
    warrantyDays: 30,
    rating: 4.88,
    reviewsCount: 312,
    isActive: true,
    popularityScore: 98
  },
  {
    id: 'lst_002',
    categoryId: 'cat_01',
    categoryName: 'Electrical and plumbing',
    title: 'Ceiling Fan Installation & Regulator Repair',
    basePrice: 199,
    durationMinutes: 30,
    description: 'Safe mounting, wiring balance check, anchor bolt inspection, capacitor testing, speed test.',
    features: ['Safety tested', 'Noise check included', 'PunchX verified pro'],
    warrantyDays: 15,
    rating: 4.79,
    reviewsCount: 184,
    isActive: true,
    popularityScore: 89
  },
  {
    id: 'lst_003',
    categoryId: 'cat_04',
    categoryName: 'Cleaning and home care',
    title: 'Complete 2BHK Deep Home Cleaning',
    basePrice: 2499,
    durationMinutes: 240,
    description: 'End-to-end sanitisation of 2 bedrooms, hall, kitchen grease scrubbing, bathroom descaling, balcony sweep.',
    features: ['3 expert cleaners', 'German vacuum tech', 'Eco-friendly chemical solutions'],
    warrantyDays: 7,
    rating: 4.91,
    reviewsCount: 420,
    isActive: true,
    popularityScore: 95
  },
  {
    id: 'lst_004',
    categoryId: 'cat_01',
    categoryName: 'Electrical and plumbing',
    title: 'Bathroom Pipeline & Tap Leakage Fix',
    basePrice: 249,
    durationMinutes: 45,
    description: 'Diagnose concealed leaks, replace worn washers, Teflon tape sealing, water pressure balance check.',
    features: ['Instant leak detection', 'Genuine spare parts assistance', 'Clean cleanup post repair'],
    warrantyDays: 15,
    rating: 4.65,
    reviewsCount: 98,
    isActive: true,
    popularityScore: 78
  },
  {
    id: 'lst_005',
    categoryId: 'cat_06',
    categoryName: 'Beauty and personal care',
    title: 'Glow Facial & Ayurvedic Head Massage',
    basePrice: 899,
    durationMinutes: 75,
    description: 'Organic fruit scrub, steam extraction, golden glow mask, followed by soothing 25-min acupressure head massage.',
    features: ['Sealed disposable kit', 'Branded salon products', 'Female beautician strictly for women'],
    warrantyDays: 0,
    rating: 4.95,
    reviewsCount: 230,
    isActive: true,
    popularityScore: 92
  },
  {
    id: 'lst_006',
    categoryId: 'cat_02',
    categoryName: 'Repairs and installations',
    title: 'RO Water Purifier Filter & Membrane Replacement',
    basePrice: 450,
    durationMinutes: 50,
    description: 'Sediment, Carbon and RO membrane health check, TDS meter testing before and after, pump vibration analysis.',
    features: ['Digital TDS reading', 'Food grade pipes', 'Genuine filter cartridge guidance'],
    warrantyDays: 30,
    rating: 4.82,
    reviewsCount: 145,
    isActive: true,
    popularityScore: 84
  }
];

export const INITIAL_STATIC_PAGES: StaticContentPage[] = [
  {
    id: 'pg_01',
    slug: 'terms-and-conditions',
    title: 'Terms of Service & Platform Agreement',
    lastUpdated: '2026-03-20',
    updatedBy: 'Amitava Sen (Legal)',
    sections: [
      {
        title: '1. Introduction and Platform Role',
        content: 'PunchX operates as an intermediary technology marketplace connecting end-user customers with independent local service professionals across Kolkata and West Bengal. PunchX does not directly employ service professionals unless explicitly specified.'
      },
      {
        title: '2. Booking, Pricing and Invoicing',
        content: 'Prices displayed on PunchX are indicative base rates. Any additional spare parts, consumables, or unforeseen heavy masonry work will be quoted transparently by the professional and confirmed via the app before work commences.'
      },
      {
        title: '3. Cancellation and Rescheduling',
        content: 'Customers may cancel free of charge up to 2 hours before the scheduled appointment window. Cancellations after a professional has departed may incur a nominal conveyance fee of ₹100 credited directly to the service professional.'
      }
    ]
  },
  {
    id: 'pg_02',
    slug: 'privacy-policy',
    title: 'User Data Privacy & Security Policy',
    lastUpdated: '2026-02-18',
    updatedBy: 'Pooja Dutta (Security Lead)',
    sections: [
      {
        title: '1. Data Collection',
        content: 'We collect name, verified phone number, delivery/service address, device identifiers, and approximate GPS coordinates only to facilitate seamless service matching within authorized geofences (Kolkata & Nabadwip).'
      },
      {
        title: '2. Payment Security',
        content: 'All electronic transactions are processed through RBI-authorized payment gateways (Razorpay). PunchX servers never store customer credit card CVVs, netbanking PINs, or UPI passcodes.'
      }
    ]
  },
  {
    id: 'pg_03',
    slug: 'safety-guidelines',
    title: 'Safety Guidelines & KYC Charter for Professionals',
    lastUpdated: '2026-01-10',
    updatedBy: 'Operations Safety Cell',
    sections: [
      {
        title: '1. Identity & Police Verification',
        content: 'Every professional must clear government ID verification (Aadhaar/Voter ID) and possess valid trade licenses where required before being assigned home service orders.'
      },
      {
        title: '2. Code of Conduct',
        content: 'Strict zero-tolerance policy towards harassment, off-platform cash extortion, or unauthorized third-party helpers. Violations lead to immediate permanent blacklisting.'
      }
    ]
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq_01',
    category: 'Customer',
    question: 'How do I know my service professional is verified?',
    answer: 'Every PunchX verified professional wears an in-app verification badge, has undergone Aadhaar verification and skill screening, and shows a unique PunchX 4-digit security code upon arrival.',
    order: 1
  },
  {
    id: 'faq_02',
    category: 'Payments',
    question: 'Is it safe to pay online via Razorpay on PunchX?',
    answer: 'Yes! We use 256-bit SSL encrypted Razorpay rails with instant UPI, card, and netbanking support. Your money is held in escrow until the job OTP is confirmed.',
    order: 2
  },
  {
    id: 'faq_03',
    category: 'Professional',
    question: 'When do professionals receive their payout balance?',
    answer: 'PunchX automatically calculates your net earnings after our platform commission and disburses payouts to your linked bank account every Tuesday and Friday morning.',
    order: 3
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay_001',
    razorpayPaymentId: 'pay_OKa8721Nx90L',
    razorpayOrderId: 'order_PX9921',
    bookingId: 'BK_8901',
    customerName: 'Debashis Banerjee',
    customerPhone: '+91 98301 24590',
    proName: 'Subhashish Roy',
    serviceName: 'Split AC Jet Service',
    amount: 1198,
    commissionAmount: 179.70,
    proPayoutAmount: 1018.30,
    method: 'UPI',
    status: 'completed',
    createdAt: '2026-04-12 11:20'
  },
  {
    id: 'pay_002',
    razorpayPaymentId: 'pay_OKb9911Mz45P',
    razorpayOrderId: 'order_PX9922',
    bookingId: 'BK_8902',
    customerName: 'Priyanka Mukherjee',
    customerPhone: '+91 98314 99012',
    proName: 'Anjali Sharma',
    serviceName: 'Glow Facial & Head Massage',
    amount: 899,
    commissionAmount: 179.80,
    proPayoutAmount: 719.20,
    method: 'Credit Card',
    status: 'completed',
    createdAt: '2026-04-12 14:45'
  },
  {
    id: 'pay_003',
    razorpayPaymentId: 'pay_OKc3321Qp12K',
    razorpayOrderId: 'order_PX9923',
    bookingId: 'BK_8903',
    customerName: 'Soumitra Ghosh',
    customerPhone: '+91 98305 77123',
    proName: 'Kartik Adhikary',
    serviceName: 'Complete 2BHK Deep Cleaning',
    amount: 2499,
    commissionAmount: 449.82,
    proPayoutAmount: 2049.18,
    method: 'UPI',
    status: 'completed',
    createdAt: '2026-04-13 09:15'
  },
  {
    id: 'pay_004',
    razorpayPaymentId: 'pay_OKd7764Rr88J',
    razorpayOrderId: 'order_PX9924',
    bookingId: 'BK_8904',
    customerName: 'Sneha Roy Chowdhury',
    customerPhone: '+91 98311 00293',
    proName: 'Subhashish Roy',
    serviceName: 'RO Water Purifier Service',
    amount: 450,
    commissionAmount: 67.50,
    proPayoutAmount: 382.50,
    method: 'Debit Card',
    status: 'completed',
    createdAt: '2026-04-13 13:05'
  },
  {
    id: 'pay_005',
    razorpayPaymentId: 'pay_OKe1122Tt55H',
    razorpayOrderId: 'order_PX9925',
    bookingId: 'BK_8905',
    customerName: 'Mousumi Chatterjee',
    customerPhone: '+91 94331 55678',
    proName: 'Tapan Karmakar',
    serviceName: 'Ceiling Fan Installation & Fix',
    amount: 398,
    commissionAmount: 47.76,
    proPayoutAmount: 350.24,
    method: 'UPI',
    status: 'completed',
    createdAt: '2026-04-13 16:40'
  },
  {
    id: 'pay_006',
    razorpayPaymentId: 'pay_OKf8819Uu23W',
    razorpayOrderId: 'order_PX9926',
    bookingId: 'BK_8906',
    customerName: 'Aritra Sen',
    customerPhone: '+91 98308 19044',
    proName: 'Subhashish Roy',
    serviceName: 'Split AC Comprehensive Jet Service',
    amount: 599,
    commissionAmount: 89.85,
    proPayoutAmount: 509.15,
    method: 'Netbanking',
    status: 'refunded',
    createdAt: '2026-04-11 10:15'
  }
];

export const INITIAL_REFUNDS: RefundRequest[] = [
  {
    id: 'ref_001',
    paymentId: 'pay_OKf8819Uu23W',
    bookingId: 'BK_8906',
    customerName: 'Aritra Sen',
    customerPhone: '+91 98308 19044',
    serviceName: 'Split AC Comprehensive Jet Service',
    amount: 599,
    reason: 'Pro No-Show',
    notes: 'Technician called 15 mins prior saying personal vehicle breakdown, customer could not reschedule due to flight.',
    status: 'approved',
    requestedAt: '2026-04-11 11:30',
    processedAt: '2026-04-11 12:45',
    processedBy: 'Soumen Roy (Finance Lead)',
    adminRemarks: 'Full refund initiated via Razorpay API refund endpoint. Credited back to UPI.'
  },
  {
    id: 'ref_002',
    paymentId: 'pay_OKb9911Mz45P',
    bookingId: 'BK_8910',
    customerName: 'Anwesha Paul',
    customerPhone: '+91 98319 88102',
    serviceName: 'Bathroom Pipeline & Tap Leakage Fix',
    amount: 249,
    reason: 'Substandard Work',
    notes: 'Tap continues to drip after plumber left. Customer provided video proof.',
    status: 'pending',
    requestedAt: '2026-04-13 17:10'
  },
  {
    id: 'ref_003',
    paymentId: 'pay_OKc3321Qp12K',
    bookingId: 'BK_8914',
    customerName: 'Kunal Roy',
    customerPhone: '+91 98361 22901',
    serviceName: 'Fan Installation',
    amount: 199,
    reason: 'Duplicate Payment',
    notes: 'Amount debited twice on PhonePe during network lag. Bank UTR provided.',
    status: 'pending',
    requestedAt: '2026-04-13 18:25'
  },
  {
    id: 'ref_004',
    paymentId: 'pay_OKe9921Aa11Z',
    bookingId: 'BK_8890',
    customerName: 'Ritesh Ghosh',
    customerPhone: '+91 98741 00299',
    serviceName: 'Sofa Deep Shampooing',
    amount: 799,
    reason: 'Customer Cancelled (In Window)',
    notes: 'Customer cancelled 10 minutes after pro was already at location and finished unpacking.',
    status: 'rejected',
    requestedAt: '2026-04-10 14:00',
    processedAt: '2026-04-10 15:30',
    processedBy: 'Amitava Sen',
    adminRemarks: 'Rejected as per Cancellation Clause 3.2. Pro completed arrival OTP verification.'
  }
];

export const INITIAL_FAILED_TRANSACTIONS: FailedTransaction[] = [
  {
    id: 'fail_001',
    razorpayPaymentId: 'pay_FAIL_99182',
    bookingId: 'BK_8918',
    customerName: 'Tanmoy Sengupta',
    customerPhone: '+91 98310 44921',
    amount: 1499,
    method: 'UPI (Google Pay)',
    errorCode: 'PAYMENT_TIMEOUT',
    errorMessage: 'Customer did not approve UPI collect request within 8 minutes.',
    createdAt: '2026-04-13 15:12',
    retryCount: 1,
    resolved: false
  },
  {
    id: 'fail_002',
    razorpayPaymentId: 'pay_FAIL_88102',
    bookingId: 'BK_8919',
    customerName: 'Shampa Das',
    customerPhone: '+91 94331 99120',
    amount: 599,
    method: 'Credit Card (HDFC)',
    errorCode: 'CARD_DECLINED',
    errorMessage: 'Bank declined transaction: international/online transaction not enabled on card.',
    createdAt: '2026-04-13 16:30',
    retryCount: 2,
    resolved: false
  },
  {
    id: 'fail_003',
    bookingId: 'BK_8920',
    customerName: 'Bikramjit Saha',
    customerPhone: '+91 98303 77109',
    amount: 2499,
    method: 'Netbanking (SBI)',
    errorCode: 'BANK_GATEWAY_DOWN',
    errorMessage: 'State Bank of India retail netbanking gateway returned HTTP 504 Gateway Timeout.',
    createdAt: '2026-04-12 21:05',
    retryCount: 0,
    resolved: true
  }
];

export const INITIAL_COMMISSIONS: CommissionSettlement[] = [
  {
    id: 'set_001',
    proId: 'usr_002',
    proName: 'Subhashish Roy',
    serviceCategory: 'Repairs and installations',
    totalEarnings: 18450,
    platformCommissionRate: 15,
    commissionDeducted: 2767.50,
    netPayout: 15682.50,
    settlementPeriod: 'Week 14 (07 Apr - 13 Apr 2026)',
    payoutStatus: 'pending',
    bankAccountMasked: 'HDFC Bank ending in **8921'
  },
  {
    id: 'set_002',
    proId: 'usr_006',
    proName: 'Anjali Sharma',
    serviceCategory: 'Beauty and personal care',
    totalEarnings: 22800,
    platformCommissionRate: 20,
    commissionDeducted: 4560.00,
    netPayout: 18240.00,
    settlementPeriod: 'Week 14 (07 Apr - 13 Apr 2026)',
    payoutStatus: 'processing',
    bankAccountMasked: 'ICICI Bank ending in **3419'
  },
  {
    id: 'set_003',
    proId: 'usr_012',
    proName: 'Kartik Adhikary',
    serviceCategory: 'Cleaning and home care',
    totalEarnings: 9996,
    platformCommissionRate: 18,
    commissionDeducted: 1799.28,
    netPayout: 8196.72,
    settlementPeriod: 'Week 14 (07 Apr - 13 Apr 2026)',
    payoutStatus: 'settled',
    bankAccountMasked: 'SBI ending in **1023',
    settledAt: '2026-04-13 10:00'
  }
];

export const INITIAL_OFFERS: OfferCoupon[] = [
  {
    id: 'off_001',
    code: 'PUNCHXFIRST',
    title: 'First Booking Welcome Discount',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 299,
    maxDiscount: 150,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    usageCount: 842,
    usageLimit: 5000,
    applicableCategories: ['All'],
    isActive: true
  },
  {
    id: 'off_002',
    code: 'KOLKATA50',
    title: 'Summer Care Flat ₹50 OFF',
    discountType: 'flat',
    discountValue: 50,
    minOrderValue: 499,
    validFrom: '2026-03-15',
    validUntil: '2026-05-31',
    usageCount: 310,
    usageLimit: 1000,
    applicableCategories: ['Repairs and installations', 'Electrical and plumbing'],
    isActive: true
  },
  {
    id: 'off_003',
    code: 'CLEANFEST',
    title: 'Home Deep Cleaning Bonanza 15% OFF',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 1499,
    maxDiscount: 400,
    validFrom: '2026-04-01',
    validUntil: '2026-04-30',
    usageCount: 128,
    usageLimit: 300,
    applicableCategories: ['Cleaning and home care'],
    isActive: true
  },
  {
    id: 'off_004',
    code: 'NABADWIP100',
    title: 'Nabadwip Launch Celebration Flat ₹100',
    discountType: 'flat',
    discountValue: 100,
    minOrderValue: 399,
    validFrom: '2026-03-20',
    validUntil: '2026-06-20',
    usageCount: 74,
    usageLimit: 500,
    applicableCategories: ['All'],
    isActive: true
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_001',
    title: 'Monsoon Preparedness Protocol for Electricians & Plumbers',
    message: 'Due to thunderstorm alerts across Kolkata & Hooghly basin, all service professionals must carry waterproof insulation tape, voltage test pens, and safety gumboots.',
    type: 'critical_alert',
    targetAudience: 'professionals',
    priority: 'high',
    sentAt: '2026-04-12 09:00',
    sentBy: 'Soumen Roy (Safety Cell)',
    reachCount: 142,
    readCount: 128
  },
  {
    id: 'ann_002',
    title: 'Bengali New Year (Poila Baisakh) Special Offers Live!',
    message: 'Celebrate Noboborsho with spotless homes! 15% discount on home deep cleaning and beauty grooming services across Kolkata and Nabadwip.',
    type: 'promotional',
    targetAudience: 'customers',
    priority: 'medium',
    sentAt: '2026-04-13 10:00',
    sentBy: 'Marketing Team',
    reachCount: 2450,
    readCount: 1890
  },
  {
    id: 'ann_003',
    title: 'Scheduled System Maintenance: Razorpay Gateway Upgrade',
    message: 'Platform payments will undergo routine gateway maintenance on 16th April between 02:00 AM and 03:30 AM IST. Cash/UPI backup available.',
    type: 'maintenance',
    targetAudience: 'all',
    priority: 'medium',
    sentAt: '2026-04-11 17:30',
    sentBy: 'DevOps & Infrastructure',
    reachCount: 2600,
    readCount: 2100
  }
];

export const INITIAL_ROLES: AdminRole[] = [
  {
    id: 'role_super',
    name: 'Super Admin',
    description: 'Full administrative control across marketplace operations, finances, KYC, and security permissions.',
    assignedUsersCount: 1,
    permissions: {
      canViewUsers: true,
      canBlockUsers: true,
      canVerifyKYC: true,
      canManageContent: true,
      canManageListings: true,
      canProcessRefunds: true,
      canViewPayments: true,
      canAdjustCommission: true,
      canSendAnnouncements: true,
      canManageOffers: true,
      canExportReports: true,
      canManageRoles: true
    }
  },
  {
    id: 'role_ops',
    name: 'Operations Manager',
    description: 'Manages user verifications, category listings, suspension enforcement, and service coverage.',
    assignedUsersCount: 2,
    permissions: {
      canViewUsers: true,
      canBlockUsers: true,
      canVerifyKYC: true,
      canManageContent: true,
      canManageListings: true,
      canProcessRefunds: false,
      canViewPayments: true,
      canAdjustCommission: false,
      canSendAnnouncements: true,
      canManageOffers: true,
      canExportReports: true,
      canManageRoles: false
    }
  },
  {
    id: 'role_finance',
    name: 'Finance & Payouts Lead',
    description: 'Oversees Razorpay settlements, pro payouts, commission deductions, and customer refund processing.',
    assignedUsersCount: 1,
    permissions: {
      canViewUsers: true,
      canBlockUsers: false,
      canVerifyKYC: false,
      canManageContent: false,
      canManageListings: false,
      canProcessRefunds: true,
      canViewPayments: true,
      canAdjustCommission: true,
      canSendAnnouncements: false,
      canManageOffers: false,
      canExportReports: true,
      canManageRoles: false
    }
  },
  {
    id: 'role_support',
    name: 'Customer Support Lead',
    description: 'Handles customer dispute tickets, refund triage, and service feedback resolution.',
    assignedUsersCount: 2,
    permissions: {
      canViewUsers: true,
      canBlockUsers: false,
      canVerifyKYC: false,
      canManageContent: false,
      canManageListings: false,
      canProcessRefunds: true,
      canViewPayments: true,
      canAdjustCommission: false,
      canSendAnnouncements: false,
      canManageOffers: false,
      canExportReports: false,
      canManageRoles: false
    }
  }
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'adm_001',
    name: 'Amitava Sen',
    email: 'amitava.admin@punchx.in',
    roleId: 'role_super',
    roleName: 'Super Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    lastActive: 'Just now',
    status: 'active'
  },
  {
    id: 'adm_002',
    name: 'Soumen Roy',
    email: 'soumen.ops@punchx.in',
    roleId: 'role_ops',
    roleName: 'Operations Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    lastActive: '12 mins ago',
    status: 'active'
  },
  {
    id: 'adm_003',
    name: 'Pooja Dutta',
    email: 'pooja.finance@punchx.in',
    roleId: 'role_finance',
    roleName: 'Finance & Payouts Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    lastActive: '1 hour ago',
    status: 'active'
  },
  {
    id: 'adm_004',
    name: 'Rohan Chakraborty',
    email: 'rohan.support@punchx.in',
    roleId: 'role_support',
    roleName: 'Customer Support Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    lastActive: '3 hours ago',
    status: 'active'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_001',
    timestamp: '2026-04-13 18:32:10',
    adminName: 'Amitava Sen',
    adminEmail: 'amitava.admin@punchx.in',
    action: 'GEOFENCE_STATUS_VERIFIED',
    entityType: 'Content',
    entityId: 'zone_wb_01',
    details: 'Verified operating coordinates for Kolkata (8km) and Nabadwip (8km) operational sectors.',
    ipAddress: '103.212.144.18'
  },
  {
    id: 'log_002',
    timestamp: '2026-04-13 17:15:44',
    adminName: 'Pooja Dutta',
    adminEmail: 'pooja.finance@punchx.in',
    action: 'REFUND_APPROVED',
    entityType: 'Refund',
    entityId: 'ref_001',
    details: 'Approved ₹599 refund for Order #BK_8906 via Razorpay API.',
    ipAddress: '103.212.144.19'
  },
  {
    id: 'log_003',
    timestamp: '2026-04-12 11:20:00',
    adminName: 'Soumen Roy',
    adminEmail: 'soumen.ops@punchx.in',
    action: 'KYC_APPROVED',
    entityType: 'KYC',
    entityId: 'kyc_003',
    details: 'Verified Subhashish Roy trade license and identity credentials.',
    ipAddress: '103.212.144.22'
  },
  {
    id: 'log_004',
    timestamp: '2026-04-11 14:10:30',
    adminName: 'Amitava Sen',
    adminEmail: 'amitava.admin@punchx.in',
    action: 'USER_BLOCKED',
    entityType: 'User',
    entityId: 'usr_005',
    details: 'Suspended user Rahul Sen due to verified policy breach against female beautician.',
    ipAddress: '103.212.144.18'
  }
];

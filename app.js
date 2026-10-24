(() => {
  'use strict';

  const APP_VERSION = 24;
  const STORAGE_KEY = 'simulador-airbnb-state-v1'; // mantido para migrar automaticamente a V1
  const UI_STORAGE_KEY = 'simulador-airbnb-ui-v1';

  const defaultState = {
    version: APP_VERSION,
    name: 'Rio de Janeiro — cenário-base de mercado (out/2026)',
    analysis: {
      startingPosition: 'property',
      horizonYears: 5
    },
    guidedSetup: {
      financial: {
        configured: false,
        applicationType: 'cdb',
        rateKind: 'nominal-gross',
        ratePct: 13.65,
        taxPct: 17.5,
        feesPct: 0,
        termMonths: 12,
        liquidity: 'daily',
        role: 'benchmark'
      },
      acquisitionSale: {
        configured: false,
        position: 'owned',
        availableCapital: 0,
        purchasePrice: 636000,
        purchaseCosts: 0,
        workingCapitalTarget: 'airbnbSelf',
        workingCapitalAmount: 0
      },
      airbnbOps: {
        configured: false
      }
    },
    market: {
      subject: {
        address: 'Rua Maestro Francisco Braga, 76, apto 405',
        neighborhood: 'Copacabana',
        propertyType: 'apartment',
        roomType: 'entire_home',
        areaM2: 33,
        bedrooms: 1,
        bathrooms: 1,
        guests: 0,
        beds: 0,
        acUnits: 2,
        elevator: 'yes',
        parking: 'unknown',
        qualityGrade: 3,
        minStayNights: 0
      },
      evidenceSnapshot: {
        collectedAt: '2026-10-24',
        insideAirbnbSnapshotDate: '2026-09-22',
        methodology: 'local-public-evidence',
        note: 'Comparáveis públicos de curta duração no Bairro Peixoto e entorno. Preços são diárias anunciadas/de referência em datas diferentes; ocupação não é inferida de calendário público.'
      },
      comparables: [
        {
          id: 'maestro76-juano', name: 'Maestro Francisco Braga 76 — Juano Tours', source: 'operator-direct',
          sourceRef: 'https://juanotours.com.br/tours/apartamentos/copacabana/maestro-francisco-braga-76/',
          collectedAt: '2026-10-24', evidenceNote: 'Mesmo prédio. Operador informa R$ 380/noite + R$ 180 de taxa de serviço; cabeçalho exibe R$ 450/dia. Usada a diária textual de R$ 380.',
          distanceKm: 0.01, roomType: 'entire_home', bedrooms: 1, guests: 4, beds: 2, bathrooms: 1,
          acUnits: 1, elevator: 'yes', parking: 'unknown', qualityGrade: 4, rating: 0, reviewCount: 0,
          activeRecently: true, minStayNights: 0, nightlyRate: 380, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'maestro-oasis-airbnb', name: 'Oásis em Copacabana — Residencial Peixoto', source: 'airbnb-manual',
          sourceRef: 'https://www.airbnb.com.br/rooms/1617000716467540808',
          collectedAt: '2026-10-24', evidenceNote: 'Mesmo Residencial Peixoto; 51 m², 1 quarto, 2 hóspedes, 2 camas, rating 5,0. Airbnb não expôs preço sem datas.',
          distanceKm: 0.01, roomType: 'entire_home', bedrooms: 1, guests: 2, beds: 2, bathrooms: 1,
          acUnits: 1, elevator: 'yes', parking: 'unknown', qualityGrade: 4, rating: 5, reviewCount: 2,
          activeRecently: true, minStayNights: 0, nightlyRate: 0, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'maestro-brisa-airbnb', name: 'Brisa do Peixoto!', source: 'airbnb-manual',
          sourceRef: 'https://www.airbnb.com.br/rooms/1425439030218835876',
          collectedAt: '2026-10-24', evidenceNote: 'Rua Maestro Francisco Braga; 1 quarto, 2 hóspedes, 1 cama, rating 5,0 com 13 avaliações. Número do prédio não exposto.',
          distanceKm: 0.15, roomType: 'entire_home', bedrooms: 1, guests: 2, beds: 1, bathrooms: 1,
          acUnits: 0, elevator: 'unknown', parking: 'unknown', qualityGrade: 4, rating: 5, reviewCount: 13,
          activeRecently: true, minStayNights: 0, nightlyRate: 0, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'peixoto-luiz-airbnb', name: 'Copacabana Bairro Peixoto — Luiz', source: 'airbnb-manual',
          sourceRef: 'https://www.airbnb.com.br/rooms/822933221852279797',
          collectedAt: '2026-10-24', evidenceNote: 'Bairro Peixoto; 1 quarto, 2 hóspedes, rating 4,98 com 65 avaliações. Localização exata não pública.',
          distanceKm: 0.5, roomType: 'entire_home', bedrooms: 1, guests: 2, beds: 1, bathrooms: 2,
          acUnits: 0, elevator: 'unknown', parking: 'unknown', qualityGrade: 4, rating: 4.98, reviewCount: 65,
          activeRecently: true, minStayNights: 0, nightlyRate: 0, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'peixoto-aconchego-airbnb', name: 'Aconchego no Bairro Peixoto', source: 'airbnb-manual',
          sourceRef: 'https://www.airbnb.com.br/rooms/1799361479339616502',
          collectedAt: '2026-10-24', evidenceNote: 'Em frente à Praça Edmundo Bittencourt; 1 quarto, 2 hóspedes. Novo anúncio; preço não exposto sem datas.',
          distanceKm: 0.35, roomType: 'entire_home', bedrooms: 1, guests: 2, beds: 1, bathrooms: 1,
          acUnits: 0, elevator: 'unknown', parking: 'unknown', qualityGrade: 3, rating: 0, reviewCount: 1,
          activeRecently: true, minStayNights: 0, nightlyRate: 0, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'peixoto-refugio-airbnb', name: 'Refúgio charmoso no Bairro Peixoto', source: 'airbnb-manual',
          sourceRef: 'https://www.airbnb.com.br/rooms/1772689317426025304',
          collectedAt: '2026-10-24', evidenceNote: 'Bairro Peixoto; 1 quarto, 2 hóspedes, anúncio novo. Localização e preço exatos não públicos.',
          distanceKm: 0.5, roomType: 'entire_home', bedrooms: 1, guests: 2, beds: 1, bathrooms: 1,
          acUnits: 0, elevator: 'unknown', parking: 'unknown', qualityGrade: 4, rating: 0, reviewCount: 0,
          activeRecently: true, minStayNights: 0, nightlyRate: 0, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'santaclara98-yes', name: 'Santa Clara 98 — Yes Temporada', source: 'operator-direct',
          sourceRef: 'https://www.yestemporada.com/pt/apartment/PP19J/vacation-rental-in-copacabana-sleeps-2',
          collectedAt: '2026-10-24', evidenceNote: 'Rua Santa Clara 98; página pública anuncia a partir de R$ 297,50/noite.',
          distanceKm: 0.8, roomType: 'entire_home', bedrooms: 1, guests: 2, beds: 1, bathrooms: 1,
          acUnits: 1, elevator: 'unknown', parking: 'unknown', qualityGrade: 3, rating: 0, reviewCount: 0,
          activeRecently: true, minStayNights: 0, nightlyRate: 297.5, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'anita22-kitnet', name: 'Anita Garibaldi 22 — kitnet', source: 'booking-reference',
          sourceRef: 'https://www.exploraai.com.br/hotel/kitnet-em-copacabana-no-po',
          collectedAt: '2026-09-11', evidenceNote: 'ExploraAI/Booking; diária de referência R$ 213 para 26/10; 1 quarto e ar-condicionado.',
          distanceKm: 0.45, roomType: 'entire_home', bedrooms: 1, guests: 0, beds: 0, bathrooms: 1,
          acUnits: 1, elevator: 'unknown', parking: 'unknown', qualityGrade: 4, rating: 4.1, reviewCount: 26,
          activeRecently: true, minStayNights: 0, nightlyRate: 213, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'anita22-studio306', name: 'Anita Garibaldi 22 apto 306 — Studio for 2', source: 'booking-reference',
          sourceRef: 'https://www.exploraai.com.br/hotel/studio-for-2-people-steps-from-copacabana-beach',
          collectedAt: '2026-10-21', evidenceNote: 'ExploraAI/Booking; diária de referência R$ 552 para 22/11; 1 quarto, ar-condicionado, 48 avaliações.',
          distanceKm: 0.45, roomType: 'entire_home', bedrooms: 1, guests: 2, beds: 0, bathrooms: 1,
          acUnits: 1, elevator: 'unknown', parking: 'unknown', qualityGrade: 4, rating: 4.75, reviewCount: 48,
          activeRecently: true, minStayNights: 0, nightlyRate: 552, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'santaclara142-adoravel', name: 'Santa Clara 142 apto 406 — Adorável Estúdio', source: 'booking-reference',
          sourceRef: 'https://www.exploraai.com.br/hotel/adoravel-studio-copacabana',
          collectedAt: '2026-10-23', evidenceNote: 'ExploraAI/Booking; diária de referência R$ 508 para 24/10; 1 quarto e ar-condicionado.',
          distanceKm: 0.8, roomType: 'entire_home', bedrooms: 1, guests: 0, beds: 0, bathrooms: 1,
          acUnits: 1, elevator: 'unknown', parking: 'unknown', qualityGrade: 4, rating: 4.7, reviewCount: 16,
          activeRecently: true, minStayNights: 0, nightlyRate: 508, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'santaclara142-studio807', name: 'Santa Clara 142 apto 807 — Studio Santa Clara', source: 'booking-reference',
          sourceRef: 'https://www.exploraai.com.br/hotel/studio-santa-clara-rio-de-janeiro12',
          collectedAt: '2026-10-10', evidenceNote: 'ExploraAI/Booking; diária de referência R$ 315 para 14/10.',
          distanceKm: 0.8, roomType: 'entire_home', bedrooms: 1, guests: 0, beds: 0, bathrooms: 1,
          acUnits: 0, elevator: 'unknown', parking: 'unknown', qualityGrade: 4, rating: 4.8, reviewCount: 12,
          activeRecently: true, minStayNights: 0, nightlyRate: 315, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'santaclara142-bemvindo', name: 'Santa Clara 142 apto 705 — Bemvindo', source: 'booking-reference',
          sourceRef: 'https://www.exploraai.com.br/hotel/bemvindo',
          collectedAt: '2026-10-12', evidenceNote: 'ExploraAI/Booking; diária de referência R$ 356 para 02/12; ar-condicionado e elevador.',
          distanceKm: 0.8, roomType: 'entire_home', bedrooms: 1, guests: 0, beds: 0, bathrooms: 1,
          acUnits: 1, elevator: 'yes', parking: 'no', qualityGrade: 4, rating: 4.65, reviewCount: 79,
          activeRecently: true, minStayNights: 0, nightlyRate: 356, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'santaclara98-brisa', name: 'Santa Clara 98 — Brisa de Copa', source: 'booking-reference',
          sourceRef: 'https://www.exploraai.com.br/hotel/brisa-de-copa',
          collectedAt: '2026-10-05', evidenceNote: 'ExploraAI/Booking; diária de referência R$ 523 para 13/10.',
          distanceKm: 0.8, roomType: 'entire_home', bedrooms: 1, guests: 0, beds: 0, bathrooms: 1,
          acUnits: 0, elevator: 'unknown', parking: 'unknown', qualityGrade: 4, rating: 4.65, reviewCount: 70,
          activeRecently: true, minStayNights: 0, nightlyRate: 523, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'santaclara98-heart', name: 'Santa Clara 98 apto 820 — Apartment in the heart', source: 'booking-reference',
          sourceRef: 'https://www.exploraai.com.br/hotel/apartment-in-the-heart-of-copacabana-beach-street',
          collectedAt: '2026-10-15', evidenceNote: 'ExploraAI/Booking; diária de referência R$ 200 para 19/10.',
          distanceKm: 0.8, roomType: 'entire_home', bedrooms: 1, guests: 0, beds: 0, bathrooms: 1,
          acUnits: 0, elevator: 'unknown', parking: 'unknown', qualityGrade: 3, rating: 4.3, reviewCount: 5,
          activeRecently: true, minStayNights: 0, nightlyRate: 200, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'santaclara98-studio720', name: 'Santa Clara 98 apto 720 — Studio Copacabana', source: 'booking-reference',
          sourceRef: 'https://www.exploraai.com.br/hotel/studio-copacabana-rio-de-janeiro1234',
          collectedAt: '2026-09-25', evidenceNote: 'ExploraAI/Booking; diária de referência R$ 272; classificação de qualidade 3/5.',
          distanceKm: 0.8, roomType: 'entire_home', bedrooms: 1, guests: 0, beds: 0, bathrooms: 1,
          acUnits: 0, elevator: 'unknown', parking: 'unknown', qualityGrade: 3, rating: 4.95, reviewCount: 24,
          activeRecently: true, minStayNights: 0, nightlyRate: 272, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'pompeu99-oneflat', name: 'Pompeu Loureiro 99 — One Flat Garagem Copa', source: 'booking-reference',
          sourceRef: 'https://www.exploraai.com.br/hotel/laris-rio-copacabana-apto-1-quarto-e-piscina-no-oneflat',
          collectedAt: '2026-10-23', evidenceNote: 'ExploraAI/Booking; diária de referência R$ 721 para 04/11; 1 quarto, piscina, academia e estacionamento.',
          distanceKm: 1.14, roomType: 'entire_home', bedrooms: 1, guests: 0, beds: 0, bathrooms: 1,
          acUnits: 1, elevator: 'yes', parking: 'yes', qualityGrade: 4, rating: 4.9, reviewCount: 12,
          activeRecently: true, minStayNights: 0, nightlyRate: 721, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'pompeu99-hospeda', name: 'Pompeu Loureiro 99 — Flat piscina/sauna/garagem', source: 'operator-direct',
          sourceRef: 'https://www.hospedapluss.com.br/pt/apartment/GK06J',
          collectedAt: '2026-10-24', evidenceNote: 'Operador direto; página pública recente exibe a partir de R$ 230/noite. 38 m², 1 quarto, piscina, sauna, elevador e garagem.',
          distanceKm: 1.14, roomType: 'entire_home', bedrooms: 1, guests: 4, beds: 2, bathrooms: 1,
          acUnits: 1, elevator: 'yes', parking: 'yes', qualityGrade: 4, rating: 0, reviewCount: 0,
          activeRecently: true, minStayNights: 0, nightlyRate: 230, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'pompeu99-flat208', name: 'Pompeu Loureiro 99 apto 208 — Flat One', source: 'booking-reference',
          sourceRef: 'https://www.exploraai.com.br/hotel/flat-2-quadras-praia-2-min-metro-com-garagem',
          collectedAt: '2026-10-11', evidenceNote: 'ExploraAI/Booking; diária de referência R$ 341 para 13/10; piscina e estacionamento.',
          distanceKm: 1.14, roomType: 'entire_home', bedrooms: 1, guests: 0, beds: 0, bathrooms: 1,
          acUnits: 0, elevator: 'yes', parking: 'yes', qualityGrade: 4, rating: 4.2, reviewCount: 34,
          activeRecently: true, minStayNights: 0, nightlyRate: 341, occupancyPct: 0, occupancyEvidence: 'none'
        },
        {
          id: 'pompeu99-flat104', name: 'Pompeu Loureiro 99 apto 104 — Flat Copa Mar', source: 'booking-reference',
          sourceRef: 'https://www.exploraai.com.br/hotel/flat-copacabana-rio-de-janeiro19',
          collectedAt: '2026-09-27', evidenceNote: 'ExploraAI/Booking; diária de referência R$ 761; piscina, sauna e estacionamento pago.',
          distanceKm: 1.14, roomType: 'entire_home', bedrooms: 1, guests: 0, beds: 0, bathrooms: 1,
          acUnits: 1, elevator: 'yes', parking: 'yes', qualityGrade: 4, rating: 4.9, reviewCount: 85,
          activeRecently: true, minStayNights: 0, nightlyRate: 761, occupancyPct: 0, occupancyEvidence: 'none'
        }
      ]
    },
    globals: {
      propertyValue: 636000,
      inflationPct: 4.3,
      propertyRealAppreciationPct: 0,
      ownerHourlyValue: 100
    },
    propertySale: {
      salePriceAdjustmentPct: 0,
      brokeragePct: 5,
      fixedCosts: 0,
      mortgageBalance: 0,
      capitalGainsTax: 0,
      otherCosts: 0
    },
    workingCapital: {
      airbnbSelf: 0,
      airbnbAdmin: 0,
      rentedAirbnb: 0,
      traditional: 0
    },
    work: {
      selfHoursMonthly: 1,
      supervisionAdminHoursMonthly: 1,
      traditionalHoursMonthly: 1.5,
      investmentHoursMonthly: 0.5,
      rentedAirbnbHoursMonthly: 1
    },
    airbnb: {
      platformFeePct: 16,
      avgStayNights: 5.6,
      cleaningFeeRevenue: 240,
      otherGuestFeeRevenue: 0,
      taxPct: 15,
      adminFeePct: 25,
      adminMonthlyFee: 0,
      adminOnboardingFee: 0,
      adminNightlyRateImpactPct: 0,
      adminOccupancyImpactPp: 0,
      adminIncludesPlatformFee: false,
      platformFeeDeductibleIR: true,
      adminFeeDeductibleIR: true,
      adminMonthlyFeeDeductibleIR: false
    },
    hybridUse: {
      avoidedLodgingPerDay: 0,
      personalUseIncrementalCostPerDay: 0,
      habitualHousingBenefitAnnual: 0,
      habitualUseIncrementalCostAnnual: 0,
      preparationAnnualCost: 0,
      storageAnnualCost: 0,
      otherIncrementalAnnualCost: 0,
      incrementalAirbnbCostsDeductibleIR: false,
      incrementalAirbnbCapex: 0,
      incrementalAirbnbCapexResidualPct: 0
    },
    rentedAirbnb: {
      furnished: false,
      subleaseAuthorized: false,
      contractEndStrategy: 'renew',
      monthlyLeaseRent: 3500,
      securityDeposit: 0,
      initialLeaseCosts: 0,
      annualLeaseCosts: 0,
      annualLeaseCostsDeductibleIR: false
    },
    traditional: {
      monthlyRent: 3500,
      occupancyPct: 95,
      managementFeePct: 10,
      taxPct: 15,
      maintenancePct: 0,
      lossPct: 0,
      newLeaseCommissionMonths: 1,
      avgContractMonths: 30,
      annualOtherCosts: 0,
      managementFeeDeductibleIR: true,
      maintenanceDeductibleIR: false,
      lossDeductibleIR: false,
      newLeaseCommissionDeductibleIR: false,
      annualOtherCostsDeductibleIR: false
    },
    investment: {
      mode: 'nominal',
      nominalRatePct: 13.65,
      realRatePct: 6.76,
      taxPct: 17.5,
      feesPct: 0
    },
    seasons: [
      { id: 'reveillon', name: 'Réveillon', days: 4, personalUseDays: 0, habitualUseDays: 0, operationalUnavailableDays: 0, unavailableDays: 0, nightlyRate: 750, occupancyPct: 100 },
      { id: 'verao', name: 'Verão', days: 81, personalUseDays: 0, habitualUseDays: 0, operationalUnavailableDays: 0, unavailableDays: 0, nightlyRate: 400, occupancyPct: 90 },
      { id: 'carnaval', name: 'Carnaval', days: 7, personalUseDays: 0, habitualUseDays: 0, operationalUnavailableDays: 0, unavailableDays: 0, nightlyRate: 750, occupancyPct: 100 },
      { id: 'outono', name: 'Outono', days: 91, personalUseDays: 0, habitualUseDays: 0, operationalUnavailableDays: 0, unavailableDays: 0, nightlyRate: 250, occupancyPct: 70 },
      { id: 'inverno', name: 'Inverno', days: 91, personalUseDays: 0, habitualUseDays: 0, operationalUnavailableDays: 0, unavailableDays: 0, nightlyRate: 250, occupancyPct: 60 },
      { id: 'primavera', name: 'Primavera', days: 91, personalUseDays: 0, habitualUseDays: 0, operationalUnavailableDays: 0, unavailableDays: 0, nightlyRate: 250, occupancyPct: 70 }
    ],
    stayCosts: [
      { id: 'lavanderia', name: 'Lavanderia de cama/banho', amount: 60, ownerHoursPerReservation: 0.1, adminManages: true, adminIncluded: false, deductibleIR: false },
      { id: 'limpeza', name: 'Limpeza', amount: 180, ownerHoursPerReservation: 0.25, adminManages: true, adminIncluded: false, deductibleIR: false },
      { id: 'amenidades', name: 'Amenidades e consumíveis', amount: 70, ownerHoursPerReservation: 0.15, adminManages: true, adminIncluded: false, deductibleIR: false },
      { id: 'checkin', name: 'Check-in / check-out presencial', amount: 0, ownerHoursPerReservation: 0.25, adminManages: true, adminIncluded: false, deductibleIR: false }
    ],
    monthlyCosts: [
      { id: 'marketing', name: 'Gestão comercial e marketing', amount: 0, ownerHoursMonthly: 1, airbnb: true, rentedAirbnb: true, traditional: false, adminManages: true, adminIncluded: false, deductibleIR: false },
      { id: 'presales', name: 'Atendimento de reservas / pré-venda', amount: 0, ownerHoursMonthly: 2, airbnb: true, rentedAirbnb: true, traditional: false, adminManages: true, adminIncluded: false, deductibleIR: false },
      { id: 'guest-support', name: 'Atendimento contínuo ao hóspede', amount: 0, ownerHoursMonthly: 2, airbnb: true, rentedAirbnb: true, traditional: false, adminManages: true, adminIncluded: false, deductibleIR: false },
      { id: 'local-support', name: 'Suporte operacional / plantão local', amount: 0, ownerHoursMonthly: 1, airbnb: true, rentedAirbnb: true, traditional: false, adminManages: true, adminIncluded: false, deductibleIR: false },
      { id: 'software', name: 'Software e automação', amount: 0, ownerHoursMonthly: 0.5, airbnb: true, rentedAirbnb: true, traditional: false, adminManages: false, adminIncluded: false, deductibleIR: false },
      { id: 'pricing', name: 'Gestão de preços / dynamic pricing', amount: 0, ownerHoursMonthly: 1.5, airbnb: true, rentedAirbnb: true, traditional: false, adminManages: true, adminIncluded: false, deductibleIR: false },
      { id: 'seguro', name: 'Seguro do imóvel / incêndio', amount: 60, ownerHoursMonthly: 0, airbnb: true, rentedAirbnb: false, traditional: false, adminManages: false, adminIncluded: false, deductibleIR: false },
      { id: 'seguro-garantia', name: 'Seguro-fiança / garantia locatícia', amount: 0, ownerHoursMonthly: 0, airbnb: false, rentedAirbnb: true, traditional: false, adminManages: false, adminIncluded: false, deductibleIR: false },
      { id: 'iptu', name: 'IPTU', amount: 0, ownerHoursMonthly: 0, airbnb: true, rentedAirbnb: false, traditional: false, adminManages: false, adminIncluded: false, deductibleIR: true },
      { id: 'tcl', name: 'TCL — coleta de lixo (R$ 625/ano)', amount: 625 / 12, ownerHoursMonthly: 0, airbnb: true, rentedAirbnb: false, traditional: false, adminManages: false, adminIncluded: false, deductibleIR: true },
      { id: 'agua', name: 'Água + esgoto', amount: 200, ownerHoursMonthly: 0, airbnb: true, rentedAirbnb: true, traditional: false, adminManages: false, adminIncluded: false, deductibleIR: false },
      { id: 'luz', name: 'Energia elétrica', amount: 400, ownerHoursMonthly: 0, airbnb: true, rentedAirbnb: true, traditional: false, adminManages: false, adminIncluded: false, deductibleIR: false },
      { id: 'gas', name: 'Gás', amount: 100, ownerHoursMonthly: 0, airbnb: true, rentedAirbnb: true, traditional: false, adminManages: false, adminIncluded: false, deductibleIR: false },
      { id: 'internet', name: 'Internet', amount: 120, ownerHoursMonthly: 0, airbnb: true, rentedAirbnb: true, traditional: false, adminManages: false, adminIncluded: false, deductibleIR: false },
      { id: 'condominio', name: 'Condomínio ordinário', amount: 450, ownerHoursMonthly: 0, airbnb: true, rentedAirbnb: true, traditional: false, adminManages: false, adminIncluded: false, deductibleIR: true },
      { id: 'contabilidade', name: 'Contabilidade / administração', amount: 0, ownerHoursMonthly: 0, airbnb: true, rentedAirbnb: true, traditional: false, adminManages: false, adminIncluded: false, deductibleIR: false },
      { id: 'licencas', name: 'Licenças e taxas administrativas', amount: 30, ownerHoursMonthly: 0, airbnb: true, rentedAirbnb: true, traditional: false, adminManages: false, adminIncluded: false, deductibleIR: false }
    ],
    percentageCosts: [
      { id: 'maintenance', name: 'Manutenção e reparos operacionais', pct: 2, rentedAirbnb: true, adminIncluded: false, deductibleIR: false },
      { id: 'losses', name: 'Perdas, danos e reembolsos não recuperados', pct: 0, rentedAirbnb: true, adminIncluded: false, deductibleIR: false }
    ],
    reserveFunds: [
      { id: 'replacement', name: 'Fundo de reposição de móveis e equipamentos', pct: 1, openingBalance: 0, adminIncluded: false }
    ],
    setupCosts: [
      { id: 'reforma', name: 'Reforma / adaptação inicial', amount: 0, rentedAmount: 2500, residualPct: 0, airbnb: true, rentedAirbnb: true, rentedOnlyIfUnfurnished: false, traditional: false, adminPays: false, adminAssetBelongsToOwner: true },
      { id: 'mobilia', name: 'Mobiliário', amount: 0, rentedAmount: 6000, residualPct: 40, airbnb: true, rentedAirbnb: true, rentedOnlyIfUnfurnished: true, traditional: false, adminPays: false, adminAssetBelongsToOwner: true },
      { id: 'eletro', name: 'Eletrodomésticos', amount: 0, rentedAmount: 12500, residualPct: 35, airbnb: true, rentedAirbnb: true, rentedOnlyIfUnfurnished: true, traditional: false, adminPays: false, adminAssetBelongsToOwner: true },
      { id: 'enxoval', name: 'Roupa de cama e banho inicial', amount: 0, rentedAmount: 1800, residualPct: 10, airbnb: true, rentedAirbnb: true, rentedOnlyIfUnfurnished: false, traditional: false, adminPays: false, adminAssetBelongsToOwner: true },
      { id: 'utensilios', name: 'Utensílios e equipamentos', amount: 0, rentedAmount: 1500, residualPct: 20, airbnb: true, rentedAirbnb: true, rentedOnlyIfUnfurnished: false, traditional: false, adminPays: false, adminAssetBelongsToOwner: true },
      { id: 'fechadura', name: 'Fechadura eletrônica / acesso', amount: 0, rentedAmount: 600, residualPct: 30, airbnb: true, rentedAirbnb: true, rentedOnlyIfUnfurnished: false, traditional: false, adminPays: false, adminAssetBelongsToOwner: true },
      { id: 'decoracao', name: 'Decoração', amount: 0, rentedAmount: 1500, residualPct: 25, airbnb: true, rentedAirbnb: true, rentedOnlyIfUnfurnished: true, traditional: false, adminPays: false, adminAssetBelongsToOwner: true },
      { id: 'fotografia', name: 'Fotografia profissional', amount: 0, rentedAmount: 700, residualPct: 0, airbnb: true, rentedAirbnb: true, rentedOnlyIfUnfurnished: false, traditional: false, adminPays: false, adminAssetBelongsToOwner: true },
      { id: 'setup-anuncio', name: 'Setup inicial do anúncio', amount: 0, rentedAmount: 0, residualPct: 0, airbnb: true, rentedAirbnb: true, rentedOnlyIfUnfurnished: false, traditional: false, adminPays: false, adminAssetBelongsToOwner: true },
      { id: 'cadastros', name: 'Licenças / cadastros iniciais', amount: 0, rentedAmount: 0, residualPct: 0, airbnb: true, rentedAirbnb: true, rentedOnlyIfUnfurnished: false, traditional: false, adminPays: false, adminAssetBelongsToOwner: true }
    ]
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const money2 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const percent = new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const number1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  function structuredCloneSafe(value) {
    return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
  }

  function uid(prefix = 'item') {
    if (typeof window !== 'undefined' && window.crypto && crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function n(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

  function getPath(obj, path) { return path.split('.').reduce((acc, key) => acc?.[key], obj); }

  function setPath(obj, path, value) {
    const parts = path.split('.');
    let ref = obj;
    parts.slice(0, -1).forEach((key) => {
      if (!ref[key] || typeof ref[key] !== 'object') ref[key] = {};
      ref = ref[key];
    });
    ref[parts.at(-1)] = value;
  }

  function applyWizardPatch(inputState, patch) {
    const next = structuredCloneSafe(inputState || defaultState);
    for (const [path, value] of Object.entries(patch?.values || {})) setPath(next, path, structuredCloneSafe(value));
    for (const [arrayName, updates] of Object.entries(patch?.arrayValues || {})) {
      if (!Array.isArray(next[arrayName])) continue;
      next[arrayName] = next[arrayName].map((item) => {
        const change = updates?.[String(item.id)];
        return change ? { ...item, ...structuredCloneSafe(change) } : item;
      });
    }
    return next;
  }

  function buildFinancialWizardPatch(draft = {}, inputState = defaultState) {
    const applicationType = String(draft.applicationType || 'other');
    const rateKind = ['nominal-gross', 'nominal-net', 'real-gross'].includes(draft.rateKind)
      ? draft.rateKind
      : 'nominal-gross';
    const ratePct = Math.max(0, n(draft.ratePct));
    const taxPct = clamp(n(draft.taxPct), 0, 100);
    const feesPct = Math.max(0, n(draft.feesPct));
    const termMonths = Math.max(1, Math.round(n(draft.termMonths, 12)));
    const liquidity = String(draft.liquidity || 'unknown');
    const role = ['benchmark', 'actual', 'both'].includes(draft.role) ? draft.role : 'benchmark';
    const errors = [];

    let mode = 'nominal';
    let nominalRatePct = Math.max(0, n(inputState?.investment?.nominalRatePct));
    let realRatePct = Math.max(0, n(inputState?.investment?.realRatePct));
    let convertedGrossNominalPct = null;

    if (rateKind === 'real-gross') {
      mode = 'ipcaPlus';
      realRatePct = ratePct;
    } else if (rateKind === 'nominal-net') {
      mode = 'nominal';
      if (taxPct >= 100 && ratePct > 0) {
        errors.push('Uma taxa líquida positiva não pode ser convertida quando o IR informado é 100%.');
      } else {
        const afterTaxFactor = Math.max(1e-9, 1 - taxPct / 100);
        nominalRatePct = ratePct / afterTaxFactor + feesPct;
        convertedGrossNominalPct = nominalRatePct;
      }
    } else {
      mode = 'nominal';
      nominalRatePct = ratePct;
    }

    const financialMeta = {
      configured: true,
      applicationType,
      rateKind,
      ratePct,
      taxPct,
      feesPct,
      termMonths,
      liquidity,
      role
    };

    const values = {
      'investment.mode': mode,
      'investment.taxPct': taxPct,
      'investment.feesPct': feesPct,
      'guidedSetup.financial': financialMeta
    };
    if (mode === 'ipcaPlus') values['investment.realRatePct'] = realRatePct;
    else values['investment.nominalRatePct'] = nominalRatePct;

    return {
      valid: errors.length === 0,
      errors,
      values,
      arrayValues: {},
      normalized: {
        mode,
        nominalRatePct,
        realRatePct,
        taxPct,
        feesPct,
        convertedGrossNominalPct,
        termMonths,
        liquidity,
        role,
        applicationType
      }
    };
  }


  function buildPropertyWizardPatch(draft = {}, inputState = defaultState) {
    const position = draft.position === 'buy' ? 'buy' : 'owned';
    const availableCapital = Math.max(0, n(draft.availableCapital));
    const currentMarketValue = Math.max(0, n(draft.currentMarketValue, inputState?.globals?.propertyValue));
    const purchasePrice = Math.max(0, n(draft.purchasePrice, currentMarketValue));
    const purchaseCosts = Math.max(0, n(draft.purchaseCosts));
    const propertyValue = position === 'buy' ? purchasePrice : currentMarketValue;
    const workingCapitalTarget = ['airbnbSelf','airbnbAdmin','traditional'].includes(draft.workingCapitalTarget)
      ? draft.workingCapitalTarget
      : 'airbnbSelf';
    const workingCapitalAmount = Math.max(0, n(draft.workingCapitalAmount));
    const salePriceAdjustmentPct = n(draft.salePriceAdjustmentPct);
    const brokeragePct = Math.max(0, n(draft.brokeragePct));
    const fixedCosts = Math.max(0, n(draft.fixedCosts));
    const mortgageBalance = Math.max(0, n(draft.mortgageBalance));
    const capitalGainsTax = Math.max(0, n(draft.capitalGainsTax));
    const otherCosts = Math.max(0, n(draft.otherCosts));

    const setupIds = ['reforma','mobilia','eletro','enxoval','utensilios','fechadura','decoracao','fotografia','setup-anuncio','cadastros'];
    const arrayValues = { setupCosts: {} };
    let setupTotal = 0;
    for (const id of setupIds) {
      const amount = Math.max(0, n(draft[`setup_${id}`]));
      arrayValues.setupCosts[id] = { amount };
      setupTotal += amount;
    }

    const purchaseCapitalNeedKnown = propertyValue + purchaseCosts + setupTotal + workingCapitalAmount;
    const purchaseFundingGap = position === 'buy' && availableCapital > 0
      ? Math.max(0, purchaseCapitalNeedKnown - availableCapital)
      : 0;

    const meta = {
      configured: true,
      position,
      availableCapital,
      purchasePrice,
      purchaseCosts,
      workingCapitalTarget,
      workingCapitalAmount,
      purchaseEconomicsComplete: position !== 'buy',
      modelGapIssue: position === 'buy' ? 42 : null
    };

    return {
      valid: true,
      errors: [],
      values: {
        'globals.propertyValue': propertyValue,
        'propertySale.salePriceAdjustmentPct': salePriceAdjustmentPct,
        'propertySale.brokeragePct': brokeragePct,
        'propertySale.fixedCosts': fixedCosts,
        'propertySale.mortgageBalance': mortgageBalance,
        'propertySale.capitalGainsTax': capitalGainsTax,
        'propertySale.otherCosts': otherCosts,
        [`workingCapital.${workingCapitalTarget}`]: workingCapitalAmount,
        'guidedSetup.acquisitionSale': meta
      },
      arrayValues,
      normalized: {
        position,
        availableCapital,
        propertyValue,
        purchasePrice,
        purchaseCosts,
        setupTotal,
        workingCapitalTarget,
        workingCapitalAmount,
        purchaseCapitalNeedKnown,
        purchaseFundingGap,
        purchaseCostsModeled: false,
        salePriceAdjustmentPct,
        brokeragePct,
        fixedCosts,
        mortgageBalance,
        capitalGainsTax,
        otherCosts
      }
    };
  }


  function buildAirbnbOpsWizardPatch(draft = {}) {
    const normalized = {
      avgStayNights: Math.max(0.1, n(draft.avgStayNights, 1)),
      cleaningFeeRevenue: Math.max(0, n(draft.cleaningFeeRevenue)),
      checkinCost: Math.max(0, n(draft.checkinCost)),
      cleaningCost: Math.max(0, n(draft.cleaningCost)),
      laundryCost: Math.max(0, n(draft.laundryCost)),
      guestSupportMonthly: Math.max(0, n(draft.guestSupportMonthly)),
      localSupportMonthly: Math.max(0, n(draft.localSupportMonthly)),
      marketingMonthly: Math.max(0, n(draft.marketingMonthly)),
      pmsMonthly: Math.max(0, n(draft.pmsMonthly)),
      pricingMonthly: Math.max(0, n(draft.pricingMonthly)),
      waterMonthly: Math.max(0, n(draft.waterMonthly)),
      electricityMonthly: Math.max(0, n(draft.electricityMonthly)),
      gasMonthly: Math.max(0, n(draft.gasMonthly)),
      internetMonthly: Math.max(0, n(draft.internetMonthly))
    };
    const meta = { configured: true, ...normalized };
    return {
      valid: true,
      errors: [],
      values: {
        'airbnb.avgStayNights': normalized.avgStayNights,
        'airbnb.cleaningFeeRevenue': normalized.cleaningFeeRevenue,
        'guidedSetup.airbnbOps': meta
      },
      arrayValues: {
        stayCosts: {
          checkin: { amount: normalized.checkinCost },
          limpeza: { amount: normalized.cleaningCost },
          lavanderia: { amount: normalized.laundryCost }
        },
        monthlyCosts: {
          'guest-support': { amount: normalized.guestSupportMonthly },
          'local-support': { amount: normalized.localSupportMonthly },
          marketing: { amount: normalized.marketingMonthly },
          software: { amount: normalized.pmsMonthly },
          pricing: { amount: normalized.pricingMonthly },
          agua: { amount: normalized.waterMonthly },
          luz: { amount: normalized.electricityMonthly },
          gas: { amount: normalized.gasMonthly },
          internet: { amount: normalized.internetMonthly }
        }
      },
      normalized
    };
  }

  function mergeDefaults(base, incoming) {
    if (Array.isArray(base)) return Array.isArray(incoming) ? structuredCloneSafe(incoming) : structuredCloneSafe(base);
    if (base && typeof base === 'object') {
      const out = {};
      for (const key of Object.keys(base)) out[key] = mergeDefaults(base[key], incoming?.[key]);
      if (incoming && typeof incoming === 'object') {
        for (const key of Object.keys(incoming)) if (!(key in out)) out[key] = incoming[key];
      }
      return out;
    }
    return incoming ?? base;
  }

  function mergeArrayById(defaults, incoming) {
    if (!Array.isArray(incoming)) return structuredCloneSafe(defaults);
    const byId = new Map(incoming.map((item) => [String(item.id), structuredCloneSafe(item)]));
    const result = defaults.map((def) => ({ ...structuredCloneSafe(def), ...(byId.get(String(def.id)) || {}) }));
    const defaultIds = new Set(defaults.map((x) => String(x.id)));
    for (const item of incoming) if (!defaultIds.has(String(item.id))) result.push(structuredCloneSafe(item));
    return result;
  }

  function normalizeState(incoming) {
    const source = incoming && typeof incoming === 'object' ? incoming : {};
    const incomingVersion = Math.max(1, n(source.version, 1));
    const merged = mergeDefaults(defaultState, source);

    merged.seasons = (Array.isArray(source.seasons) ? source.seasons : defaultState.seasons).map((item) => {
      const hasClassifiedUnavailability = ['personalUseDays', 'habitualUseDays', 'operationalUnavailableDays']
        .some((key) => item?.[key] != null);
      const personalUseDays = Math.max(0, n(item.personalUseDays, 0));
      const habitualUseDays = Math.max(0, n(item.habitualUseDays, 0));
      const operationalUnavailableDays = Math.max(0, n(
        hasClassifiedUnavailability ? item.operationalUnavailableDays : item.unavailableDays,
        0
      ));
      return {
        ...item,
        personalUseDays,
        habitualUseDays,
        operationalUnavailableDays,
        unavailableDays: personalUseDays + habitualUseDays + operationalUnavailableDays
      };
    });

    const staySource = incomingVersion >= 2 && Array.isArray(source.stayCosts) ? source.stayCosts : mergeArrayById(defaultState.stayCosts, source.stayCosts);
    const monthlySource = incomingVersion >= 2 && Array.isArray(source.monthlyCosts) ? source.monthlyCosts : mergeArrayById(defaultState.monthlyCosts, source.monthlyCosts);
    let percentageSource = incomingVersion >= 2 && Array.isArray(source.percentageCosts) ? source.percentageCosts : mergeArrayById(defaultState.percentageCosts, source.percentageCosts);
    const setupSource = incomingVersion >= 2 && Array.isArray(source.setupCosts) ? source.setupCosts : mergeArrayById(defaultState.setupCosts, source.setupCosts);

    merged.stayCosts = staySource.map((item) => {
      const def = defaultState.stayCosts.find((x) => String(x.id) === String(item.id));
      return {
        ...item,
        ownerHoursPerReservation: Math.max(0, n(item.ownerHoursPerReservation, def?.ownerHoursPerReservation ?? 0)),
        adminManages: Boolean(item.adminManages),
        adminIncluded: Boolean(item.adminIncluded),
        deductibleIR: item.deductibleIR == null ? Boolean(def?.deductibleIR) : Boolean(item.deductibleIR)
      };
    });
    merged.monthlyCosts = monthlySource.map((item) => {
      const def = defaultState.monthlyCosts.find((x) => String(x.id) === String(item.id));
      return {
        ...item,
        ownerHoursMonthly: Math.max(0, n(item.ownerHoursMonthly, def?.ownerHoursMonthly ?? 0)),
        airbnb: item.airbnb !== false,
        hybridIncremental: Boolean(item.hybridIncremental),
        rentedAirbnb: item.rentedAirbnb == null ? item.airbnb !== false : Boolean(item.rentedAirbnb),
        traditional: Boolean(item.traditional),
        adminManages: Boolean(item.adminManages),
        adminIncluded: Boolean(item.adminIncluded),
        deductibleIR: item.deductibleIR == null ? Boolean(def?.deductibleIR) : Boolean(item.deductibleIR)
      };
    });

    // A partir da V3, provisões/reservas deixam de ser OPEX. Arquivos antigos
    // que tinham o FRA dentro de percentageCosts são migrados para reserveFunds.
    let legacyReplacement = null;
    if (Array.isArray(percentageSource)) {
      legacyReplacement = percentageSource.find((x) => String(x.id) === 'replacement') || null;
      percentageSource = percentageSource.filter((x) => String(x.id) !== 'replacement');
    }
    merged.percentageCosts = percentageSource.map((item) => {
      const def = defaultState.percentageCosts.find((x) => String(x.id) === String(item.id));
      return {
        ...item,
        rentedAirbnb: item.rentedAirbnb == null ? Boolean(def?.rentedAirbnb ?? true) : Boolean(item.rentedAirbnb),
        adminIncluded: Boolean(item.adminIncluded),
        deductibleIR: item.deductibleIR == null ? Boolean(def?.deductibleIR) : Boolean(item.deductibleIR)
      };
    });

    let reserveSource;
    if (Array.isArray(source.reserveFunds)) reserveSource = source.reserveFunds;
    else if (legacyReplacement) reserveSource = [{
      id: 'replacement',
      name: legacyReplacement.name || 'Fundo de reposição de móveis e equipamentos',
      pct: n(legacyReplacement.pct, 0),
      openingBalance: 0,
      adminIncluded: Boolean(legacyReplacement.adminIncluded)
    }];
    else reserveSource = structuredCloneSafe(defaultState.reserveFunds);
    merged.reserveFunds = reserveSource.map((item) => ({
      ...item,
      pct: Math.max(0, n(item.pct)),
      openingBalance: Math.max(0, n(item.openingBalance)),
      adminIncluded: Boolean(item.adminIncluded)
    }));

    merged.setupCosts = setupSource.map((item) => {
      const defaultItem = defaultState.setupCosts.find((x) => String(x.id) === String(item.id));
      return {
        ...item,
        residualPct: clamp(n(item.residualPct, defaultItem?.residualPct ?? 0), 0, 100),
        rentedAmount: Math.max(0, n(item.rentedAmount, item.amount)),
        airbnb: item.airbnb !== false,
        rentedAirbnb: item.rentedAirbnb == null ? item.airbnb !== false : Boolean(item.rentedAirbnb),
        rentedOnlyIfUnfurnished: item.rentedOnlyIfUnfurnished == null
          ? Boolean(defaultItem?.rentedOnlyIfUnfurnished)
          : Boolean(item.rentedOnlyIfUnfurnished),
        traditional: Boolean(item.traditional),
        // V8: quem paga e quem fica com o ativo são dimensões independentes.
        // Para JSONs antigos, preservamos a semântica anterior:
        // "incluído na admin" = admin paga e o residual não era do proprietário.
        adminPays: item.adminPays == null ? Boolean(item.adminIncluded) : Boolean(item.adminPays),
        adminAssetBelongsToOwner: item.adminAssetBelongsToOwner == null
          ? !Boolean(item.adminIncluded)
          : Boolean(item.adminAssetBelongsToOwner)
      };
    });

    // Migração transparente da V1.
    if (!Array.isArray(source.percentageCosts) && source.airbnb?.reservePct != null) {
      const replacement = merged.reserveFunds.find((x) => x.id === 'replacement');
      if (replacement) replacement.pct = n(source.airbnb.reservePct);
    }
    if (source.airbnb?.adminIncludesTurnover != null && Array.isArray(source.stayCosts) && !source.stayCosts.some((x) => Object.prototype.hasOwnProperty.call(x, 'adminIncluded'))) {
      merged.stayCosts.forEach((item) => { item.adminIncluded = Boolean(source.airbnb.adminIncludesTurnover); });
    }
    if (source.traditional?.reservePct != null && source.traditional?.maintenancePct == null) {
      merged.traditional.maintenancePct = n(source.traditional.reservePct);
    }

    // V4: a valorização do imóvel passa a ser informada em termos reais
    // (acima da inflação). Arquivos anteriores guardavam uma taxa nominal.
    if (source.globals?.propertyRealAppreciationPct == null) {
      if (source.globals?.propertyAppreciationPct != null) {
        const legacyNominal = n(source.globals.propertyAppreciationPct) / 100;
        const legacyInflation = n(source.globals.inflationPct, defaultState.globals.inflationPct) / 100;
        merged.globals.propertyRealAppreciationPct = (1 + legacyInflation) > 0
          ? (((1 + legacyNominal) / (1 + legacyInflation)) - 1) * 100
          : n(defaultState.globals.propertyRealAppreciationPct);
      } else merged.globals.propertyRealAppreciationPct = n(defaultState.globals.propertyRealAppreciationPct);
    }
    if (merged.globals && Object.prototype.hasOwnProperty.call(merged.globals, 'propertyAppreciationPct')) delete merged.globals.propertyAppreciationPct;

    // V6 / Rodada A: o tempo do cenário administrado passa a ser derivado das
    // atividades não delegadas + uma supervisão residual. O antigo campo
    // adminHoursMonthly é migrado para supervisão para não perder simulações.
    if (source.work?.supervisionAdminHoursMonthly == null) {
      merged.work.supervisionAdminHoursMonthly = Math.max(0, n(source.work?.adminHoursMonthly, 0));
    }
    if (merged.work && Object.prototype.hasOwnProperty.call(merged.work, 'adminHoursMonthly')) delete merged.work.adminHoursMonthly;

    // V8 / Rodada B: remover o campo legado de CAPEX após a migração.
    merged.setupCosts.forEach((item) => {
      if (Object.prototype.hasOwnProperty.call(item, 'adminIncluded')) delete item.adminIncluded;
    });

    // V9 / Rodada C: capital de giro manual é patrimônio vinculado por estratégia.
    for (const key of ['airbnbSelf', 'airbnbAdmin', 'rentedAirbnb', 'traditional']) {
      merged.workingCapital[key] = Math.max(0, n(merged.workingCapital[key], 0));
    }

    // V10: se o arquivo/autosave for exatamente o antigo cenário-base V9
    // (sazonalidade B0 + trabalho todo zerado), migramos para a nova calibração.
    // Simulações customizadas preservam seus próprios valores.
    const legacyV9SeasonIds = ['alta', 'ombro', 'baixa'];
    const hasLegacyV9Seasons = incomingVersion === 9
      && Array.isArray(source.seasons)
      && source.seasons.length === 3
      && source.seasons.every((x, index) => String(x.id) === legacyV9SeasonIds[index])
      && n(source.seasons[0]?.nightlyRate) === 649 && n(source.seasons[0]?.occupancyPct) === 51
      && n(source.seasons[1]?.nightlyRate) === 602 && n(source.seasons[1]?.occupancyPct) === 46
      && n(source.seasons[2]?.nightlyRate) === 582 && n(source.seasons[2]?.occupancyPct) === 46;
    const legacyWorkZeros = incomingVersion === 9
      && n(source.globals?.ownerHourlyValue) === 0
      && ['selfHoursMonthly','supervisionAdminHoursMonthly','traditionalHoursMonthly','investmentHoursMonthly','rentedAirbnbHoursMonthly']
        .every((key) => n(source.work?.[key]) === 0)
      && Array.isArray(source.stayCosts) && source.stayCosts.every((x) => n(x.ownerHoursPerReservation) === 0)
      && Array.isArray(source.monthlyCosts) && source.monthlyCosts.every((x) => n(x.ownerHoursMonthly) === 0);
    if (hasLegacyV9Seasons && legacyWorkZeros) {
      merged.globals.ownerHourlyValue = defaultState.globals.ownerHourlyValue;
      merged.work = structuredCloneSafe(defaultState.work);
      merged.seasons = structuredCloneSafe(defaultState.seasons);
      const stayHours = new Map(defaultState.stayCosts.map((x) => [String(x.id), x.ownerHoursPerReservation]));
      merged.stayCosts.forEach((x) => { if (stayHours.has(String(x.id))) x.ownerHoursPerReservation = stayHours.get(String(x.id)); });
      const monthlyHours = new Map(defaultState.monthlyCosts.map((x) => [String(x.id), x.ownerHoursMonthly]));
      merged.monthlyCosts.forEach((x) => { if (monthlyHours.has(String(x.id))) x.ownerHoursMonthly = monthlyHours.get(String(x.id)); });
    }

    // V11: o antigo cenário-base V10 recebe a nova calibração contratual do
    // Airbnb alugado. Simulações customizadas preservam os flags que já tinham.
    const sourceMonthlyById = new Map((Array.isArray(source.monthlyCosts) ? source.monthlyCosts : []).map((x) => [String(x.id), x]));
    const looksLikeV10RentalDefault = incomingVersion === 10
      && source.name === 'Rio de Janeiro — cenário-base de mercado (out/2026)'
      && source.rentedAirbnb?.furnished == null
      && source.rentedAirbnb?.subleaseAuthorized == null
      && sourceMonthlyById.get('condominio')?.rentedAirbnb === false
      && sourceMonthlyById.get('iptu')?.rentedAirbnb === false
      && sourceMonthlyById.get('seguro')?.rentedAirbnb === true
      && !sourceMonthlyById.has('seguro-garantia');
    if (looksLikeV10RentalDefault) {
      merged.rentedAirbnb.furnished = defaultState.rentedAirbnb.furnished;
      merged.rentedAirbnb.subleaseAuthorized = defaultState.rentedAirbnb.subleaseAuthorized;
      const condo = merged.monthlyCosts.find((x) => String(x.id) === 'condominio');
      if (condo) { condo.rentedAirbnb = true; condo.name = 'Condomínio ordinário'; }
      const insurance = merged.monthlyCosts.find((x) => String(x.id) === 'seguro');
      if (insurance) { insurance.rentedAirbnb = false; insurance.name = 'Seguro do imóvel / incêndio'; }
      if (!merged.monthlyCosts.some((x) => String(x.id) === 'seguro-garantia')) {
        const guarantee = defaultState.monthlyCosts.find((x) => String(x.id) === 'seguro-garantia');
        if (guarantee) merged.monthlyCosts.push(structuredCloneSafe(guarantee));
      }
    }

    // V12: recalibração de utilities do antigo cenário-base V11.
    // Só migra quando os três valores ainda são exatamente os defaults antigos
    // e as principais premissas do cenário-base permanecem intactas.
    const sourceMonthlyByIdV12 = new Map((Array.isArray(source.monthlyCosts) ? source.monthlyCosts : []).map((x) => [String(x.id), x]));
    const looksLikeV11UtilityDefault = incomingVersion === 11
      && source.name === 'Rio de Janeiro — cenário-base de mercado (out/2026)'
      && n(source.globals?.propertyValue) === 636000
      && n(source.globals?.ownerHourlyValue) === 100
      && n(source.rentedAirbnb?.monthlyLeaseRent) === 3500
      && n(source.traditional?.monthlyRent) === 3500
      && Array.isArray(source.seasons) && source.seasons.length === 6
      && sourceMonthlyByIdV12.get('agua')?.amount === 30
      && sourceMonthlyByIdV12.get('luz')?.amount === 250
      && sourceMonthlyByIdV12.get('gas')?.amount === 40;
    if (looksLikeV11UtilityDefault) {
      for (const id of ['agua','luz','gas']) {
        const target = merged.monthlyCosts.find((x) => String(x.id) === id);
        const def = defaultState.monthlyCosts.find((x) => String(x.id) === id);
        if (target && def) {
          target.amount = def.amount;
          target.name = def.name;
        }
      }
    }

    // V13: calibração específica do imóvel-base da Rua Maestro Francisco Braga.
    // O IPTU é isento e permanece apenas a TCL anual de R$ 625.
    const sourceMonthlyByIdV13 = new Map((Array.isArray(source.monthlyCosts) ? source.monthlyCosts : []).map((x) => [String(x.id), x]));
    const looksLikeV12PropertyDefault = incomingVersion === 12
      && source.name === 'Rio de Janeiro — cenário-base de mercado (out/2026)'
      && n(source.globals?.propertyValue) === 636000
      && sourceMonthlyByIdV13.get('iptu')?.amount === 50
      && !sourceMonthlyByIdV13.has('tcl');
    if (looksLikeV12PropertyDefault) {
      const iptu = merged.monthlyCosts.find((x) => String(x.id) === 'iptu');
      if (iptu) iptu.amount = 0;
      const tcl = defaultState.monthlyCosts.find((x) => String(x.id) === 'tcl');
      if (tcl && !merged.monthlyCosts.some((x) => String(x.id) === 'tcl')) {
        merged.monthlyCosts.push(structuredCloneSafe(tcl));
      }
    }

    // V14: benchmark financeiro passa a considerar a conversão do imóvel em
    // capital líquido. O antigo cenário-base recebe 5% de corretagem; arquivos
    // customizados anteriores preservam a antiga semântica (venda sem custo)
    // até que o usuário configure explicitamente os custos de saída.
    if (incomingVersion < 14) {
      const sourceMonthlyByIdV14 = new Map((Array.isArray(source.monthlyCosts) ? source.monthlyCosts : []).map((x) => [String(x.id), x]));
      const looksLikeV13Base = incomingVersion === 13
        && source.name === 'Rio de Janeiro — cenário-base de mercado (out/2026)'
        && n(source.globals?.propertyValue) === 636000
        && n(source.globals?.ownerHourlyValue) === 100
        && source.analysis?.startingPosition === 'property'
        && sourceMonthlyByIdV14.get('iptu')?.amount === 0
        && Math.abs(n(sourceMonthlyByIdV14.get('tcl')?.amount) * 12 - 625) < 0.01
        && sourceMonthlyByIdV14.get('agua')?.amount === 200
        && sourceMonthlyByIdV14.get('luz')?.amount === 400
        && sourceMonthlyByIdV14.get('gas')?.amount === 100;
      if (!looksLikeV13Base) {
        merged.propertySale = {
          salePriceAdjustmentPct: 0,
          brokeragePct: 0,
          fixedCosts: 0,
          mortgageBalance: 0,
          capitalGainsTax: 0,
          otherCosts: 0
        };
      }
    }

    // V15: o cenário-base passa a ter CAPEX específico para montar um
    // imóvel alugado vazio. Arquivos customizados anteriores preservam a
    // semântica antiga: se não tinham rentedAmount, usam o próprio amount.
    if (incomingVersion < 15) {
      const looksLikeV14Base = incomingVersion === 14
        && source.name === 'Rio de Janeiro — cenário-base de mercado (out/2026)'
        && n(source.globals?.propertyValue) === 636000
        && source.analysis?.startingPosition === 'property'
        && source.rentedAirbnb?.furnished === false
        && Array.isArray(source.setupCosts)
        && source.setupCosts.every((x) => n(x.amount) === 0 && x.rentedAmount == null);
      if (looksLikeV14Base) {
        const defaultsById = new Map(defaultState.setupCosts.map((x) => [String(x.id), x]));
        merged.setupCosts.forEach((x) => {
          const def = defaultsById.get(String(x.id));
          if (def) {
            x.rentedAmount = def.rentedAmount;
            x.rentedOnlyIfUnfurnished = def.rentedOnlyIfUnfurnished;
          }
        });
      }
    }

    merged.market = merged.market || structuredCloneSafe(defaultState.market);
    merged.market.subject = mergeDefaults(defaultState.market.subject, source.market?.subject || merged.market.subject);
    const shouldSeedBaseMarketEvidence = incomingVersion === 22
      && source.name === 'Rio de Janeiro — cenário-base de mercado (out/2026)'
      && Array.isArray(source.market?.comparables)
      && source.market.comparables.length === 0
      && source.market?.subject?.address === 'Rua Maestro Francisco Braga, 76, apto 405';
    const marketComparableSource = shouldSeedBaseMarketEvidence
      ? defaultState.market.comparables
      : (Array.isArray(source.market?.comparables) ? source.market.comparables : []);
    if (shouldSeedBaseMarketEvidence) {
      merged.market.subject.elevator = 'yes';
      merged.market.evidenceSnapshot = structuredCloneSafe(defaultState.market.evidenceSnapshot);
    }
    merged.market.comparables = marketComparableSource.map((item) => ({
      id: String(item.id || uid('comp')),
      name: String(item.name || 'Comparável'),
      source: String(item.source || 'other'),
      sourceRef: String(item.sourceRef || ''),
      collectedAt: String(item.collectedAt || ''),
      evidenceNote: String(item.evidenceNote || ''),
      distanceKm: Math.max(0, n(item.distanceKm)),
      roomType: String(item.roomType || ''),
      bedrooms: Math.max(0, n(item.bedrooms)),
      guests: Math.max(0, n(item.guests)),
      beds: Math.max(0, n(item.beds)),
      bathrooms: Math.max(0, n(item.bathrooms)),
      acUnits: Math.max(0, n(item.acUnits)),
      elevator: String(item.elevator || 'unknown'),
      parking: String(item.parking || 'unknown'),
      qualityGrade: clamp(n(item.qualityGrade), 0, 5),
      rating: clamp(n(item.rating), 0, 5),
      reviewCount: Math.max(0, n(item.reviewCount)),
      activeRecently: Boolean(item.activeRecently),
      minStayNights: Math.max(0, n(item.minStayNights)),
      nightlyRate: Math.max(0, n(item.nightlyRate)),
      occupancyPct: clamp(n(item.occupancyPct), 0, 100),
      occupancyEvidence: String(item.occupancyEvidence || 'none')
    }));

    // V17: cenário-base passa a destacar 5 anos, mantendo 1/3/5 visíveis.
    if (incomingVersion === 16
      && source.name === 'Rio de Janeiro — cenário-base de mercado (out/2026)'
      && n(source.analysis?.horizonYears, 1) === 1) {
      merged.analysis.horizonYears = 5;
    }

    // V20: política explícita de fim do horizonte para o imóvel alugado.
    // Até a Issue #40, apenas renovação/continuidade é calculada.
    merged.rentedAirbnb.contractEndStrategy = source.rentedAirbnb?.contractEndStrategy === 'renew'
      ? 'renew'
      : 'renew';

    // V22: indisponibilidade anual passa a ser classificada por motivo.
    // JSONs antigos migram "unavailableDays" para indisponibilidade operacional.
    // V23: o cenário-base recebe um snapshot auditável de comparáveis públicos.
    // Nenhum valor de mercado é aplicado automaticamente às premissas.
    // V24: wizards passam a guardar metadados de configuração sem criar regras econômicas paralelas.
    merged.version = APP_VERSION;
    return merged;
  }

  function loadAutosave() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return normalizeState(JSON.parse(raw));
    } catch { return null; }
  }

  let state = loadAutosave() || normalizeState(defaultState);
  let lastCalculation = null;

  function autosave() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      const el = $('#autosaveStatus');
      if (el) el.textContent = 'salvo localmente';
    } catch {
      const el = $('#autosaveStatus');
      if (el) el.textContent = 'sem autosave';
    }
  }

  function bindStaticInputs() {
    $$('[data-path]').forEach((input) => {
      const eventName = input.type === 'checkbox' ? 'change' : 'input';
      input.addEventListener(eventName, () => {
        let value;
        if (input.type === 'checkbox') value = input.checked;
        else if (input.type === 'number') value = input.value === '' ? 0 : n(input.value);
        else value = input.value;
        setPath(state, input.dataset.path, value);
        autosave();
        if (input.dataset.path === 'rentedAirbnb.furnished') renderSetupCosts();
        if (input.dataset.path.startsWith('market.subject.')) renderMarketComparables();
        calculateAndRender();
      });
    });

    $$('input[name="investmentMode"]').forEach((radio) => radio.addEventListener('change', () => {
      if (!radio.checked) return;
      state.investment.mode = radio.value;
      autosave();
      renderInvestmentMode();
      calculateAndRender();
    }));
  }

  function hydrateStaticInputs() {
    $$('[data-path]').forEach((input) => {
      const value = getPath(state, input.dataset.path);
      if (input.type === 'checkbox') input.checked = Boolean(value);
      else input.value = value ?? '';
    });
    $$('input[name="investmentMode"]').forEach((radio) => { radio.checked = radio.value === state.investment.mode; });
    renderInvestmentMode();
  }

  function renderInvestmentMode() {
    const nominal = state.investment.mode === 'nominal';
    $('#nominalRateGroup')?.classList.toggle('hidden', !nominal);
    $('#realRateGroup')?.classList.toggle('hidden', nominal);
  }

  function renderSeasons() {
    $('#seasonRows').innerHTML = state.seasons.map((item) => {
      const days = Math.max(0, n(item.days));
      const personal = Math.max(0, n(item.personalUseDays));
      const habitual = Math.max(0, n(item.habitualUseDays));
      const operational = Math.max(0, n(item.operationalUnavailableDays));
      const available = Math.max(0, days - personal - habitual - operational);
      return `
      <tr data-id="${escapeAttr(item.id)}">
        <td><input class="row-name" data-array="seasons" data-field="name" data-id="${escapeAttr(item.id)}" type="text" value="${escapeAttr(item.name)}" /></td>
        <td><input data-array="seasons" data-field="days" data-id="${escapeAttr(item.id)}" type="number" min="0" step="1" value="${n(item.days)}" /></td>
        <td><input data-array="seasons" data-field="personalUseDays" data-id="${escapeAttr(item.id)}" type="number" min="0" step="1" value="${personal}" /></td>
        <td><input data-array="seasons" data-field="habitualUseDays" data-id="${escapeAttr(item.id)}" type="number" min="0" step="1" value="${habitual}" /></td>
        <td><input data-array="seasons" data-field="operationalUnavailableDays" data-id="${escapeAttr(item.id)}" type="number" min="0" step="1" value="${operational}" /></td>
        <td class="number-cell" data-season-available="${escapeAttr(item.id)}">${number1.format(available)}</td>
        <td><input data-array="seasons" data-field="nightlyRate" data-id="${escapeAttr(item.id)}" type="number" min="0" step="10" value="${n(item.nightlyRate)}" /></td>
        <td><input data-array="seasons" data-field="occupancyPct" data-id="${escapeAttr(item.id)}" type="number" min="0" max="100" step="1" value="${n(item.occupancyPct)}" /></td>
        <td class="money-cell" data-season-revenue="${escapeAttr(item.id)}">—</td>
        <td><button class="button icon" type="button" data-remove-array="seasons" data-id="${escapeAttr(item.id)}">Remover</button></td>
      </tr>`;
    }).join('');
  }

  function renderStayCosts() {
    $('#stayCostRows').innerHTML = state.stayCosts.map((item) => `
      <tr>
        <td><input class="row-name" data-array="stayCosts" data-field="name" data-id="${escapeAttr(item.id)}" type="text" value="${escapeAttr(item.name)}" /></td>
        <td><input data-array="stayCosts" data-field="amount" data-id="${escapeAttr(item.id)}" type="number" min="0" step="5" value="${n(item.amount)}" /></td>
        <td><input data-array="stayCosts" data-field="ownerHoursPerReservation" data-id="${escapeAttr(item.id)}" type="number" min="0" step="0.1" value="${n(item.ownerHoursPerReservation)}" aria-label="Horas suas por reserva" /></td>
        <td class="center-cell"><input data-array="stayCosts" data-field="adminManages" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.adminManages ? 'checked' : ''} aria-label="Administradora gerencia esta atividade" /></td>
        <td class="center-cell"><input data-array="stayCosts" data-field="adminIncluded" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.adminIncluded ? 'checked' : ''} aria-label="Custo incluído na administradora" /></td>
        <td class="center-cell"><input data-array="stayCosts" data-field="deductibleIR" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.deductibleIR ? 'checked' : ''} aria-label="Dedutível da base de IR" /></td>
        <td><button class="button icon" type="button" data-remove-array="stayCosts" data-id="${escapeAttr(item.id)}">Remover</button></td>
      </tr>`).join('');
  }

  function renderMonthlyCosts() {
    $('#monthlyCostRows').innerHTML = state.monthlyCosts.map((item) => `
      <tr>
        <td><input class="row-name" data-array="monthlyCosts" data-field="name" data-id="${escapeAttr(item.id)}" type="text" value="${escapeAttr(item.name)}" /></td>
        <td><input data-array="monthlyCosts" data-field="amount" data-id="${escapeAttr(item.id)}" type="number" min="0" step="0.01" value="${Number(n(item.amount).toFixed(2))}" /></td>
        <td><input data-array="monthlyCosts" data-field="ownerHoursMonthly" data-id="${escapeAttr(item.id)}" type="number" min="0" step="0.1" value="${n(item.ownerHoursMonthly)}" aria-label="Horas suas por mês" /></td>
        <td class="center-cell"><input data-array="monthlyCosts" data-field="airbnb" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.airbnb ? 'checked' : ''} /></td>
        <td class="center-cell"><input data-array="monthlyCosts" data-field="hybridIncremental" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.hybridIncremental ? 'checked' : ''} ${item.airbnb ? '' : 'disabled'} aria-label="Custo incremental no uso híbrido" /></td>
        <td class="center-cell"><input data-array="monthlyCosts" data-field="rentedAirbnb" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.rentedAirbnb ? 'checked' : ''} /></td>
        <td class="center-cell"><input data-array="monthlyCosts" data-field="traditional" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.traditional ? 'checked' : ''} /></td>
        <td class="center-cell"><input data-array="monthlyCosts" data-field="adminManages" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.adminManages ? 'checked' : ''} ${item.airbnb ? '' : 'disabled'} /></td>
        <td class="center-cell"><input data-array="monthlyCosts" data-field="adminIncluded" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.adminIncluded ? 'checked' : ''} ${item.airbnb ? '' : 'disabled'} /></td>
        <td class="center-cell"><input data-array="monthlyCosts" data-field="deductibleIR" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.deductibleIR ? 'checked' : ''} /></td>
        <td><button class="button icon" type="button" data-remove-array="monthlyCosts" data-id="${escapeAttr(item.id)}">Remover</button></td>
      </tr>`).join('');
  }

  function renderPercentageCosts() {
    $('#percentageCostRows').innerHTML = state.percentageCosts.map((item) => `
      <tr>
        <td><input class="row-name" data-array="percentageCosts" data-field="name" data-id="${escapeAttr(item.id)}" type="text" value="${escapeAttr(item.name)}" /></td>
        <td><input data-array="percentageCosts" data-field="pct" data-id="${escapeAttr(item.id)}" type="number" min="0" step="0.1" value="${n(item.pct)}" /></td>
        <td class="center-cell"><input data-array="percentageCosts" data-field="rentedAirbnb" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.rentedAirbnb ? 'checked' : ''} aria-label="Aplica ao Airbnb em imóvel alugado" /></td>
        <td class="center-cell"><input data-array="percentageCosts" data-field="adminIncluded" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.adminIncluded ? 'checked' : ''} /></td>
        <td class="center-cell"><input data-array="percentageCosts" data-field="deductibleIR" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.deductibleIR ? 'checked' : ''} /></td>
        <td><button class="button icon" type="button" data-remove-array="percentageCosts" data-id="${escapeAttr(item.id)}">Remover</button></td>
      </tr>`).join('');
  }

  function renderReserveFunds() {
    $('#reserveFundRows').innerHTML = state.reserveFunds.map((item) => `
      <tr>
        <td><input class="row-name" data-array="reserveFunds" data-field="name" data-id="${escapeAttr(item.id)}" type="text" value="${escapeAttr(item.name)}" /></td>
        <td><input data-array="reserveFunds" data-field="pct" data-id="${escapeAttr(item.id)}" type="number" min="0" step="0.1" value="${n(item.pct)}" /></td>
        <td><input data-array="reserveFunds" data-field="openingBalance" data-id="${escapeAttr(item.id)}" type="number" min="0" step="50" value="${n(item.openingBalance)}" /></td>
        <td class="center-cell"><input data-array="reserveFunds" data-field="adminIncluded" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.adminIncluded ? 'checked' : ''} /></td>
        <td><button class="button icon" type="button" data-remove-array="reserveFunds" data-id="${escapeAttr(item.id)}">Remover</button></td>
      </tr>`).join('');
  }

  function renderSetupCosts() {
    $('#setupCostRows').innerHTML = state.setupCosts.map((item) => {
      const residualPct = clamp(n(item.residualPct), 0, 100);
      const residualValue = Math.max(0, n(item.amount)) * residualPct / 100;
      const rentedResidualValue = Math.max(0, n(item.rentedAmount, item.amount)) * residualPct / 100;
      return `
      <tr>
        <td><input class="row-name" data-array="setupCosts" data-field="name" data-id="${escapeAttr(item.id)}" type="text" value="${escapeAttr(item.name)}" /></td>
        <td><input data-array="setupCosts" data-field="amount" data-id="${escapeAttr(item.id)}" type="number" min="0" step="50" value="${n(item.amount)}" /></td>
        <td><input data-array="setupCosts" data-field="rentedAmount" data-id="${escapeAttr(item.id)}" type="number" min="0" step="50" value="${n(item.rentedAmount, item.amount)}" aria-label="Valor específico no Airbnb alugado" /></td>
        <td><input data-array="setupCosts" data-field="residualPct" data-id="${escapeAttr(item.id)}" type="number" min="0" max="100" step="1" value="${residualPct}" /></td>
        <td class="money-cell">${money.format(residualValue)}</td>
        <td class="money-cell">${money.format(rentedResidualValue)}</td>
        <td class="center-cell"><input data-array="setupCosts" data-field="airbnb" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.airbnb ? 'checked' : ''} /></td>
        <td class="center-cell"><input data-array="setupCosts" data-field="rentedAirbnb" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.rentedAirbnb ? 'checked' : ''} /></td>
        <td class="center-cell"><input data-array="setupCosts" data-field="rentedOnlyIfUnfurnished" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.rentedOnlyIfUnfurnished ? 'checked' : ''} ${item.rentedAirbnb ? '' : 'disabled'} aria-label="Aplicar ao cenário alugado apenas se não mobiliado" /></td>
        <td class="center-cell"><input data-array="setupCosts" data-field="traditional" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.traditional ? 'checked' : ''} /></td>
        <td class="center-cell"><input data-array="setupCosts" data-field="adminPays" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.adminPays ? 'checked' : ''} ${item.airbnb ? '' : 'disabled'} /></td>
        <td class="center-cell"><input data-array="setupCosts" data-field="adminAssetBelongsToOwner" data-id="${escapeAttr(item.id)}" type="checkbox" ${item.adminAssetBelongsToOwner ? 'checked' : ''} ${item.airbnb ? '' : 'disabled'} /></td>
        <td><button class="button icon" type="button" data-remove-array="setupCosts" data-id="${escapeAttr(item.id)}">Remover</button></td>
      </tr>`;
    }).join('');
  }

  function calculateMarketSuggestion(inputState = state) {
    const market = calculateMarketComparables(inputState.market);
    const calc = calculateModel(inputState);
    const currentRate = Math.max(0, n(calc.averageNightlyRate));
    const currentOccupancyPct = clamp(n(calc.weightedOccupancy) * 100, 0, 100);

    const confidence = market.eligibleCount >= 25 && market.occupancyCount >= 15
      ? 'high'
      : market.eligibleCount >= 15 && market.occupancyCount >= 5
        ? 'medium'
        : 'low';

    const build = (key, priceValue, occupancyValue) => {
      const hasPrice = market.priceCount > 0 && priceValue > 0;
      const hasOccupancy = market.occupancyCount > 0 && occupancyValue > 0;
      const rateScale = hasPrice && currentRate > 0 ? priceValue / currentRate : 1;
      const occupancyDeltaPp = hasOccupancy ? occupancyValue - currentOccupancyPct : 0;
      return {
        key,
        hasPrice,
        hasOccupancy,
        targetNightlyRate: hasPrice ? priceValue : currentRate,
        targetOccupancyPct: hasOccupancy ? occupancyValue : currentOccupancyPct,
        rateScale,
        occupancyDeltaPp,
        seasons: inputState.seasons.map((season) => ({
          id: season.id,
          name: season.name,
          currentNightlyRate: n(season.nightlyRate),
          currentOccupancyPct: n(season.occupancyPct),
          nightlyRate: hasPrice ? Math.max(0, n(season.nightlyRate) * rateScale) : n(season.nightlyRate),
          occupancyPct: hasOccupancy ? clamp(n(season.occupancyPct) + occupancyDeltaPp, 0, 100) : n(season.occupancyPct)
        }))
      };
    };

    return {
      confidence,
      market,
      currentRate,
      currentOccupancyPct,
      pessimistic: build('pessimistic', market.priceP25, market.occupancyP25),
      base: build('base', market.priceMedian, market.occupancyMedian),
      optimistic: build('optimistic', market.priceP75, market.occupancyP75)
    };
  }

  function renderMarketSuggestion() {
    const root = $('#marketSuggestionPanel');
    if (!root) return;
    const suggestion = calculateMarketSuggestion(state);
    const levelLabel = { pessimistic: 'Pessimista · P25', base: 'Base · mediana', optimistic: 'Otimista · P75' };
    const confidenceLabel = { low: 'baixa', medium: 'média', high: 'alta' };
    const cards = ['pessimistic','base','optimistic'].map((key) => {
      const item = suggestion[key];
      return `
        <article class="market-suggestion-card">
          <span>${levelLabel[key]}</span>
          <strong>${item.hasPrice ? money.format(item.targetNightlyRate) : '—'} / noite</strong>
          <small>${item.hasOccupancy ? `${number1.format(item.targetOccupancyPct)}% ocupação` : 'ocupação sem evidência suficiente'}</small>
          <button class="button ${key==='base'?'primary':'secondary'} small-button" type="button" data-apply-market-level="${key}" ${(!item.hasPrice && !item.hasOccupancy) ? 'disabled' : ''}>Aplicar ${key==='base'?'cenário base':levelLabel[key].split(' · ')[0].toLowerCase()}</button>
        </article>`;
    }).join('');

    const baseRows = suggestion.base.seasons.map((season) => `
      <tr>
        <td>${escapeHtml(season.name)}</td>
        <td class="money-cell">${money.format(season.currentNightlyRate)}</td>
        <td class="money-cell"><strong>${money.format(season.nightlyRate)}</strong></td>
        <td class="percent-cell">${number1.format(season.currentOccupancyPct)}%</td>
        <td class="percent-cell"><strong>${number1.format(season.occupancyPct)}%</strong></td>
      </tr>`).join('');

    root.innerHTML = `
      <div class="market-suggestion-heading">
        <div><strong>Sugestão de mercado</strong><small>Confiança ${confidenceLabel[suggestion.confidence]} · ${suggestion.market.eligibleCount} comparáveis elegíveis · ${suggestion.market.occupancyCount} com evidência de ocupação.</small></div>
      </div>
      <div class="market-suggestion-grid">${cards}</div>
      <div class="table-card compact-table-card"><div class="table-scroll"><table class="market-suggestion-table">
        <thead><tr><th>Período</th><th>Diária atual</th><th>Diária base sugerida</th><th>Ocupação atual</th><th>Ocupação base sugerida</th></tr></thead>
        <tbody>${baseRows}</tbody>
      </table></div></div>
      <p class="helper">A transformação preserva o desenho sazonal atual: diária é multiplicada por um fator comum e ocupação recebe o mesmo Δ em pontos percentuais. Sem evidência confiável de ocupação, apenas a diária é sugerida.</p>`;
  }

  function applyMarketSuggestion(level = 'base') {
    const suggestion = calculateMarketSuggestion(state);
    const chosen = suggestion[level] || suggestion.base;
    state.seasons = state.seasons.map((season) => {
      const proposed = chosen.seasons.find((x) => String(x.id) === String(season.id));
      if (!proposed) return season;
      return {
        ...season,
        nightlyRate: chosen.hasPrice ? Number(proposed.nightlyRate.toFixed(2)) : season.nightlyRate,
        occupancyPct: chosen.hasOccupancy ? Number(proposed.occupancyPct.toFixed(2)) : season.occupancyPct
      };
    });
    state.market.lastApplied = {
      level: chosen.key,
      appliedAt: new Date().toISOString(),
      eligibleComparables: suggestion.market.eligibleCount,
      occupancyEvidenceCount: suggestion.market.occupancyCount
    };
    autosave();
    renderAll();
    showNotice(`Sugestão de mercado “${chosen.key}” aplicada explicitamente à sazonalidade.`);
  }

  function renderMarketComparables() {
    const root = $('#marketComparableRows');
    const summary = $('#marketComparableSummary');
    if (!root || !summary) return;
    const result = calculateMarketComparables(state.market);
    root.innerHTML = result.scored.map((item) => {
      const reason = item.exclusionReasons.length ? item.exclusionReasons.join('; ') : 'elegível';
      return `
      <tr data-market-id="${escapeAttr(item.id)}">
        <td><input class="row-name" data-market-field="name" data-market-id="${escapeAttr(item.id)}" type="text" value="${escapeAttr(item.name)}" /></td>
        <td><select data-market-field="source" data-market-id="${escapeAttr(item.id)}"><option value="inside-airbnb" ${item.source==='inside-airbnb'?'selected':''}>Inside Airbnb</option><option value="airdna" ${item.source==='airdna'?'selected':''}>AirDNA</option><option value="airbnb-manual" ${item.source==='airbnb-manual'?'selected':''}>Airbnb manual</option><option value="booking-reference" ${item.source==='booking-reference'?'selected':''}>Booking / referência</option><option value="operator-direct" ${item.source==='operator-direct'?'selected':''}>Operador direto</option><option value="other" ${item.source==='other'?'selected':''}>Outra</option></select></td>
        <td class="center-cell">${item.sourceRef ? `<a class="evidence-link" href="${escapeAttr(item.sourceRef)}" target="_blank" rel="noopener" title="${escapeAttr(item.evidenceNote || item.sourceRef)}">Abrir</a><small>${escapeHtml(item.collectedAt || '')}</small>` : '—'}</td>
        <td><input data-market-field="distanceKm" data-market-id="${escapeAttr(item.id)}" type="number" min="0" step="0.1" value="${n(item.distanceKm)}" /></td>
        <td><select data-market-field="roomType" data-market-id="${escapeAttr(item.id)}"><option value="entire_home" ${item.roomType==='entire_home'?'selected':''}>Imóvel inteiro</option><option value="private_room" ${item.roomType==='private_room'?'selected':''}>Quarto privado</option><option value="" ${!item.roomType?'selected':''}>?</option></select></td>
        <td><input data-market-field="bedrooms" data-market-id="${escapeAttr(item.id)}" type="number" min="0" step="1" value="${n(item.bedrooms)}" /></td>
        <td><input data-market-field="guests" data-market-id="${escapeAttr(item.id)}" type="number" min="0" step="1" value="${n(item.guests)}" /></td>
        <td><input data-market-field="bathrooms" data-market-id="${escapeAttr(item.id)}" type="number" min="0" step="0.5" value="${n(item.bathrooms)}" /></td>
        <td><input data-market-field="acUnits" data-market-id="${escapeAttr(item.id)}" type="number" min="0" step="1" value="${n(item.acUnits)}" /></td>
        <td><input data-market-field="qualityGrade" data-market-id="${escapeAttr(item.id)}" type="number" min="0" max="5" step="1" value="${n(item.qualityGrade)}" /></td>
        <td><input data-market-field="rating" data-market-id="${escapeAttr(item.id)}" type="number" min="0" max="5" step="0.1" value="${n(item.rating)}" /></td>
        <td><input data-market-field="reviewCount" data-market-id="${escapeAttr(item.id)}" type="number" min="0" step="1" value="${n(item.reviewCount)}" /></td>
        <td class="center-cell"><input data-market-field="activeRecently" data-market-id="${escapeAttr(item.id)}" type="checkbox" ${item.activeRecently?'checked':''} /></td>
        <td><input data-market-field="nightlyRate" data-market-id="${escapeAttr(item.id)}" type="number" min="0" step="10" value="${n(item.nightlyRate)}" /></td>
        <td><input data-market-field="occupancyPct" data-market-id="${escapeAttr(item.id)}" type="number" min="0" max="100" step="1" value="${n(item.occupancyPct)}" /></td>
        <td><select data-market-field="occupancyEvidence" data-market-id="${escapeAttr(item.id)}"><option value="none" ${item.occupancyEvidence==='none'?'selected':''}>Sem evidência</option><option value="estimated-source" ${item.occupancyEvidence==='estimated-source'?'selected':''}>Estimativa da fonte</option><option value="observed" ${item.occupancyEvidence==='observed'?'selected':''}>Observado</option></select></td>
        <td class="market-score" title="${escapeAttr(reason)}"><strong>${number1.format(item.similarityScore)}</strong><small>${item.eligible?'elegível':'excluído'}</small></td>
        <td><button class="button icon" type="button" data-remove-market-id="${escapeAttr(item.id)}">Remover</button></td>
      </tr>`;
    }).join('');

    const occText = result.occupancyCount
      ? `${number1.format(result.occupancyMedian)}% · P25 ${number1.format(result.occupancyP25)}% / P75 ${number1.format(result.occupancyP75)}%`
      : 'sem evidência confiável';
    summary.innerHTML = `
      <article><span>Comparáveis elegíveis</span><strong>${result.eligibleCount}</strong><small>${result.eligibleCount} linhas passam pelos filtros duros; preço é avaliado separadamente</small></article>
      <article><span>Comparáveis com diária</span><strong>${result.priceCount}</strong><small>${result.priceCount >= result.minimumCount ? 'amostra mínima de preço atingida' : `abaixo do mínimo operacional de ${result.minimumCount}`}</small></article>
      <article><span>Diária anunciada mediana</span><strong>${result.priceCount ? money.format(result.priceMedian) : '—'}</strong><small>${result.priceCount ? `P25 ${money.format(result.priceP25)} · P75 ${money.format(result.priceP75)} · confiança de preço ${result.priceSampleStatus === 'adequate' ? 'operacional' : 'baixa'}` : 'adicione preços aos comparáveis'}</small></article>
      <article><span>Ocupação com evidência</span><strong>${occText}</strong><small>${result.occupancyCount} comparáveis com booked/available sustentado</small></article>
      <article><span>Maior distância elegível</span><strong>${number1.format(result.maxEligibleDistanceKm)} km</strong><small>acima de 2 km é excluído pelo método atual</small></article>`;
    renderMarketSuggestion();
  }

  function bindMarketComparables() {
    const root = $('#marketComparableRows');
    if (!root) return;
    const update = (event) => {
      const input = event.target.closest('[data-market-field][data-market-id]');
      if (!input) return;
      const item = state.market.comparables.find((x) => String(x.id) === input.dataset.marketId);
      if (!item) return;
      let value;
      if (input.type === 'checkbox') value = input.checked;
      else if (input.type === 'number') value = input.value === '' ? 0 : n(input.value);
      else value = input.value;
      item[input.dataset.marketField] = value;
      autosave();
      renderMarketComparables();
    };
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-remove-market-id]');
      if (!button) return;
      state.market.comparables = state.market.comparables.filter((x) => String(x.id) !== button.dataset.removeMarketId);
      autosave();
      renderMarketComparables();
    });
    $('#marketSuggestionPanel')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-apply-market-level]');
      if (!button) return;
      applyMarketSuggestion(button.dataset.applyMarketLevel);
    });
  }

  function addMarketComparable() {
    state.market.comparables.push({
      id: uid('comp'), name: 'Novo comparável', source: 'other', sourceRef: '', collectedAt: '', evidenceNote: '',
      distanceKm: 0, roomType: state.market.subject.roomType || 'entire_home',
      bedrooms: n(state.market.subject.bedrooms), guests: 0, beds: 0, bathrooms: n(state.market.subject.bathrooms),
      acUnits: n(state.market.subject.acUnits), elevator: 'unknown', parking: 'unknown',
      qualityGrade: n(state.market.subject.qualityGrade), rating: 0, reviewCount: 0,
      activeRecently: true, minStayNights: 0, nightlyRate: 0, occupancyPct: 0, occupancyEvidence: 'none'
    });
    autosave();
    renderMarketComparables();
  }

  function renderDynamicTables() {
    renderSeasons();
    renderStayCosts();
    renderMonthlyCosts();
    renderPercentageCosts();
    renderReserveFunds();
    renderSetupCosts();
  }

  function bindDynamicTables() {
    ['#seasonRows', '#stayCostRows', '#monthlyCostRows', '#percentageCostRows', '#reserveFundRows', '#setupCostRows'].forEach((selector) => {
      const root = $(selector);
      root.addEventListener('input', handleDynamicInput);
      root.addEventListener('change', handleDynamicInput);
      root.addEventListener('click', handleDynamicClick);
    });
  }

  function handleDynamicInput(event) {
    const input = event.target.closest('[data-array][data-field][data-id]');
    if (!input) return;
    const list = state[input.dataset.array];
    const item = list?.find((entry) => String(entry.id) === input.dataset.id);
    if (!item) return;
    let value;
    if (input.type === 'checkbox') value = input.checked;
    else if (input.type === 'number') value = input.value === '' ? 0 : n(input.value);
    else value = input.value;
    item[input.dataset.field] = value;
    autosave();
    if (input.dataset.array === 'monthlyCosts' || input.dataset.array === 'setupCosts') {
      renderMonthlyCosts();
      renderSetupCosts();
    }
    calculateAndRender();
  }

  function handleDynamicClick(event) {
    const button = event.target.closest('[data-remove-array][data-id]');
    if (!button) return;
    const key = button.dataset.removeArray;
    if (!Array.isArray(state[key])) return;
    state[key] = state[key].filter((item) => String(item.id) !== button.dataset.id);
    autosave();
    renderDynamicTables();
    calculateAndRender();
  }

  function addSeason() { state.seasons.push({ id: uid('season'), name: 'Novo período', days: 0, personalUseDays: 0, habitualUseDays: 0, operationalUnavailableDays: 0, unavailableDays: 0, nightlyRate: 0, occupancyPct: 0 }); refreshDynamic(); }
  function addStayCost() { state.stayCosts.push({ id: uid('stay'), name: 'Novo custo', amount: 0, ownerHoursPerReservation: 0, adminManages: false, adminIncluded: false, deductibleIR: false }); refreshDynamic(); }
  function addMonthlyCost() { state.monthlyCosts.push({ id: uid('monthly'), name: 'Novo custo', amount: 0, ownerHoursMonthly: 0, airbnb: true, hybridIncremental: false, rentedAirbnb: true, traditional: false, adminManages: false, adminIncluded: false, deductibleIR: false }); refreshDynamic(); }
  function addPercentageCost() { state.percentageCosts.push({ id: uid('pct'), name: 'Novo custo percentual', pct: 0, rentedAirbnb: true, adminIncluded: false, deductibleIR: false }); refreshDynamic(); }
  function addReserveFund() { state.reserveFunds.push({ id: uid('reserve'), name: 'Nova reserva vinculada', pct: 0, openingBalance: 0, adminIncluded: false }); refreshDynamic(); }
  function addSetupCost() { state.setupCosts.push({ id: uid('setup'), name: 'Novo custo de implantação', amount: 0, rentedAmount: 0, residualPct: 0, airbnb: true, rentedAirbnb: true, rentedOnlyIfUnfurnished: false, traditional: false, adminPays: false, adminAssetBelongsToOwner: true }); refreshDynamic(); }
  function refreshDynamic() { autosave(); renderDynamicTables(); calculateAndRender(); }

  function marketQuantile(values, q) {
    const xs = values.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
    if (!xs.length) return 0;
    if (xs.length === 1) return xs[0];
    const pos = (xs.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    return xs[base + 1] == null ? xs[base] : xs[base] + rest * (xs[base + 1] - xs[base]);
  }

  function calculateMarketComparables(market = defaultState.market) {
    const subject = market?.subject || {};
    const comps = Array.isArray(market?.comparables) ? market.comparables : [];
    const known = (value) => Number.isFinite(Number(value)) && Number(value) > 0;
    const sameFlag = (a, b) => a !== 'unknown' && b !== 'unknown' && a !== '' && b !== '';

    const scored = comps.map((comp) => {
      const reasons = [];
      if (subject.roomType && comp.roomType && subject.roomType !== comp.roomType) reasons.push('tipo de anúncio diferente');
      if (known(subject.bedrooms) && known(comp.bedrooms) && Number(subject.bedrooms) !== Number(comp.bedrooms)) reasons.push('número de quartos diferente');
      if (known(subject.guests) && known(comp.guests) && Math.abs(Number(subject.guests) - Number(comp.guests)) > 1) reasons.push('capacidade difere em mais de 1 hóspede');
      if (known(comp.distanceKm) && Number(comp.distanceKm) > 2) reasons.push('distância acima de 2 km');

      let points = 0;
      let maxPoints = 0;
      const parts = [];
      const add = (label, max, ratio) => {
        const safe = clamp(n(ratio), 0, 1);
        points += max * safe;
        maxPoints += max;
        parts.push({ label, points: max * safe, max });
      };

      if (known(comp.distanceKm)) {
        const d = Number(comp.distanceKm);
        add('localização', 25, d <= .5 ? 1 : d <= 1 ? .8 : d <= 2 ? .5 : 0);
      }

      let typeMax = 0, typePts = 0;
      if (subject.roomType && comp.roomType) { typeMax += 10; if (subject.roomType === comp.roomType) typePts += 10; }
      if (known(subject.bedrooms) && known(comp.bedrooms)) {
        typeMax += 15;
        const diff = Math.abs(Number(subject.bedrooms) - Number(comp.bedrooms));
        typePts += diff === 0 ? 15 : diff === 1 ? 7.5 : 0;
      }
      if (typeMax) add('tipo/quartos', typeMax, typePts / typeMax);

      for (const [label,key] of [['hóspedes','guests'],['camas','beds'],['banheiros','bathrooms']]) {
        if (known(subject[key]) && known(comp[key])) {
          const diff = Math.abs(Number(subject[key]) - Number(comp[key]));
          add(label, 5, diff === 0 ? 1 : diff === 1 ? .5 : 0);
        }
      }

      if (known(subject.acUnits) && known(comp.acUnits)) {
        const diff = Math.abs(Number(subject.acUnits) - Number(comp.acUnits));
        add('ar-condicionado', 4, diff === 0 ? 1 : diff === 1 ? .5 : 0);
      }
      if (sameFlag(subject.elevator, comp.elevator)) add('elevador', 3, subject.elevator === comp.elevator ? 1 : 0);
      if (sameFlag(subject.parking, comp.parking)) add('garagem', 3, subject.parking === comp.parking ? 1 : 0);

      if (known(subject.qualityGrade) && known(comp.qualityGrade)) {
        const diff = Math.abs(Number(subject.qualityGrade) - Number(comp.qualityGrade));
        add('qualidade', 10, diff === 0 ? 1 : diff === 1 ? .7 : diff === 2 ? .3 : 0);
      }

      if (known(comp.rating)) add('rating', 4, comp.rating >= 4.8 ? 1 : comp.rating >= 4.6 ? .75 : comp.rating >= 4.3 ? .5 : .25);
      if (known(comp.reviewCount)) add('reviews', 3, comp.reviewCount >= 20 ? 1 : comp.reviewCount >= 5 ? .67 : .33);
      add('atividade recente', 3, comp.activeRecently ? 1 : 0);

      if (known(subject.minStayNights) && known(comp.minStayNights)) {
        const diff = Math.abs(Number(subject.minStayNights) - Number(comp.minStayNights));
        add('estadia mínima', 5, diff === 0 ? 1 : diff === 1 ? .6 : .2);
      }

      const similarityScore = maxPoints > 0 ? points / maxPoints * 100 : 0;
      return {
        ...comp,
        eligible: reasons.length === 0,
        exclusionReasons: reasons,
        similarityScore,
        scoreParts: parts
      };
    }).sort((a,b) => (Number(b.eligible)-Number(a.eligible)) || b.similarityScore-a.similarityScore);

    const eligible = scored.filter((x) => x.eligible);
    const prices = eligible.map((x) => n(x.nightlyRate)).filter((x) => x > 0);
    const occupancyRows = eligible.filter((x) => x.occupancyEvidence !== 'none' && n(x.occupancyPct) > 0);
    const occupancies = occupancyRows.map((x) => n(x.occupancyPct));
    return {
      subject,
      scored,
      eligible,
      eligibleCount: eligible.length,
      sampleStatus: eligible.length >= 15 ? 'adequate' : 'insufficient',
      priceSampleStatus: prices.length >= 15 ? 'adequate' : 'insufficient',
      targetCount: 25,
      minimumCount: 15,
      priceCount: prices.length,
      priceP25: marketQuantile(prices,.25),
      priceMedian: marketQuantile(prices,.5),
      priceP75: marketQuantile(prices,.75),
      occupancyCount: occupancies.length,
      occupancyP25: marketQuantile(occupancies,.25),
      occupancyMedian: marketQuantile(occupancies,.5),
      occupancyP75: marketQuantile(occupancies,.75),
      maxEligibleDistanceKm: eligible.reduce((m,x)=>Math.max(m,n(x.distanceKm)),0)
    };
  }

  function calculateModel(inputState = state) {
    const currentState = inputState;
    const propertyValue = Math.max(0, n(currentState.globals.propertyValue));
    const inflation = n(currentState.globals.inflationPct) / 100;
    const realAppreciation = n(currentState.globals.propertyRealAppreciationPct) / 100;
    const nominalPropertyAppreciation = (1 + inflation) * (1 + realAppreciation) - 1;
    const hourlyValue = Math.max(0, n(currentState.globals.ownerHourlyValue));

    const classifySeasonAvailability = (season) => {
      const days = Math.max(0, n(season.days));
      const hasClassifiedUnavailability = ['personalUseDays', 'habitualUseDays', 'operationalUnavailableDays']
        .some((key) => season?.[key] != null);
      const rawPersonal = hasClassifiedUnavailability ? Math.max(0, n(season.personalUseDays)) : 0;
      const rawHabitual = hasClassifiedUnavailability ? Math.max(0, n(season.habitualUseDays)) : 0;
      const rawOperational = hasClassifiedUnavailability
        ? Math.max(0, n(season.operationalUnavailableDays))
        : Math.max(0, n(season.unavailableDays));
      const personalUseDays = Math.min(days, rawPersonal);
      const habitualUseDays = Math.min(Math.max(0, days - personalUseDays), rawHabitual);
      const operationalUnavailableDays = Math.min(
        Math.max(0, days - personalUseDays - habitualUseDays),
        rawOperational
      );
      const unavailableDays = personalUseDays + habitualUseDays + operationalUnavailableDays;
      const availableDays = Math.max(0, days - unavailableDays);
      const blockedOverflowDays = Math.max(0, rawPersonal + rawHabitual + rawOperational - days);
      return { days, personalUseDays, habitualUseDays, operationalUnavailableDays, unavailableDays, availableDays, blockedOverflowDays };
    };

    const seasonDetails = currentState.seasons.map((season) => {
      const availability = classifySeasonAvailability(season);
      const occupancy = clamp(n(season.occupancyPct), 0, 100) / 100;
      const nightlyRate = Math.max(0, n(season.nightlyRate));
      const occupiedNights = availability.availableDays * occupancy;
      const revenue = occupiedNights * nightlyRate;
      return { ...season, ...availability, occupancy, nightlyRate, occupiedNights, revenue };
    });

    // Rodada B: o cenário administrado pode ter performance comercial distinta.
    // A diária usa impacto relativo; a ocupação usa pontos percentuais.
    const adminNightlyRateImpact = n(currentState.airbnb.adminNightlyRateImpactPct) / 100;
    const adminOccupancyImpactPp = n(currentState.airbnb.adminOccupancyImpactPp);
    const adminSeasonDetails = currentState.seasons.map((season) => {
      const availability = classifySeasonAvailability(season);
      const occupancy = clamp(n(season.occupancyPct) + adminOccupancyImpactPp, 0, 100) / 100;
      const nightlyRate = Math.max(0, n(season.nightlyRate)) * Math.max(0, 1 + adminNightlyRateImpact);
      const occupiedNights = availability.availableDays * occupancy;
      const revenue = occupiedNights * nightlyRate;
      return { ...season, ...availability, occupancy, nightlyRate, occupiedNights, revenue };
    });

    const totalDays = seasonDetails.reduce((sum, x) => sum + x.days, 0);
    const personalUseDays = seasonDetails.reduce((sum, x) => sum + x.personalUseDays, 0);
    const habitualUseDays = seasonDetails.reduce((sum, x) => sum + x.habitualUseDays, 0);
    const operationalUnavailableDays = seasonDetails.reduce((sum, x) => sum + x.operationalUnavailableDays, 0);
    const blockedOverflowDays = seasonDetails.reduce((sum, x) => sum + x.blockedOverflowDays, 0);
    const blockedDays = personalUseDays + habitualUseDays + operationalUnavailableDays;
    const availableDays = seasonDetails.reduce((sum, x) => sum + x.availableDays, 0);
    const occupiedNights = seasonDetails.reduce((sum, x) => sum + x.occupiedNights, 0);
    const accommodationRevenue = seasonDetails.reduce((sum, x) => sum + x.revenue, 0);
    const weightedOccupancy = availableDays > 0 ? occupiedNights / availableDays : 0;
    const calendarOccupancy = totalDays > 0 ? occupiedNights / totalDays : 0;
    const averageNightlyRate = occupiedNights > 0 ? accommodationRevenue / occupiedNights : 0;
    const adr = averageNightlyRate; // alias legado: ADR de diárias, sem taxas por reserva
    const revPar = availableDays > 0 ? accommodationRevenue / availableDays : 0;
    const avgStay = Math.max(0.1, n(currentState.airbnb.avgStayNights, 1));
    const reservations = occupiedNights / avgStay;
    const guestFeeRevenue = reservations * (Math.max(0, n(currentState.airbnb.cleaningFeeRevenue)) + Math.max(0, n(currentState.airbnb.otherGuestFeeRevenue)));
    const airbnbRevenue = accommodationRevenue + guestFeeRevenue;
    const totalAdr = occupiedNights > 0 ? airbnbRevenue / occupiedNights : 0;
    const totalRevPar = availableDays > 0 ? airbnbRevenue / availableDays : 0;

    const adminOccupiedNights = adminSeasonDetails.reduce((sum, x) => sum + x.occupiedNights, 0);
    const adminAccommodationRevenue = adminSeasonDetails.reduce((sum, x) => sum + x.revenue, 0);
    const adminWeightedOccupancy = availableDays > 0 ? adminOccupiedNights / availableDays : 0;
    const adminAverageNightlyRate = adminOccupiedNights > 0 ? adminAccommodationRevenue / adminOccupiedNights : 0;
    const adminAdr = adminAverageNightlyRate;
    const adminReservations = adminOccupiedNights / avgStay;
    const adminGuestFeeRevenue = adminReservations * (Math.max(0, n(currentState.airbnb.cleaningFeeRevenue)) + Math.max(0, n(currentState.airbnb.otherGuestFeeRevenue)));
    const adminAirbnbRevenue = adminAccommodationRevenue + adminGuestFeeRevenue;
    const adminTotalAdr = adminOccupiedNights > 0 ? adminAirbnbRevenue / adminOccupiedNights : 0;
    const adminRevPar = availableDays > 0 ? adminAccommodationRevenue / availableDays : 0;
    const adminTotalRevPar = availableDays > 0 ? adminAirbnbRevenue / availableDays : 0;

    const stayCostPerReservation = currentState.stayCosts.reduce((sum, x) => sum + Math.max(0, n(x.amount)), 0);
    const selfStayCosts = reservations * stayCostPerReservation;
    const adminStayCostPerReservation = currentState.stayCosts.reduce((sum, x) => sum + (x.adminIncluded ? 0 : Math.max(0, n(x.amount))), 0);
    const adminStayCosts = adminReservations * adminStayCostPerReservation;

    // Tempo do proprietário por atividade. "Admin gerencia" remove as horas,
    // enquanto "custo incluído" afeta apenas o desembolso monetário.
    const stayOwnerHoursAnnual = reservations * currentState.stayCosts.reduce((sum, x) => sum + Math.max(0, n(x.ownerHoursPerReservation)), 0);
    const adminStayOwnerHoursAnnual = adminReservations * currentState.stayCosts.reduce((sum, x) => sum + (x.adminManages ? 0 : Math.max(0, n(x.ownerHoursPerReservation))), 0);
    const monthlyOwnerHoursAnnual = currentState.monthlyCosts.reduce((sum, x) => sum + (x.airbnb ? Math.max(0, n(x.ownerHoursMonthly)) * 12 : 0), 0);
    const adminMonthlyOwnerHoursAnnual = currentState.monthlyCosts.reduce((sum, x) => sum + (x.airbnb && !x.adminManages ? Math.max(0, n(x.ownerHoursMonthly)) * 12 : 0), 0);
    const rentedMonthlyOwnerHoursAnnual = currentState.monthlyCosts.reduce((sum, x) => sum + (x.rentedAirbnb ? Math.max(0, n(x.ownerHoursMonthly)) * 12 : 0), 0);

    const fixedAirbnb = currentState.monthlyCosts.reduce((sum, x) => sum + (x.airbnb ? Math.max(0, n(x.amount)) * 12 : 0), 0);
    const fixedRentedAirbnb = currentState.monthlyCosts.reduce((sum, x) => sum + (x.rentedAirbnb ? Math.max(0, n(x.amount)) * 12 : 0), 0);
    const adminFixedAirbnb = currentState.monthlyCosts.reduce((sum, x) => sum + (x.airbnb && !x.adminIncluded ? Math.max(0, n(x.amount)) * 12 : 0), 0);
    const fixedTraditional = currentState.monthlyCosts.reduce((sum, x) => sum + (x.traditional ? Math.max(0, n(x.amount)) * 12 : 0), 0);

    // OPEX percentual: apenas custos efetivamente consumidos. Reservas ficam fora daqui.
    const pctCostRate = currentState.percentageCosts.reduce((sum, x) => sum + Math.max(0, n(x.pct)) / 100, 0);
    const rentedPctCostRate = currentState.percentageCosts.reduce((sum, x) => sum + (x.rentedAirbnb ? Math.max(0, n(x.pct)) / 100 : 0), 0);
    const adminPctCostRate = currentState.percentageCosts.reduce((sum, x) => sum + (x.adminIncluded ? 0 : Math.max(0, n(x.pct)) / 100), 0);
    const selfPctCosts = airbnbRevenue * pctCostRate;
    const rentedPctCosts = airbnbRevenue * rentedPctCostRate;
    const adminPctCosts = adminAirbnbRevenue * adminPctCostRate;

    // Reservas vinculadas: reduzem caixa livre, mas não patrimônio líquido.
    const reserveRate = currentState.reserveFunds.reduce((sum, x) => sum + Math.max(0, n(x.pct)) / 100, 0);
    const adminReserveRate = currentState.reserveFunds.reduce((sum, x) => sum + (x.adminIncluded ? 0 : Math.max(0, n(x.pct)) / 100), 0);
    const reserveOpening = currentState.reserveFunds.reduce((sum, x) => sum + Math.max(0, n(x.openingBalance)), 0);
    // Saldo inicial já existe e continua sendo patrimônio mesmo se a admin
    // assumir os novos aportes futuros.
    const adminReserveOpening = reserveOpening;
    const selfReserveContribution = airbnbRevenue * reserveRate;
    const adminReserveContribution = adminAirbnbRevenue * adminReserveRate;
    const selfLinkedReserveEnd = reserveOpening + selfReserveContribution;
    const adminLinkedReserveEnd = adminReserveOpening + adminReserveContribution;

    const platformFee = airbnbRevenue * Math.max(0, n(currentState.airbnb.platformFeePct)) / 100;
    const adminPlatformFeeGross = adminAirbnbRevenue * Math.max(0, n(currentState.airbnb.platformFeePct)) / 100;
    const selfOperatingCosts = platformFee + selfStayCosts + fixedAirbnb + selfPctCosts;

    // Base tributável configurável. Apenas itens marcados como dedutíveis
    // reduzem a base; despesas operacionais continuam afetando o caixa mesmo
    // quando não são dedutíveis.
    const selfStayTaxDeductions = reservations * currentState.stayCosts.reduce((sum, x) => sum + (x.deductibleIR ? Math.max(0, n(x.amount)) : 0), 0);
    const adminStayTaxDeductions = adminReservations * currentState.stayCosts.reduce((sum, x) => sum + (x.deductibleIR && !x.adminIncluded ? Math.max(0, n(x.amount)) : 0), 0);
    const rentedStayTaxDeductions = selfStayTaxDeductions;
    const selfMonthlyTaxDeductions = currentState.monthlyCosts.reduce((sum, x) => sum + (x.airbnb && x.deductibleIR ? Math.max(0, n(x.amount)) * 12 : 0), 0);
    const adminMonthlyTaxDeductions = currentState.monthlyCosts.reduce((sum, x) => sum + (x.airbnb && x.deductibleIR && !x.adminIncluded ? Math.max(0, n(x.amount)) * 12 : 0), 0);
    const rentedMonthlyTaxDeductions = currentState.monthlyCosts.reduce((sum, x) => sum + (x.rentedAirbnb && x.deductibleIR ? Math.max(0, n(x.amount)) * 12 : 0), 0);
    const traditionalMonthlyTaxDeductions = currentState.monthlyCosts.reduce((sum, x) => sum + (x.traditional && x.deductibleIR ? Math.max(0, n(x.amount)) * 12 : 0), 0);
    const selfPctTaxDeductions = airbnbRevenue * currentState.percentageCosts.reduce((sum, x) => sum + (x.deductibleIR ? Math.max(0, n(x.pct)) / 100 : 0), 0);
    const adminPctTaxDeductions = adminAirbnbRevenue * currentState.percentageCosts.reduce((sum, x) => sum + (x.deductibleIR && !x.adminIncluded ? Math.max(0, n(x.pct)) / 100 : 0), 0);
    const rentedPctTaxDeductions = airbnbRevenue * currentState.percentageCosts.reduce((sum, x) => sum + (x.rentedAirbnb && x.deductibleIR ? Math.max(0, n(x.pct)) / 100 : 0), 0);
    const selfPlatformTaxDeduction = currentState.airbnb.platformFeeDeductibleIR ? platformFee : 0;

    const selfTaxDeductions = selfPlatformTaxDeduction + selfStayTaxDeductions + selfMonthlyTaxDeductions + selfPctTaxDeductions;
    const selfTaxBase = Math.max(0, airbnbRevenue - selfTaxDeductions);
    const selfTax = selfTaxBase * Math.max(0, n(currentState.airbnb.taxPct)) / 100;
    const selfOperatingCash = airbnbRevenue - selfOperatingCosts - selfTax;

    // V22 / Epic #19: lente incremental para imóvel de uso misto.
    // Custos fixos que existiriam sem Airbnb ficam fora desta conta.
    const hybridConfig = currentState.hybridUse || {};
    const hybridNumericKeys = [
      'avoidedLodgingPerDay', 'personalUseIncrementalCostPerDay',
      'habitualHousingBenefitAnnual', 'habitualUseIncrementalCostAnnual',
      'preparationAnnualCost', 'storageAnnualCost', 'otherIncrementalAnnualCost',
      'incrementalAirbnbCapex'
    ];
    const hybridActive = personalUseDays > 0 || habitualUseDays > 0
      || hybridNumericKeys.some((key) => Math.max(0, n(hybridConfig[key])) > 0);
    const hybridExplicitAnnualCosts = hybridActive
      ? Math.max(0, n(hybridConfig.preparationAnnualCost))
        + Math.max(0, n(hybridConfig.storageAnnualCost))
        + Math.max(0, n(hybridConfig.otherIncrementalAnnualCost))
      : 0;
    const hybridMonthlyCosts = hybridActive
      ? currentState.monthlyCosts.reduce((sum, x) => sum + (x.airbnb && x.hybridIncremental ? Math.max(0, n(x.amount)) * 12 : 0), 0)
      : 0;
    const hybridMonthlyTaxDeductions = hybridActive
      ? currentState.monthlyCosts.reduce((sum, x) => sum + (x.airbnb && x.hybridIncremental && x.deductibleIR ? Math.max(0, n(x.amount)) * 12 : 0), 0)
      : 0;
    const hybridAirbnbRevenue = hybridActive ? airbnbRevenue : 0;
    const hybridVariableOperatingCosts = hybridActive
      ? platformFee + selfStayCosts + selfPctCosts + hybridMonthlyCosts + hybridExplicitAnnualCosts
      : 0;
    const hybridExplicitTaxDeduction = hybridActive && hybridConfig.incrementalAirbnbCostsDeductibleIR
      ? hybridExplicitAnnualCosts
      : 0;
    const hybridTaxDeductions = hybridActive
      ? selfPlatformTaxDeduction + selfStayTaxDeductions + selfPctTaxDeductions + hybridMonthlyTaxDeductions + hybridExplicitTaxDeduction
      : 0;
    const hybridTaxBase = Math.max(0, hybridAirbnbRevenue - hybridTaxDeductions);
    const hybridTax = hybridTaxBase * Math.max(0, n(currentState.airbnb.taxPct)) / 100;
    const hybridOperatingCash = hybridAirbnbRevenue - hybridVariableOperatingCosts - hybridTax;
    const hybridReserveContribution = hybridActive ? selfReserveContribution : 0;
    const hybridFreeCash = hybridOperatingCash - hybridReserveContribution;

    const personalUseBenefitGross = hybridActive
      ? personalUseDays * Math.max(0, n(hybridConfig.avoidedLodgingPerDay))
      : 0;
    const personalUseIncrementalCosts = hybridActive
      ? personalUseDays * Math.max(0, n(hybridConfig.personalUseIncrementalCostPerDay))
      : 0;
    const habitualHousingBenefitGross = hybridActive ? Math.max(0, n(hybridConfig.habitualHousingBenefitAnnual)) : 0;
    const habitualUseIncrementalCosts = hybridActive ? Math.max(0, n(hybridConfig.habitualUseIncrementalCostAnnual)) : 0;
    const hybridConsumptionBenefit = personalUseBenefitGross + habitualHousingBenefitGross
      - personalUseIncrementalCosts - habitualUseIncrementalCosts;

    const hybridIncrementalCapex = hybridActive ? Math.max(0, n(hybridConfig.incrementalAirbnbCapex)) : 0;
    const hybridIncrementalCapexResidual = hybridIncrementalCapex
      * clamp(n(hybridConfig.incrementalAirbnbCapexResidualPct), 0, 100) / 100;
    const hybridIncrementalCapexDepreciation = hybridIncrementalCapex - hybridIncrementalCapexResidual;
    const hybridFirstYearCashAfterCapex = hybridFreeCash - hybridIncrementalCapex;
    const hybridLinkedPatrimony = hybridReserveContribution + hybridIncrementalCapexResidual;
    const hybridEconomicIncrement = hybridFreeCash + hybridConsumptionBenefit - hybridIncrementalCapexDepreciation;

    const adminFee = adminAirbnbRevenue * Math.max(0, n(currentState.airbnb.adminFeePct)) / 100;
    const adminMonthlyFee = Math.max(0, n(currentState.airbnb.adminMonthlyFee)) * 12;
    const adminPlatformFee = currentState.airbnb.adminIncludesPlatformFee ? 0 : adminPlatformFeeGross;
    const adminOperatingCosts = adminFee + adminMonthlyFee + adminPlatformFee + adminStayCosts + adminFixedAirbnb + adminPctCosts;
    const adminPlatformTaxDeduction = currentState.airbnb.platformFeeDeductibleIR ? adminPlatformFee : 0;
    const adminManagementTaxDeductions = (currentState.airbnb.adminFeeDeductibleIR ? adminFee : 0)
      + (currentState.airbnb.adminMonthlyFeeDeductibleIR ? adminMonthlyFee : 0);
    const adminTaxDeductions = adminPlatformTaxDeduction + adminManagementTaxDeductions + adminStayTaxDeductions + adminMonthlyTaxDeductions + adminPctTaxDeductions;
    const adminTaxBase = Math.max(0, adminAirbnbRevenue - adminTaxDeductions);
    const adminTax = adminTaxBase * Math.max(0, n(currentState.airbnb.taxPct)) / 100;
    const adminOperatingCash = adminAirbnbRevenue - adminOperatingCosts - adminTax;

    const setupFor = (predicate, amountSelector = (x) => x.amount) => currentState.setupCosts.reduce((acc, x) => {
      if (!predicate(x)) return acc;
      const amount = Math.max(0, n(amountSelector(x)));
      const residualValue = amount * clamp(n(x.residualPct), 0, 100) / 100;
      acc.capex += amount;
      acc.residual += residualValue;
      return acc;
    }, { capex: 0, residual: 0 });

    const selfSetupData = setupFor((x) => x.airbnb);
    const adminSetupData = currentState.setupCosts.reduce((acc, x) => {
      if (!x.airbnb) return acc;
      const amount = Math.max(0, n(x.amount));
      const residualValue = amount * clamp(n(x.residualPct), 0, 100) / 100;
      if (!x.adminPays) acc.capex += amount;
      else acc.paidByAdmin += amount;
      if (x.adminAssetBelongsToOwner) acc.residual += residualValue;
      return acc;
    }, { capex: 0, residual: 0, paidByAdmin: 0 });
    const rentedSetupData = setupFor(
      (x) => x.rentedAirbnb && (!currentState.rentedAirbnb.furnished || !x.rentedOnlyIfUnfurnished),
      (x) => x.rentedAmount == null ? x.amount : x.rentedAmount
    );
    const traditionalSetupData = setupFor((x) => x.traditional);
    const selfSetup = selfSetupData.capex;
    const adminOnboarding = Math.max(0, n(currentState.airbnb.adminOnboardingFee));
    const adminSetup = adminSetupData.capex + adminOnboarding;
    const rentedInitialLeaseCosts = Math.max(0, n(currentState.rentedAirbnb.initialLeaseCosts));
    const rentedSetupAssets = rentedSetupData.capex;
    const rentedSetup = rentedSetupAssets + rentedInitialLeaseCosts;
    const traditionalSetup = traditionalSetupData.capex;
    const selfSetupResidual = selfSetupData.residual;
    const adminSetupResidual = adminSetupData.residual;
    const rentedSetupResidual = rentedSetupData.residual;
    const traditionalSetupResidual = traditionalSetupData.residual;
    const selfSetupDepreciation = selfSetup - selfSetupResidual;
    const adminSetupDepreciation = adminSetup - adminSetupResidual;
    const rentedSetupDepreciation = rentedSetup - rentedSetupResidual;
    const traditionalSetupDepreciation = traditionalSetup - traditionalSetupResidual;

    const tradRevenue = Math.max(0, n(currentState.traditional.monthlyRent)) * 12 * clamp(n(currentState.traditional.occupancyPct), 0, 100) / 100;
    const tradManagement = tradRevenue * Math.max(0, n(currentState.traditional.managementFeePct)) / 100;
    const tradMaintenance = tradRevenue * Math.max(0, n(currentState.traditional.maintenancePct)) / 100;
    const tradLosses = tradRevenue * Math.max(0, n(currentState.traditional.lossPct)) / 100;
    const avgContractMonths = Math.max(0, n(currentState.traditional.avgContractMonths));
    const leaseCommission = avgContractMonths > 0
      ? Math.max(0, n(currentState.traditional.monthlyRent)) * Math.max(0, n(currentState.traditional.newLeaseCommissionMonths)) * 12 / avgContractMonths
      : 0;
    const tradOther = Math.max(0, n(currentState.traditional.annualOtherCosts));
    const tradOperatingCosts = tradManagement + fixedTraditional + tradMaintenance + tradLosses + leaseCommission + tradOther;
    const tradTaxDeductions = traditionalMonthlyTaxDeductions
      + (currentState.traditional.managementFeeDeductibleIR ? tradManagement : 0)
      + (currentState.traditional.maintenanceDeductibleIR ? tradMaintenance : 0)
      + (currentState.traditional.lossDeductibleIR ? tradLosses : 0)
      + (currentState.traditional.newLeaseCommissionDeductibleIR ? leaseCommission : 0)
      + (currentState.traditional.annualOtherCostsDeductibleIR ? tradOther : 0);
    const tradTaxBase = Math.max(0, tradRevenue - tradTaxDeductions);
    const tradTax = tradTaxBase * Math.max(0, n(currentState.traditional.taxPct)) / 100;
    const tradOperatingCash = tradRevenue - tradOperatingCosts - tradTax;

    // Airbnb em imóvel alugado: mesma máquina de receita/turnover do Airbnb,
    // mas sem propriedade imobiliária. O aluguel ao proprietário é OPEX e a
    // caução permanece como capital vinculado/reembolsável.
    const rentedLeaseRent = Math.max(0, n(currentState.rentedAirbnb.monthlyLeaseRent)) * 12;
    const rentedAnnualLeaseCosts = Math.max(0, n(currentState.rentedAirbnb.annualLeaseCosts));
    const rentedSecurityDeposit = Math.max(0, n(currentState.rentedAirbnb.securityDeposit));
    const rentedMonthlyCostItems = currentState.monthlyCosts
      .filter((x) => x.rentedAirbnb && Math.max(0, n(x.amount)) > 0)
      .map((x) => ({ id: x.id, name: x.name, monthly: Math.max(0, n(x.amount)), annual: Math.max(0, n(x.amount)) * 12 }));
    const rentedOperatingCosts = platformFee + selfStayCosts + fixedRentedAirbnb + rentedPctCosts + rentedLeaseRent + rentedAnnualLeaseCosts;
    const rentedTaxDeductions = selfPlatformTaxDeduction + rentedStayTaxDeductions + rentedMonthlyTaxDeductions + rentedPctTaxDeductions
      + rentedLeaseRent
      + (currentState.rentedAirbnb.annualLeaseCostsDeductibleIR ? rentedAnnualLeaseCosts : 0);
    const rentedTaxBase = Math.max(0, airbnbRevenue - rentedTaxDeductions);
    const rentedTax = rentedTaxBase * Math.max(0, n(currentState.airbnb.taxPct)) / 100;
    const rentedOperatingCash = airbnbRevenue - rentedOperatingCosts - rentedTax;

    const salePrice = Math.max(0, propertyValue * (1 + n(currentState.propertySale.salePriceAdjustmentPct) / 100));
    const saleBrokerage = salePrice * Math.max(0, n(currentState.propertySale.brokeragePct)) / 100;
    const saleFixedCosts = Math.max(0, n(currentState.propertySale.fixedCosts));
    const saleMortgageBalance = Math.max(0, n(currentState.propertySale.mortgageBalance));
    const saleCapitalGainsTax = Math.max(0, n(currentState.propertySale.capitalGainsTax));
    const saleOtherCosts = Math.max(0, n(currentState.propertySale.otherCosts));
    const saleTransactionCosts = saleBrokerage + saleFixedCosts + saleCapitalGainsTax + saleOtherCosts;
    const saleDeductionsTotal = saleTransactionCosts + saleMortgageBalance;
    const netSaleProceeds = Math.max(0, salePrice - saleDeductionsTotal);
    const startingPropertyEquity = Math.max(0, propertyValue - saleMortgageBalance);

    let investmentGrossRate;
    if (currentState.investment.mode === 'ipcaPlus') {
      const realRate = n(currentState.investment.realRatePct) / 100;
      investmentGrossRate = (1 + inflation) * (1 + realRate) - 1;
    } else investmentGrossRate = n(currentState.investment.nominalRatePct) / 100;

    const investmentForCapital = (capital, wealthBasis = capital) => {
      const initialCapital = Math.max(0, n(capital));
      const startingWealth = Math.max(0, n(wealthBasis, initialCapital));
      const grossIncome = initialCapital * investmentGrossRate;
      const fees = initialCapital * Math.max(0, n(currentState.investment.feesPct)) / 100;
      const taxBase = Math.max(0, grossIncome - fees);
      const tax = taxBase * Math.max(0, n(currentState.investment.taxPct)) / 100;
      const operatingCash = grossIncome - fees - tax;
      const endNetWorth = initialCapital + operatingCash;
      const inflationFactor = 1 + inflation;
      const preservationTarget = startingWealth * inflationFactor;
      const capitalPreservationAmount = startingWealth * inflation;
      const sustainableCash = endNetWorth - preservationTarget;
      const realEndNetWorth = inflationFactor > 0 ? endNetWorth / inflationFactor : endNetWorth;
      const realWealthCreation = realEndNetWorth - startingWealth;
      const conversionLoss = startingWealth - initialCapital;
      return {
        initialCapital, startingWealth, conversionLoss, grossIncome, fees, tax, operatingCash, sustainableCash,
        endNetWorth, realEndNetWorth, realWealthCreation, capitalPreservationAmount, preservationTarget,
        nominalExcessOverPreservation: sustainableCash,
        nominalReturn: initialCapital > 0 ? operatingCash / initialCapital : 0,
        sustainableCashYield: startingWealth > 0 ? sustainableCash / startingWealth : 0,
        realReturn: startingWealth > 0 ? realWealthCreation / startingWealth : 0
      };
    };

    const workHours = {
      self: Math.max(0, n(currentState.work.selfHoursMonthly)) * 12 + stayOwnerHoursAnnual + monthlyOwnerHoursAnnual,
      admin: Math.max(0, n(currentState.work.supervisionAdminHoursMonthly)) * 12 + adminStayOwnerHoursAnnual + adminMonthlyOwnerHoursAnnual,
      rented: Math.max(0, n(currentState.work.rentedAirbnbHoursMonthly)) * 12 + stayOwnerHoursAnnual + rentedMonthlyOwnerHoursAnnual,
      traditional: Math.max(0, n(currentState.work.traditionalHoursMonthly)) * 12,
      investment: Math.max(0, n(currentState.work.investmentHoursMonthly)) * 12
    };
    const workCost = Object.fromEntries(Object.entries(workHours).map(([key, hours]) => [key, hours * hourlyValue]));

    const workingCapital = {
      self: Math.max(0, n(currentState.workingCapital.airbnbSelf)),
      admin: Math.max(0, n(currentState.workingCapital.airbnbAdmin)),
      rented: Math.max(0, n(currentState.workingCapital.rentedAirbnb)),
      traditional: Math.max(0, n(currentState.workingCapital.traditional))
    };

    const propertyEndValue = propertyValue * (1 + nominalPropertyAppreciation);
    const propertyInflationPreservation = propertyValue * inflation;
    const propertyNominalGain = propertyEndValue - propertyValue;
    const propertyNominalGainBeyondInflation = propertyNominalGain - propertyInflationPreservation;

    const enrichScenarioWithBenchmark = (scenario, propertyBacked = false) => {
      const extraCapital = propertyBacked ? Math.max(0, scenario.opportunityCapital - propertyValue) : 0;
      const benchmarkInvestableCapital = propertyBacked
        ? netSaleProceeds + extraCapital
        : scenario.opportunityCapital;
      const benchmarkWealthBasis = propertyBacked
        ? startingPropertyEquity + extraCapital
        : scenario.opportunityCapital;
      const benchmark = investmentForCapital(benchmarkInvestableCapital, benchmarkWealthBasis);
      return {
        ...scenario,
        benchmarkUsesPropertySale: propertyBacked,
        benchmarkInvestableCapital,
        benchmarkWealthBasis,
        benchmarkSaleTransactionCosts: propertyBacked ? saleTransactionCosts : 0,
        benchmarkRealGain: benchmark.realWealthCreation,
        benchmarkNominalGain: benchmark.operatingCash,
        benchmarkRealReturn: benchmark.realReturn,
        benchmarkEndNetWorth: benchmark.endNetWorth,
        benchmarkRealEndNetWorth: benchmark.realEndNetWorth,
        financialGapVsBenchmark: scenario.realWealthCreation - benchmark.realWealthCreation,
        realGapVsBenchmark: scenario.realWealthCreation - benchmark.realWealthCreation,
        economicRealWealthCreation: scenario.realWealthCreation - Math.max(0, n(scenario.laborCost)),
        benchmarkEconomicRealGain: benchmark.realWealthCreation - workCost.investment,
        economicGapVsBenchmark: (scenario.realWealthCreation - Math.max(0, n(scenario.laborCost)))
          - (benchmark.realWealthCreation - workCost.investment),
        monthlyEquivalentExcess: scenario.nominalExcessOverPreservation / 12,
        monthlyEquivalentFreeCash: scenario.freeCash / 12
      };
    };

    const makePropertyScenario = ({ id, label, grossRevenue, opCosts, tax, operatingCash, reserveContribution = 0, reserveOpening = 0, linkedReserve = 0, workingCapitalAmount = 0, capex = 0, setupResidual = 0, setupDepreciation = 0, laborCost = 0, workHoursAnnual = 0, details = {} }) => {
      const freeCash = operatingCash - reserveContribution;
      const externalFundingRequired = Math.max(0, -freeCash);
      const distributableCash = Math.max(0, freeCash);
      const workingCapitalValue = Math.max(0, n(workingCapitalAmount));
      const baseInitialCapital = propertyValue + capex + reserveOpening + workingCapitalValue;
      const initialCapital = baseInitialCapital + externalFundingRequired;
      const endNetWorth = propertyEndValue + setupResidual + distributableCash + linkedReserve + workingCapitalValue;
      const wealthCreation = endNetWorth - initialCapital;
      const inflationFactor = 1 + inflation;
      const realEndNetWorth = inflationFactor > 0 ? endNetWorth / inflationFactor : endNetWorth;
      const realWealthCreation = realEndNetWorth - initialCapital;
      const capitalPreservationAmount = initialCapital * inflation;
      const nominalExcessOverPreservation = endNetWorth - initialCapital * inflationFactor;
      const realFreeCash = inflationFactor > 0 ? freeCash / inflationFactor : freeCash;
      const cashYield = initialCapital > 0 ? freeCash / initialCapital : 0;
      const nominalTotalReturn = initialCapital > 0 ? wealthCreation / initialCapital : 0;
      const realTotalReturn = initialCapital > 0 ? realWealthCreation / initialCapital : 0;
      return enrichScenarioWithBenchmark({
        id, label, grossRevenue, opCosts, tax, operatingCash, cashPreservationRequirement: 0, preservationShortfall: 0, reserveContribution, reserveOpening, linkedReserve,
        workingCapital: workingCapitalValue, tiedCapital: linkedReserve + workingCapitalValue,
        freeCash, netCash: freeCash, distributableCash, externalFundingRequired,
        monthlyNet: freeCash / 12, capex, setupResidual, setupDepreciation, firstYearCash: freeCash - capex,
        laborCost, workHoursAnnual, economicResult: freeCash - laborCost, firstYearEconomic: freeCash - capex - laborCost,
        baseInitialCapital, initialCapital, opportunityCapital: initialCapital, endNetWorth, realEndNetWorth,
        wealthCreation, realWealthCreation, capitalPreservationAmount, nominalExcessOverPreservation,
        realFreeCash, cashYield, nominalTotalReturn, realTotalReturn, details
      }, true);
    };

    const makeRentedScenario = () => {
      const reserveContribution = selfReserveContribution;
      const linkedReserve = selfLinkedReserveEnd;
      const freeCash = rentedOperatingCash - reserveContribution;
      const externalFundingRequired = Math.max(0, -freeCash);
      const distributableCash = Math.max(0, freeCash);
      const workingCapitalValue = workingCapital.rented;
      const baseInitialCapital = rentedSetup + reserveOpening + rentedSecurityDeposit + workingCapitalValue;
      const initialCapital = baseInitialCapital + externalFundingRequired;
      const tiedCapital = linkedReserve + rentedSecurityDeposit + workingCapitalValue;
      const endNetWorth = rentedSetupResidual + distributableCash + linkedReserve + rentedSecurityDeposit + workingCapitalValue;
      const wealthCreation = endNetWorth - initialCapital;
      const inflationFactor = 1 + inflation;
      const realEndNetWorth = inflationFactor > 0 ? endNetWorth / inflationFactor : endNetWorth;
      const realWealthCreation = realEndNetWorth - initialCapital;
      const capitalPreservationAmount = initialCapital * inflation;
      const nominalExcessOverPreservation = endNetWorth - initialCapital * inflationFactor;
      const cashYield = initialCapital > 0 ? freeCash / initialCapital : 0;
      const realTotalReturn = initialCapital > 0 ? realWealthCreation / initialCapital : 0;
      return enrichScenarioWithBenchmark({
        id: 'airbnb-rented', label: 'Airbnb em imóvel alugado', grossRevenue: airbnbRevenue, opCosts: rentedOperatingCosts, tax: rentedTax,
        operatingCash: rentedOperatingCash, cashPreservationRequirement: 0, preservationShortfall: 0, reserveContribution, reserveOpening, linkedReserve,
        workingCapital: workingCapitalValue, tiedCapital,
        freeCash, netCash: freeCash, distributableCash, externalFundingRequired, monthlyNet: freeCash / 12,
        capex: rentedSetup, setupResidual: rentedSetupResidual, setupDepreciation: rentedSetupDepreciation,
        firstYearCash: freeCash - rentedSetup, laborCost: workCost.rented, workHoursAnnual: workHours.rented,
        economicResult: freeCash - workCost.rented, firstYearEconomic: freeCash - rentedSetup - workCost.rented,
        baseInitialCapital, initialCapital, opportunityCapital: initialCapital, endNetWorth, realEndNetWorth,
        wealthCreation, realWealthCreation, capitalPreservationAmount, nominalExcessOverPreservation,
        realFreeCash: inflationFactor > 0 ? freeCash / inflationFactor : freeCash,
        cashYield, nominalTotalReturn: initialCapital > 0 ? wealthCreation / initialCapital : 0, realTotalReturn,
        details: {
          'Receita de diárias': accommodationRevenue,
          'Taxas cobradas do hóspede': guestFeeRevenue,
          'Aluguel pago ao proprietário': rentedLeaseRent,
          'Imóvel vem mobiliado': currentState.rentedAirbnb.furnished ? 1 : 0,
          'Sublocação/temporada autorizada': currentState.rentedAirbnb.subleaseAuthorized ? 1 : 0,
          'Custos anuais do contrato/garantia': rentedAnnualLeaseCosts,
          'Taxa da plataforma': platformFee,
          'Diária média das noites vendidas': averageNightlyRate,
          'ADR total': totalAdr,
          'RevPAR de diárias': revPar,
          'RevPAR total': totalRevPar,
          'Custos por reservas': selfStayCosts,
          'Custos mensais da operação': fixedRentedAirbnb,
          'OPEX percentual aplicável ao locatário': rentedPctCosts,
          'Deduções consideradas na base de IR': rentedTaxDeductions,
          'Base tributável estimada': rentedTaxBase,
          'IR estimado': rentedTax,
          'Caixa antes das reservas': rentedOperatingCash,
          'Aporte às reservas vinculadas': reserveContribution,
          'Caução/garantia reembolsável': rentedSecurityDeposit,
          'Capital de giro vinculado': workingCapitalValue,
          'Capital vinculado final': tiedCapital,
          'CAPEX de ativos aplicável': rentedSetupAssets,
          'Custos iniciais não recuperáveis do contrato': rentedInitialLeaseCosts,
          'CAPEX + custos iniciais do contrato': rentedSetup,
          'Valor residual do CAPEX': rentedSetupResidual,
          'Depreciação econômica do CAPEX': rentedSetupDepreciation,
          'Aporte externo para cobrir déficit': externalFundingRequired,
          'Capital de oportunidade': initialCapital,
          'Ganho real do benchmark financeiro': investmentForCapital(initialCapital).realWealthCreation,
          'Horas próprias no ano': workHours.rented,
          'Valor do seu tempo': workCost.rented
        }
      });
    };

    const self = makePropertyScenario({
      id: 'airbnb-self', label: 'Airbnb autogerido', grossRevenue: airbnbRevenue, opCosts: selfOperatingCosts, tax: selfTax,
      operatingCash: selfOperatingCash, reserveContribution: selfReserveContribution, reserveOpening, linkedReserve: selfLinkedReserveEnd,
      workingCapitalAmount: workingCapital.self, capex: selfSetup, setupResidual: selfSetupResidual, setupDepreciation: selfSetupDepreciation, laborCost: workCost.self, workHoursAnnual: workHours.self,
      details: {
        'Receita de diárias': accommodationRevenue, 'Taxas cobradas do hóspede': guestFeeRevenue,
        'Taxa da plataforma': platformFee, 'Custos por reservas': selfStayCosts, 'Custos mensais': fixedAirbnb,
        'OPEX percentual': selfPctCosts, 'Deduções consideradas na base de IR': selfTaxDeductions,
        'Base tributável estimada': selfTaxBase, 'IR estimado': selfTax, 'Caixa antes das reservas': selfOperatingCash,
        'Aporte às reservas vinculadas': selfReserveContribution, 'Reserva vinculada final': selfLinkedReserveEnd,
        'Capital de giro vinculado': workingCapital.self,
        'Diária média das noites vendidas': averageNightlyRate, 'ADR total': totalAdr,
        'RevPAR de diárias': revPar, 'RevPAR total': totalRevPar,
        'CAPEX inicial': selfSetup, 'Valor residual do CAPEX': selfSetupResidual, 'Depreciação econômica do CAPEX': selfSetupDepreciation,
        'Valorização nominal do imóvel': propertyNominalGain, 'Parcela da valorização que cobre inflação': propertyInflationPreservation,
        'Valorização nominal acima da inflação': propertyNominalGainBeyondInflation,
        'Horas próprias no ano': workHours.self, 'Valor do seu tempo': workCost.self
      }
    });

    const admin = makePropertyScenario({
      id: 'airbnb-admin', label: 'Airbnb com administradora', grossRevenue: adminAirbnbRevenue, opCosts: adminOperatingCosts, tax: adminTax,
      operatingCash: adminOperatingCash, reserveContribution: adminReserveContribution, reserveOpening: adminReserveOpening, linkedReserve: adminLinkedReserveEnd,
      workingCapitalAmount: workingCapital.admin, capex: adminSetup, setupResidual: adminSetupResidual, setupDepreciation: adminSetupDepreciation, laborCost: workCost.admin, workHoursAnnual: workHours.admin,
      details: {
        'Receita de diárias': adminAccommodationRevenue, 'Taxas cobradas do hóspede': adminGuestFeeRevenue,
        'Impacto admin. na diária': adminNightlyRateImpact, 'Impacto admin. na ocupação (p.p.)': adminOccupancyImpactPp,
        'Comissão da administradora': adminFee, 'Mensalidade da administradora': adminMonthlyFee,
        'Taxa da plataforma não incluída': adminPlatformFee, 'Custos por reservas não incluídos': adminStayCosts,
        'Custos mensais não incluídos': adminFixedAirbnb, 'OPEX % não incluído': adminPctCosts,
        'Deduções consideradas na base de IR': adminTaxDeductions, 'Base tributável estimada': adminTaxBase, 'IR estimado': adminTax,
        'Caixa antes das reservas': adminOperatingCash, 'Aporte às reservas vinculadas': adminReserveContribution,
        'Reserva vinculada final': adminLinkedReserveEnd, 'Capital de giro vinculado': workingCapital.admin,
        'Diária média das noites vendidas': adminAverageNightlyRate, 'ADR total': adminTotalAdr,
        'RevPAR de diárias': adminRevPar, 'RevPAR total': adminTotalRevPar,
        'CAPEX + onboarding pago por você': adminSetup,
        'CAPEX pago pela administradora': adminSetupData.paidByAdmin,
        'Valor residual do CAPEX que permanece seu': adminSetupResidual, 'Custo econômico líquido do CAPEX': adminSetupDepreciation,
        'Valorização nominal do imóvel': propertyNominalGain, 'Parcela da valorização que cobre inflação': propertyInflationPreservation,
        'Valorização nominal acima da inflação': propertyNominalGainBeyondInflation,
        'Horas próprias no ano': workHours.admin, 'Valor do seu tempo': workCost.admin
      }
    });

    const rented = makeRentedScenario();

    const traditional = makePropertyScenario({
      id: 'traditional', label: 'Aluguel tradicional', grossRevenue: tradRevenue, opCosts: tradOperatingCosts, tax: tradTax,
      operatingCash: tradOperatingCash, reserveContribution: 0, reserveOpening: 0, linkedReserve: 0,
      workingCapitalAmount: workingCapital.traditional, capex: traditionalSetup, setupResidual: traditionalSetupResidual, setupDepreciation: traditionalSetupDepreciation, laborCost: workCost.traditional, workHoursAnnual: workHours.traditional,
      details: {
        'Imobiliária / administração': tradManagement, 'Custos mensais do proprietário': fixedTraditional,
        'Manutenção e reparos': tradMaintenance, 'Inadimplência / perdas': tradLosses,
        'Comissão esperada de nova locação': leaseCommission, 'Outros custos anuais': tradOther,
        'Deduções consideradas na base de IR': tradTaxDeductions, 'Base tributável estimada': tradTaxBase,
        'IR estimado': tradTax, 'Capital de giro vinculado': workingCapital.traditional,
        'CAPEX inicial': traditionalSetup, 'Valor residual do CAPEX': traditionalSetupResidual,
        'Depreciação econômica do CAPEX': traditionalSetupDepreciation, 'Valorização nominal do imóvel': propertyNominalGain,
        'Parcela da valorização que cobre inflação': propertyInflationPreservation, 'Valorização nominal acima da inflação': propertyNominalGainBeyondInflation,
        'Horas próprias no ano': workHours.traditional, 'Valor do seu tempo': workCost.traditional
      }
    });

    // Como o cenário-base parte de alguém que já possui o imóvel, a aplicação
    // financeira nasce do capital líquido realizável após a venda.
    const invCalc = investmentForCapital(netSaleProceeds, startingPropertyEquity);
    const investment = {
      id: 'investment', label: 'Investimento financeiro', grossRevenue: invCalc.grossIncome, opCosts: invCalc.fees,
      tax: invCalc.tax, operatingCash: invCalc.operatingCash, cashPreservationRequirement: invCalc.capitalPreservationAmount, preservationShortfall: Math.max(0, -invCalc.sustainableCash),
      reserveContribution: 0, reserveOpening: 0, linkedReserve: 0, tiedCapital: 0,
      freeCash: invCalc.sustainableCash, netCash: invCalc.sustainableCash, distributableCash: Math.max(0, invCalc.sustainableCash), externalFundingRequired: 0,
      monthlyNet: invCalc.sustainableCash / 12, capex: 0, setupResidual: 0, setupDepreciation: 0, firstYearCash: invCalc.sustainableCash,
      laborCost: workCost.investment, workHoursAnnual: workHours.investment, economicResult: invCalc.sustainableCash - workCost.investment,
      firstYearEconomic: invCalc.sustainableCash - workCost.investment,
      transactionCosts: saleTransactionCosts,
      baseInitialCapital: startingPropertyEquity, initialCapital: startingPropertyEquity, opportunityCapital: netSaleProceeds,
      endNetWorth: invCalc.endNetWorth, realEndNetWorth: invCalc.realEndNetWorth,
      wealthCreation: invCalc.endNetWorth - startingPropertyEquity, realWealthCreation: invCalc.realWealthCreation,
      capitalPreservationAmount: invCalc.capitalPreservationAmount, nominalExcessOverPreservation: invCalc.nominalExcessOverPreservation,
      realFreeCash: (1 + inflation) > 0 ? invCalc.sustainableCash / (1 + inflation) : invCalc.sustainableCash,
      cashYield: startingPropertyEquity > 0 ? invCalc.sustainableCash / startingPropertyEquity : 0,
      nominalTotalReturn: startingPropertyEquity > 0 ? (invCalc.endNetWorth - startingPropertyEquity) / startingPropertyEquity : 0,
      realTotalReturn: invCalc.realReturn,
      benchmarkRealGain: invCalc.realWealthCreation, benchmarkNominalGain: invCalc.operatingCash,
      benchmarkRealReturn: invCalc.realReturn, benchmarkEndNetWorth: invCalc.endNetWorth,
      benchmarkRealEndNetWorth: invCalc.realEndNetWorth,
      monthlyEquivalentExcess: invCalc.nominalExcessOverPreservation / 12,
      monthlyEquivalentFreeCash: invCalc.sustainableCash / 12,
      financialGapVsBenchmark: 0, realGapVsBenchmark: 0,
      economicRealWealthCreation: invCalc.realWealthCreation - workCost.investment,
      benchmarkEconomicRealGain: invCalc.realWealthCreation - workCost.investment,
      economicGapVsBenchmark: 0,
      details: {
        'Valor de mercado do imóvel': propertyValue,
        'Valor esperado de venda': salePrice,
        'Corretagem na venda': saleBrokerage,
        'Custos/documentação de venda': saleFixedCosts,
        'Saldo de financiamento quitado': saleMortgageBalance,
        'IR estimado sobre ganho de capital na venda': saleCapitalGainsTax,
        'Outros custos de liquidação': saleOtherCosts,
        'Custos de transação da venda': saleTransactionCosts,
        'Capital líquido investido': netSaleProceeds,
        'Taxa bruta nominal': investmentGrossRate, 'Custos / taxas do investimento': invCalc.fees, 'IR sobre rendimento': invCalc.tax,
        'Rendimento líquido nominal': invCalc.operatingCash,
        'Parcela retida para preservar poder de compra': invCalc.capitalPreservationAmount,
        'Caixa distribuível preservando o principal real': invCalc.sustainableCash,
        'Aporte adicional necessário se rendimento não cobrir inflação': Math.max(0, -invCalc.sustainableCash),
        'Ganho patrimonial real': invCalc.realWealthCreation, 'Patrimônio nominal final': invCalc.endNetWorth,
        'Patrimônio real final': invCalc.realEndNetWorth, 'Horas próprias no ano': workHours.investment, 'Valor do seu tempo': workCost.investment
      }
    };

    // Complementa detalhes de oportunidade depois que os cenários já foram enriquecidos.
    [self, admin, traditional].forEach((scenario) => {
      scenario.details['Aporte externo para cobrir déficit'] = scenario.externalFundingRequired;
      scenario.details['Capital de oportunidade'] = scenario.opportunityCapital;
      scenario.details['Ganho real do benchmark financeiro'] = scenario.benchmarkRealGain;
      scenario.details['Δ financeiro vs. benchmark'] = scenario.financialGapVsBenchmark;
      scenario.details['Δ econômico vs. benchmark'] = scenario.economicGapVsBenchmark;
    });
    rented.details['Δ financeiro vs. benchmark'] = rented.financialGapVsBenchmark;
    rented.details['Δ econômico vs. benchmark'] = rented.economicGapVsBenchmark;

    const scenarios = [self, admin, rented, traditional, investment];
    const bestCash = [...scenarios].sort((a, b) => b.freeCash - a.freeCash)[0];
    const bestFirstYear = [...scenarios].sort((a, b) => b.firstYearCash - a.firstYearCash)[0];
    const bestEconomic = [...scenarios].sort((a, b) => b.economicResult - a.economicResult)[0];
    const bestWealth = [...scenarios].sort((a, b) => b.wealthCreation - a.wealthCreation)[0];
    const bestRealWealth = [...scenarios].sort((a, b) => b.realWealthCreation - a.realWealthCreation)[0];
    const bestReal = [...scenarios].sort((a, b) => b.realTotalReturn - a.realTotalReturn)[0];

    const includedAdminItems = [];
    const managedAdminItems = [];
    if (currentState.airbnb.adminIncludesPlatformFee) includedAdminItems.push('Taxa da plataforma');
    currentState.stayCosts.filter((x) => x.adminManages).forEach((x) => managedAdminItems.push(x.name));
    currentState.monthlyCosts.filter((x) => x.airbnb && x.adminManages).forEach((x) => managedAdminItems.push(x.name));
    currentState.stayCosts.filter((x) => x.adminIncluded).forEach((x) => includedAdminItems.push(x.name));
    currentState.monthlyCosts.filter((x) => x.airbnb && x.adminIncluded).forEach((x) => includedAdminItems.push(x.name));
    currentState.percentageCosts.filter((x) => x.adminIncluded).forEach((x) => includedAdminItems.push(x.name));
    currentState.reserveFunds.filter((x) => x.adminIncluded).forEach((x) => includedAdminItems.push(`${x.name} (novos aportes)`));
    currentState.setupCosts.filter((x) => x.airbnb && x.adminPays).forEach((x) => includedAdminItems.push(`${x.name} (implantação paga pela admin.)`));

    return {
      seasonDetails, adminSeasonDetails, totalDays, blockedDays, personalUseDays, habitualUseDays,
      operationalUnavailableDays, blockedOverflowDays, availableDays, occupiedNights, weightedOccupancy, calendarOccupancy,
      averageNightlyRate, adr, totalAdr, revPar, totalRevPar,
      accommodationRevenue, guestFeeRevenue, airbnbRevenue, reservations, stayCostPerReservation,
      adminOccupiedNights, adminAccommodationRevenue, adminWeightedOccupancy, adminAverageNightlyRate, adminAdr, adminTotalAdr, adminRevPar, adminTotalRevPar,
      adminReservations, adminGuestFeeRevenue, adminAirbnbRevenue,
      fixedAirbnb, fixedRentedAirbnb, adminFixedAirbnb, fixedTraditional, pctCostRate, adminPctCostRate,
      reserveRate, adminReserveRate, reserveOpening, adminReserveOpening, selfReserveContribution, adminReserveContribution,
      selfLinkedReserveEnd, adminLinkedReserveEnd, selfSetup, adminSetup, rentedSetup, rentedSetupAssets, traditionalSetup,
      selfSetupResidual, adminSetupResidual, adminSetupPaidByAdmin: adminSetupData.paidByAdmin, rentedSetupResidual, traditionalSetupResidual,
      selfSetupDepreciation, adminSetupDepreciation, rentedSetupDepreciation, traditionalSetupDepreciation,
      rentedLeaseRent, rentedAnnualLeaseCosts, rentedSecurityDeposit, rentedInitialLeaseCosts,
      rentedMonthlyCostItems, rentedPctCostRate, rentedPctCosts,
      rentedFurnished: Boolean(currentState.rentedAirbnb.furnished),
      rentedSubleaseAuthorized: Boolean(currentState.rentedAirbnb.subleaseAuthorized),
      workingCapital,
      scenarios, bestCash, bestFirstYear, bestEconomic, bestWealth, bestRealWealth, bestReal,
      propertyValue, inflation, realAppreciation, nominalPropertyAppreciation, propertyEndValue,
      propertyInflationPreservation, propertyNominalGain, propertyNominalGainBeyondInflation,
      salePrice, saleBrokerage, saleFixedCosts, saleMortgageBalance, saleCapitalGainsTax, saleOtherCosts,
      saleTransactionCosts, saleDeductionsTotal, netSaleProceeds, startingPropertyEquity,
      investmentGrossRate,
      investmentCapitalPreservationAmount: invCalc.capitalPreservationAmount,
      investmentNominalExcessOverPreservation: invCalc.nominalExcessOverPreservation,
      investmentRealWealthCreation: invCalc.realWealthCreation, investmentSustainableCash: invCalc.sustainableCash, workHours, includedAdminItems, managedAdminItems,
      hybridUse: {
        active: hybridActive,
        airbnbRevenue: hybridAirbnbRevenue,
        variableOperatingCosts: hybridVariableOperatingCosts,
        incrementalMonthlyCosts: hybridMonthlyCosts,
        fixedCostsExcluded: Math.max(0, fixedAirbnb - hybridMonthlyCosts),
        taxDeductions: hybridTaxDeductions,
        taxBase: hybridTaxBase,
        tax: hybridTax,
        operatingCash: hybridOperatingCash,
        reserveContribution: hybridReserveContribution,
        freeCash: hybridFreeCash,
        personalUseBenefitGross,
        personalUseIncrementalCosts,
        habitualHousingBenefitGross,
        habitualUseIncrementalCosts,
        consumptionBenefit: hybridConsumptionBenefit,
        incrementalCapex: hybridIncrementalCapex,
        incrementalCapexResidual: hybridIncrementalCapexResidual,
        incrementalCapexDepreciation: hybridIncrementalCapexDepreciation,
        firstYearCashAfterCapex: hybridFirstYearCashAfterCapex,
        linkedPatrimony: hybridLinkedPatrimony,
        economicIncrement: hybridEconomicIncrement
      }
    };
  }

  function inflateRecurringStateForYear(baseState, yearIndex) {
    const projected = structuredCloneSafe(baseState);
    const inflation = n(baseState.globals.inflationPct) / 100;
    const realAppreciation = n(baseState.globals.propertyRealAppreciationPct) / 100;
    const nominalAppreciation = (1 + inflation) * (1 + realAppreciation) - 1;
    const inflationFactor = Math.pow(1 + inflation, yearIndex);
    const propertyFactor = Math.pow(1 + nominalAppreciation, yearIndex);

    projected.globals.propertyValue = Math.max(0, n(baseState.globals.propertyValue)) * propertyFactor;
    projected.globals.ownerHourlyValue = Math.max(0, n(baseState.globals.ownerHourlyValue)) * inflationFactor;

    projected.seasons = projected.seasons.map((x) => ({ ...x, nightlyRate: Math.max(0, n(x.nightlyRate)) * inflationFactor }));
    projected.airbnb.cleaningFeeRevenue = Math.max(0, n(baseState.airbnb.cleaningFeeRevenue)) * inflationFactor;
    projected.airbnb.otherGuestFeeRevenue = Math.max(0, n(baseState.airbnb.otherGuestFeeRevenue)) * inflationFactor;
    projected.airbnb.adminMonthlyFee = Math.max(0, n(baseState.airbnb.adminMonthlyFee)) * inflationFactor;
    projected.airbnb.adminOnboardingFee = yearIndex === 0 ? Math.max(0, n(baseState.airbnb.adminOnboardingFee)) : 0;

    projected.stayCosts = projected.stayCosts.map((x) => ({ ...x, amount: Math.max(0, n(x.amount)) * inflationFactor }));
    projected.monthlyCosts = projected.monthlyCosts.map((x) => ({ ...x, amount: Math.max(0, n(x.amount)) * inflationFactor }));

    projected.rentedAirbnb.monthlyLeaseRent = Math.max(0, n(baseState.rentedAirbnb.monthlyLeaseRent)) * inflationFactor;
    projected.rentedAirbnb.annualLeaseCosts = Math.max(0, n(baseState.rentedAirbnb.annualLeaseCosts)) * inflationFactor;
    projected.rentedAirbnb.initialLeaseCosts = yearIndex === 0 ? Math.max(0, n(baseState.rentedAirbnb.initialLeaseCosts)) : 0;

    projected.traditional.monthlyRent = Math.max(0, n(baseState.traditional.monthlyRent)) * inflationFactor;
    projected.traditional.annualOtherCosts = Math.max(0, n(baseState.traditional.annualOtherCosts)) * inflationFactor;

    if (projected.hybridUse) {
      for (const key of ['avoidedLodgingPerDay','personalUseIncrementalCostPerDay','habitualHousingBenefitAnnual','habitualUseIncrementalCostAnnual','preparationAnnualCost','storageAnnualCost','otherIncrementalAnnualCost']) {
        projected.hybridUse[key] = Math.max(0, n(baseState.hybridUse?.[key])) * inflationFactor;
      }
      projected.hybridUse.incrementalAirbnbCapex = yearIndex === 0
        ? Math.max(0, n(baseState.hybridUse?.incrementalAirbnbCapex))
        : 0;
    }

    if (yearIndex > 0) {
      projected.setupCosts = projected.setupCosts.map((x) => ({ ...x, amount: 0, rentedAmount: 0 }));
    }
    projected.reserveFunds = projected.reserveFunds.map((x) => ({ ...x, openingBalance: 0 }));
    return projected;
  }

  function setupResidualForHorizon(baseState, scenarioId, years) {
    const furnished = Boolean(baseState.rentedAirbnb?.furnished);
    return (baseState.setupCosts || []).reduce((sum, x) => {
      let amount = 0;
      let belongs = false;
      if (scenarioId === 'airbnb-self') {
        belongs = Boolean(x.airbnb);
        amount = n(x.amount);
      } else if (scenarioId === 'airbnb-admin') {
        belongs = Boolean(x.airbnb && x.adminAssetBelongsToOwner);
        amount = n(x.amount);
      } else if (scenarioId === 'airbnb-rented') {
        belongs = Boolean(x.rentedAirbnb && (!furnished || !x.rentedOnlyIfUnfurnished));
        amount = n(x.rentedAmount, x.amount);
      } else if (scenarioId === 'traditional') {
        belongs = Boolean(x.traditional);
        amount = n(x.amount);
      }
      if (!belongs || amount <= 0) return sum;
      const annualRetention = clamp(n(x.residualPct), 0, 100) / 100;
      return sum + amount * Math.pow(annualRetention, years);
    }, 0);
  }

  function projectInvestmentOverHorizon(baseState, years, investableCapital, wealthBasis) {
    const inflation = n(baseState.globals.inflationPct) / 100;
    const grossRate = baseState.investment.mode === 'ipcaPlus'
      ? (1 + inflation) * (1 + n(baseState.investment.realRatePct) / 100) - 1
      : n(baseState.investment.nominalRatePct) / 100;
    const feeRate = Math.max(0, n(baseState.investment.feesPct)) / 100;
    const taxRate = Math.max(0, n(baseState.investment.taxPct)) / 100;
    const workHoursAnnual = Math.max(0, n(baseState.work.investmentHoursMonthly)) * 12;
    const initialHourly = Math.max(0, n(baseState.globals.ownerHourlyValue));

    let principal = Math.max(0, n(investableCapital));
    const initialWealth = Math.max(0, n(wealthBasis, principal));
    let cumulativeCash = 0;
    let cumulativeGrossIncome = 0;
    let cumulativeTax = 0;
    let cumulativeFees = 0;
    let realLaborCost = 0;
    const yearsDetail = [];

    for (let y = 0; y < years; y += 1) {
      const grossIncome = principal * grossRate;
      const fees = principal * feeRate;
      const tax = Math.max(0, grossIncome - fees) * taxRate;
      const netIncome = grossIncome - fees - tax;
      const beforeDistribution = principal + netIncome;
      const preservationTarget = initialWealth * Math.pow(1 + inflation, y + 1);
      const distributable = Math.max(0, beforeDistribution - preservationTarget);
      principal = beforeDistribution - distributable;
      cumulativeCash += distributable;
      cumulativeGrossIncome += grossIncome;
      cumulativeTax += tax;
      cumulativeFees += fees;
      const nominalLabor = workHoursAnnual * initialHourly * Math.pow(1 + inflation, y);
      realLaborCost += nominalLabor / Math.pow(1 + inflation, y);
      yearsDetail.push({ year: y + 1, grossIncome, fees, tax, distributable, principalEnd: principal, preservationTarget });
    }

    const inflationFactor = Math.pow(1 + inflation, years);
    const endNetWorth = principal + cumulativeCash;
    const realEndNetWorth = inflationFactor > 0 ? endNetWorth / inflationFactor : endNetWorth;
    const realWealthCreation = realEndNetWorth - initialWealth;
    return {
      years,
      initialWealth,
      investableCapital: Math.max(0, n(investableCapital)),
      endPrincipal: principal,
      cumulativeCash,
      cumulativeGrossIncome,
      cumulativeTax,
      cumulativeFees,
      endNetWorth,
      realEndNetWorth,
      realWealthCreation,
      nominalExcessOverPreservation: endNetWorth - initialWealth * inflationFactor,
      realLaborCost,
      economicRealWealthCreation: realWealthCreation - realLaborCost,
      yearsDetail
    };
  }

  function buildAnnualFundingSchedule(yearsDetail, inflation) {
    let fundedCashBalance = 0;
    let rawCumulativeCash = 0;
    let peakAnnualDeficit = 0;
    let realFundingBasis = 0;
    let nominalPreservationAtHorizon = 0;
    const fundingSchedule = [];
    const totalYears = yearsDetail.length;

    yearsDetail.forEach((yearRow, index) => {
      const year = index + 1;
      rawCumulativeCash += n(yearRow.freeCash);
      peakAnnualDeficit = Math.max(peakAnnualDeficit, Math.max(0, -rawCumulativeCash));
      fundedCashBalance += n(yearRow.freeCash);
      if (fundedCashBalance < -1e-9) {
        const amount = -fundedCashBalance;
        fundingSchedule.push({ year, amount });
        fundedCashBalance = 0;
        realFundingBasis += amount / Math.pow(1 + inflation, year);
        nominalPreservationAtHorizon += amount * Math.pow(1 + inflation, totalYears - year);
      }
    });

    return {
      fundingSchedule,
      externalFundingRequired: fundingSchedule.reduce((sum, item) => sum + item.amount, 0),
      annualLiquidityNeed: peakAnnualDeficit,
      endingCashBalance: Math.max(0, fundedCashBalance),
      realFundingBasis,
      nominalPreservationAtHorizon
    };
  }

  function projectAnnualContribution(baseState, amount, contributionYear, totalYears) {
    const inflation = n(baseState.globals.inflationPct) / 100;
    const remainingYears = Math.max(0, totalYears - contributionYear);
    if (remainingYears === 0) return { amount, contributionYear, remainingYears, realGainAtT0: 0 };
    const projected = projectInvestmentOverHorizon(baseState, remainingYears, amount, amount);
    return {
      amount, contributionYear, remainingYears,
      realGainAtT0: projected.realWealthCreation / Math.pow(1 + inflation, contributionYear)
    };
  }
  function calculateHorizonProjection(inputState = state, horizonYears = 5) {
    const years = [1,3,5].includes(Number(horizonYears)) ? Number(horizonYears) : Math.max(1, Math.round(n(horizonYears, 5)));
    const baseState = structuredCloneSafe(inputState);
    const baseCalc = calculateModel(baseState);
    const inflation = n(baseState.globals.inflationPct) / 100;
    const realAppreciation = n(baseState.globals.propertyRealAppreciationPct) / 100;
    const nominalAppreciation = (1 + inflation) * (1 + realAppreciation) - 1;
    const propertyValue = Math.max(0, n(baseState.globals.propertyValue));
    const initialHourly = Math.max(0, n(baseState.globals.ownerHourlyValue));
    const scenarioIds = ['airbnb-self','airbnb-admin','airbnb-rented','traditional'];

    const projectedScenarios = scenarioIds.map((scenarioId) => {
      const baseScenario = baseCalc.scenarios.find((x) => x.id === scenarioId);
      let cumulativeFreeCashBeforeFunding = 0;
      let reserveBalance = Math.max(0, n(baseScenario.reserveOpening));
      let realLaborCost = 0;
      let paybackYear = baseScenario.capex <= 0 ? 0 : null;
      const yearsDetail = [];

      for (let y = 0; y < years; y += 1) {
        const yearState = inflateRecurringStateForYear(baseState, y);
        const yearCalc = calculateModel(yearState);
        const sc = yearCalc.scenarios.find((x) => x.id === scenarioId);
        cumulativeFreeCashBeforeFunding += sc.freeCash;
        reserveBalance += sc.reserveContribution;
        realLaborCost += sc.laborCost / Math.pow(1 + inflation, y);
        if (paybackYear == null && cumulativeFreeCashBeforeFunding >= baseScenario.capex) paybackYear = y + 1;
        yearsDetail.push({
          year: y + 1,
          freeCash: sc.freeCash,
          operatingCash: sc.operatingCash,
          reserveContribution: sc.reserveContribution,
          laborCost: sc.laborCost,
          grossRevenue: sc.grossRevenue,
          opCosts: sc.opCosts,
          tax: sc.tax
        });
      }

      const timing = buildAnnualFundingSchedule(yearsDetail, inflation);
      const cashBalance = timing.endingCashBalance;
      const externalFundingRequired = timing.externalFundingRequired;
      const ownsProperty = scenarioId !== 'airbnb-rented';
      const propertyEndValue = ownsProperty ? propertyValue * Math.pow(1 + nominalAppreciation, years) : 0;
      const setupResidual = setupResidualForHorizon(baseState, scenarioId, years);
      const workingCapital = Math.max(0, n(baseScenario.workingCapital));
      const securityDeposit = scenarioId === 'airbnb-rented' ? Math.max(0, n(baseState.rentedAirbnb.securityDeposit)) : 0;
      const nominalCommittedCapital = Math.max(0, n(baseScenario.baseInitialCapital)) + externalFundingRequired;
      const realInitialCapitalAtT0 = Math.max(0, n(baseScenario.baseInitialCapital)) + timing.realFundingBasis;
      const endNetWorth = propertyEndValue + setupResidual + cashBalance + reserveBalance + workingCapital + securityDeposit;
      const inflationFactor = Math.pow(1 + inflation, years);
      const realEndNetWorth = inflationFactor > 0 ? endNetWorth / inflationFactor : endNetWorth;
      const realWealthCreation = realEndNetWorth - realInitialCapitalAtT0;
      const nominalPreservationTarget = Math.max(0, n(baseScenario.baseInitialCapital)) * inflationFactor + timing.nominalPreservationAtHorizon;
      const nominalExcessOverPreservation = endNetWorth - nominalPreservationTarget;

      let benchmark;
      if (ownsProperty) {
        const extraCapital = Math.max(0, n(baseScenario.baseInitialCapital) - propertyValue);
        benchmark = projectInvestmentOverHorizon(
          baseState,
          years,
          baseCalc.netSaleProceeds + extraCapital,
          baseCalc.startingPropertyEquity + extraCapital
        );
      } else {
        benchmark = projectInvestmentOverHorizon(baseState, years, Math.max(0, n(baseScenario.baseInitialCapital)), Math.max(0, n(baseScenario.baseInitialCapital)));
      }
      const timedBenchmarkContributions = timing.fundingSchedule.map((x) => projectAnnualContribution(baseState, x.amount, x.year, years));
      const timedBenchmarkRealGain = timedBenchmarkContributions.reduce((sum,x)=>sum+x.realGainAtT0,0);
      const benchmarkRealWealthCreation = benchmark.realWealthCreation + timedBenchmarkRealGain;
      const benchmarkEconomicRealWealthCreation = benchmarkRealWealthCreation - benchmark.realLaborCost;

      return {
        id: scenarioId,
        label: baseScenario.label,
        years,
        initialCapital: nominalCommittedCapital,
        realInitialCapitalAtT0,
        initialCapex: baseScenario.capex,
        setupResidual,
        propertyEndValue,
        reserveBalance,
        workingCapital,
        securityDeposit,
        cumulativeCash: cashBalance,
        cumulativeFreeCashBeforeFunding,
        externalFundingRequired,
        annualLiquidityNeed: timing.annualLiquidityNeed,
        fundingSchedule: timing.fundingSchedule,
        averageAnnualFreeCash: cumulativeFreeCashBeforeFunding / years,
        monthlyEquivalentFreeCash: cumulativeFreeCashBeforeFunding / (years * 12),
        endNetWorth,
        realEndNetWorth,
        realWealthCreation,
        nominalExcessOverPreservation,
        realLaborCost,
        economicRealWealthCreation: realWealthCreation - realLaborCost,
        benchmarkRealWealthCreation,
        benchmarkEconomicRealWealthCreation,
        financialGapVsBenchmark: realWealthCreation - benchmarkRealWealthCreation,
        economicGapVsBenchmark: (realWealthCreation - realLaborCost) - benchmarkEconomicRealWealthCreation,
        paybackYear,
        yearsDetail
      };
    });

    const investment = projectInvestmentOverHorizon(
      baseState,
      years,
      baseCalc.netSaleProceeds,
      baseCalc.startingPropertyEquity
    );
    projectedScenarios.push({
      id: 'investment',
      label: 'Investimento financeiro',
      years,
      initialCapital: baseCalc.startingPropertyEquity,
      initialCapex: 0,
      setupResidual: 0,
      propertyEndValue: 0,
      reserveBalance: 0,
      workingCapital: 0,
      securityDeposit: 0,
      cumulativeCash: investment.cumulativeCash,
      cumulativeFreeCashBeforeFunding: investment.cumulativeCash,
      externalFundingRequired: 0,
      annualLiquidityNeed: 0,
      fundingSchedule: [],
      averageAnnualFreeCash: investment.cumulativeCash / years,
      monthlyEquivalentFreeCash: investment.cumulativeCash / (years * 12),
      endNetWorth: investment.endNetWorth,
      realEndNetWorth: investment.realEndNetWorth,
      realWealthCreation: investment.realWealthCreation,
      nominalExcessOverPreservation: investment.nominalExcessOverPreservation,
      realLaborCost: investment.realLaborCost,
      economicRealWealthCreation: investment.economicRealWealthCreation,
      benchmarkRealWealthCreation: investment.realWealthCreation,
      benchmarkEconomicRealWealthCreation: investment.economicRealWealthCreation,
      financialGapVsBenchmark: 0,
      economicGapVsBenchmark: 0,
      paybackYear: 0,
      yearsDetail: investment.yearsDetail
    });

    return {
      years,
      scenarios: projectedScenarios,
      bestRealWealth: [...projectedScenarios].sort((a,b)=>b.realWealthCreation-a.realWealthCreation)[0],
      bestEconomic: [...projectedScenarios].sort((a,b)=>b.economicRealWealthCreation-a.economicRealWealthCreation)[0],
      inflation,
      nominalAppreciation
    };
  }

  function renderHorizonComparison() {
    const root = $('#horizonComparison');
    if (!root) return;
    const selected = [1,3,5].includes(Number(state.analysis.horizonYears)) ? Number(state.analysis.horizonYears) : 5;
    const projections = new Map([1,3,5].map((years)=>[years,calculateHorizonProjection(state,years)]));
    const selectedProjection = projections.get(selected);
    const ids = ['airbnb-self','airbnb-admin','airbnb-rented','traditional','investment'];
    const labelFor = (id) => projections.get(1).scenarios.find((x)=>x.id===id)?.label || id;
    root.innerHTML = `
      <div class="horizon-highlight">
        <span>Horizonte em destaque: ${selected} ano${selected>1?'s':''}</span>
        <strong>${escapeHtml(selectedProjection.bestRealWealth.label)}</strong>
        <small>maior ganho patrimonial real: ${money.format(selectedProjection.bestRealWealth.realWealthCreation)}</small>
      </div>
      <div class="table-card horizon-table-card"><div class="table-scroll"><table class="horizon-table">
        <thead><tr><th>Cenário</th>${[1,3,5].map((h)=>`<th class="${h===selected?'selected-horizon':''}">${h} ano${h>1?'s':''}</th>`).join('')}</tr></thead>
        <tbody>${ids.map((id)=>`<tr><th>${escapeHtml(labelFor(id))}</th>${[1,3,5].map((h)=>{
          const sc=projections.get(h).scenarios.find((x)=>x.id===id);
          const payback=sc.paybackYear==null?'sem payback':sc.paybackYear===0?'sem CAPEX':`payback ano ${sc.paybackYear}`;
          return `<td class="${h===selected?'selected-horizon':''}"><strong>${money.format(sc.realWealthCreation)}</strong><small>ganho real</small><span>Caixa livre acumulado: ${money.format(sc.cumulativeFreeCashBeforeFunding)}</span><span>Média mensal eq.: ${money.format(sc.monthlyEquivalentFreeCash)}</span><span class="${sc.financialGapVsBenchmark>=0?'positive-text':'negative'}">Δ benchmark: ${money.format(sc.financialGapVsBenchmark)}</span>${sc.externalFundingRequired>0?`<span>Aportes anuais: ${money.format(sc.externalFundingRequired)} · ${(sc.fundingSchedule||[]).length} ano(s)</span>`:''}<span>${payback}</span></td>`;
        }).join('')}</tr>`).join('')}</tbody>
      </table></div></div>
      <p class="helper">Motor anual: receitas, aluguel e custos monetários evoluem ano a ano; CAPEX e venda entram uma única vez. “Média mensal equivalente” é apenas o valor anual/acumulado dividido pelos meses do horizonte — não é fluxo de caixa mensal.</p>`;
  }

  function renderHybridUse(calc) {
    const root = $('#hybridUseSummary');
    if (!root) return;
    const hybrid = calc.hybridUse;
    if (!hybrid?.active) {
      root.innerHTML = `
        <article><span>Análise incremental</span><strong>Inativa</strong><small>Classifique dias como uso pessoal/moradia ou informe premissas de uso híbrido para ativar.</small></article>
        <article><span>Dias Airbnb</span><strong>${number1.format(calc.availableDays)}</strong><small>disponíveis no ano; o cenário-base permanece inalterado</small></article>`;
      return;
    }
    root.innerHTML = `
      <article><span>Caixa incremental do Airbnb</span><strong>${money.format(hybrid.freeCash)}</strong><small>receita − custos incrementais − IR − reserva; custos fixos preexistentes ficam fora</small></article>
      <article><span>Benefício líquido de consumo</span><strong>${money.format(hybrid.consumptionBenefit)}</strong><small>hospedagem evitada + moradia imputada − custos incrementais de uso próprio</small></article>
      <article><span>CAPEX adicional</span><strong>${money.format(hybrid.incrementalCapex)}</strong><small>${money.format(hybrid.incrementalCapexResidual)} permanecem como residual estimado</small></article>
      <article><span>Caixa do 1º ano após CAPEX</span><strong>${money.format(hybrid.firstYearCashAfterCapex)}</strong><small>liquidez; residual não é tratado como caixa</small></article>
      <article><span>Patrimônio incremental vinculado</span><strong>${money.format(hybrid.linkedPatrimony)}</strong><small>reserva gerada + residual do CAPEX adicional</small></article>
      <article><span>Resultado econômico incremental</span><strong>${money.format(hybrid.economicIncrement)}</strong><small>caixa Airbnb + benefício de consumo − depreciação do CAPEX adicional</small></article>`;
  }

  function calculateAndRender() {
    const calc = calculateModel(state);
    lastCalculation = calc;

    calc.seasonDetails.forEach((item) => {
      const revenueCell = document.querySelector(`[data-season-revenue="${cssEscape(item.id)}"]`);
      const availableCell = document.querySelector(`[data-season-available="${cssEscape(item.id)}"]`);
      if (revenueCell) revenueCell.textContent = money2.format(item.revenue);
      if (availableCell) availableCell.textContent = number1.format(item.availableDays);
    });

    $('#totalDays').textContent = `${number1.format(calc.totalDays)} dias`;
    $('#personalUseDays').textContent = `${number1.format(calc.personalUseDays)} dias`;
    $('#habitualUseDays').textContent = `${number1.format(calc.habitualUseDays)} dias`;
    $('#operationalUnavailableDays').textContent = `${number1.format(calc.operationalUnavailableDays)} dias`;
    $('#availableDays').textContent = `${number1.format(calc.availableDays)} dias`;
    $('#weightedAdr').textContent = money2.format(calc.averageNightlyRate);
    $('#weightedOccupancy').textContent = percent.format(calc.weightedOccupancy);
    $('#seasonRevenue').textContent = money2.format(calc.accommodationRevenue);
    $('#metricAverageNightlyRate').textContent = money2.format(calc.averageNightlyRate);
    $('#metricTotalAdr').textContent = money2.format(calc.totalAdr);
    $('#metricRevPar').textContent = money2.format(calc.revPar);
    $('#metricTotalRevPar').textContent = money2.format(calc.totalRevPar);
    $('#stayCostTotal').textContent = money2.format(calc.stayCostPerReservation);
    $('#monthlyAirbnbTotal').textContent = money.format(calc.fixedAirbnb);
    $('#monthlyRentedAirbnbTotal').textContent = money.format(calc.fixedRentedAirbnb);
    $('#monthlyTraditionalTotal').textContent = money.format(calc.fixedTraditional);
    $('#monthlyAdminExcludedTotal').textContent = money.format(calc.adminFixedAirbnb);
    $('#percentageCostTotal').textContent = percent.format(calc.pctCostRate);
    $('#reserveFundTotal').textContent = percent.format(calc.reserveRate);
    $('#reserveFundOpeningTotal').textContent = money.format(calc.reserveOpening);
    $('#reserveAdminContributionTotal').textContent = money.format(calc.adminReserveContribution);
    $('#setupAirbnbTotal').textContent = money.format(calc.selfSetup);
    $('#setupRentedAirbnbTotal').textContent = money.format(calc.rentedSetupAssets);
    $('#setupTraditionalTotal').textContent = money.format(calc.traditionalSetup);
    $('#setupAdminExcludedTotal').textContent = money.format(calc.adminSetup);
    $('#setupAirbnbResidualTotal').textContent = money.format(calc.selfSetupResidual);
    $('#setupRentedAirbnbResidualTotal').textContent = money.format(calc.rentedSetupResidual);
    $('#setupTraditionalResidualTotal').textContent = money.format(calc.traditionalSetupResidual);
    $('#setupAdminResidualTotal').textContent = money.format(calc.adminSetupResidual);

    const propertyPreview = $('#propertyAppreciationPreview');
    if (propertyPreview) propertyPreview.textContent = `Com inflação de ${percent.format(calc.inflation)}, isso equivale a ${percent.format(calc.nominalPropertyAppreciation)} de valorização nominal.`;
    const investmentScenario = calc.scenarios.find((scenario) => scenario.id === 'investment');
    const salePreview = $('#saleConversionPreview');
    if (salePreview) {
      salePreview.innerHTML = `
        <article><span>Valor de mercado</span><strong>${money.format(calc.propertyValue)}</strong><small>patrimônio imobiliário de referência</small></article>
        <article><span>Valor esperado de venda</span><strong>${money.format(calc.salePrice)}</strong><small>após ajuste informado</small></article>
        <article><span>Custos de transação</span><strong>${money.format(calc.saleTransactionCosts)}</strong><small>corretagem + documentação + IR de ganho + outros</small></article>
        <article><span>Capital líquido investível</span><strong>${money.format(calc.netSaleProceeds)}</strong><small>após custos e eventual quitação de financiamento</small></article>`;
    }
    const investmentPreview = $('#investmentNormalizationPreview');
    if (investmentPreview && investmentScenario) {
      const netNominalRate = investmentScenario.initialCapital > 0 ? investmentScenario.wealthCreation / investmentScenario.initialCapital : 0;
      investmentPreview.innerHTML = `
        <article><span>Rendimento líquido nominal</span><strong>${percent.format(netNominalRate)}</strong><small>${money.format(investmentScenario.wealthCreation)} no ano</small></article>
        <article><span>Preservação do poder de compra</span><strong>${money.format(investmentScenario.capitalPreservationAmount)}</strong><small>parcela que precisa permanecer aplicada para manter o principal real</small></article>
        <article><span>Caixa sustentável distribuível</span><strong>${money.format(investmentScenario.freeCash)}</strong><small>pode ser retirado sem reduzir o principal em poder de compra</small></article>
        <article><span>Ganho patrimonial real</span><strong>${money.format(investmentScenario.realWealthCreation)}</strong><small>${percent.format(investmentScenario.realTotalReturn)} em reais de hoje</small></article>`;
    }

    renderAdminPackage(calc);
    renderRentedContract(calc);
    renderHybridUse(calc);
    renderDayStatus(calc.totalDays);
    renderKpis(calc);
    renderResultsTable(calc);
    renderBreakdowns(calc);
    renderDiagnostics(calc);
    renderFinalSummary(calc);
    renderHorizonComparison();
  }
  function renderRentedContract(calc) {
    const root = $('#rentedContractSummary');
    if (!root) return;
    const itemTags = (calc.rentedMonthlyCostItems || []).length
      ? calc.rentedMonthlyCostItems.map((x) => `<span class="admin-tag">${escapeHtml(x.name)} · ${money.format(x.monthly)}/mês</span>`).join('')
      : '<span class="admin-empty">Nenhum custo mensal adicional atribuído ao locatário.</span>';
    root.innerHTML = `
      <div class="rented-contract-status ${calc.rentedSubleaseAuthorized ? 'authorized' : 'warning'}">
        <strong>${calc.rentedSubleaseAuthorized ? 'Operação autorizada no contrato' : 'Autorização contratual ainda não confirmada'}</strong>
        <span>${calc.rentedFurnished ? 'Imóvel mobiliado' : 'Imóvel não mobiliado'} · aluguel ${money.format(calc.rentedLeaseRent / 12)}/mês</span>
      </div>
      <div class="rented-contract-metrics">
        <div><span>Aluguel anual</span><strong>${money.format(calc.rentedLeaseRent)}</strong></div>
        <div><span>Custos mensais atribuídos</span><strong>${money.format(calc.fixedRentedAirbnb)}</strong></div>
        <div><span>OPEX percentual aplicável</span><strong>${percent.format(calc.rentedPctCostRate)}</strong></div>
        <div><span>CAPEX de ativos aplicável</span><strong>${money.format(calc.rentedSetupAssets)}</strong></div>
        <div><span>Entrada do contrato</span><strong>${money.format(calc.rentedInitialLeaseCosts)}</strong></div>
        <div><span>Caução / garantia vinculada</span><strong>${money.format(calc.rentedSecurityDeposit)}</strong></div>
        <div><span>Fim do horizonte</span><strong>Renovar / continuar</strong></div>
      </div>
      <div class="admin-tag-group"><strong>Custos mensais marcados para o locatário</strong>${itemTags}</div>
    `;
  }

  function renderAdminPackage(calc) {
    const root = $('#adminIncludedSummary');
    const managed = calc.managedAdminItems || [];
    const included = calc.includedAdminItems || [];
    if (!managed.length && !included.length) {
      root.innerHTML = '<span class="admin-empty">Nenhuma atividade delegada e nenhum custo marcado como incluído.</span>';
      return;
    }
    const managedHtml = managed.length
      ? `<div class="admin-tag-group"><strong>Gerencia / reduz seu tempo</strong>${managed.map((name) => `<span class="admin-tag">↳ ${escapeHtml(name)}</span>`).join('')}</div>`
      : '<div class="admin-tag-group"><strong>Gerencia / reduz seu tempo</strong><span class="admin-empty">Nenhuma atividade</span></div>';
    const includedHtml = included.length
      ? `<div class="admin-tag-group"><strong>Custos incluídos na comissão</strong>${included.map((name) => `<span class="admin-tag">✓ ${escapeHtml(name)}</span>`).join('')}</div>`
      : '<div class="admin-tag-group"><strong>Custos incluídos na comissão</strong><span class="admin-empty">Nenhum custo</span></div>';
    root.innerHTML = managedHtml + includedHtml;
  }

  function renderDayStatus(totalDays) {
    const diff = totalDays - 365;
    const el = $('#daysStatus');
    if (Math.abs(diff) < 0.001) {
      el.textContent = '365 dias configurados';
      el.classList.remove('warning');
    } else {
      el.textContent = `${number1.format(totalDays)} dias · ${diff > 0 ? '+' : ''}${number1.format(diff)} vs. ano`;
      el.classList.add('warning');
    }
  }

  function renderKpis(calc) {
    const cards = [
      { label: 'Receita Airbnb total', value: money.format(calc.airbnbRevenue), sub: `${money.format(calc.guestFeeRevenue)} em taxas do hóspede` },
      { label: 'Ocupação dos dias disponíveis', value: percent.format(calc.weightedOccupancy), sub: `${percent.format(calc.calendarOccupancy)} do calendário total` },
      { label: 'Melhor caixa livre', value: money.format(calc.bestCash.freeCash), sub: calc.bestCash.label, best: true },
      { label: 'Maior ganho patrimonial real', value: money.format(calc.bestRealWealth.realWealthCreation), sub: `${calc.bestRealWealth.label} · em R$ de hoje` }
    ];
    $('#kpiGrid').innerHTML = cards.map((x) => `<article class="kpi ${x.best ? 'best' : ''}"><span class="label">${escapeHtml(x.label)}</span><span class="value">${escapeHtml(x.value)}</span><span class="sub">${escapeHtml(x.sub)}</span></article>`).join('');
  }

  function renderResultsTable(calc) {
    $('#resultRows').innerHTML = calc.scenarios.map((scenario) => `
      <tr class="${scenario.id === calc.bestCash.id ? 'best-row' : ''}">
        <td>${escapeHtml(scenario.label)}</td>
        <td class="money-cell">${money.format(scenario.grossRevenue)}</td>
        <td class="money-cell">${money.format(scenario.opCosts)}</td>
        <td class="money-cell">${money.format(scenario.tax)}</td>
        <td class="money-cell">${money.format(scenario.operatingCash)}</td>
        <td class="money-cell">${money.format(scenario.cashPreservationRequirement || 0)}</td>
        <td class="money-cell">${money.format(scenario.reserveContribution)}</td>
        <td class="money-cell"><strong>${money.format(scenario.freeCash)}</strong></td>
        <td class="money-cell ${scenario.externalFundingRequired > 0 ? 'negative' : ''}">${money.format(scenario.externalFundingRequired)}</td>
        <td class="money-cell">${money.format(scenario.capex)}</td>
        <td class="money-cell">${money.format(scenario.setupResidual)}</td>
        <td class="money-cell">${money.format(scenario.tiedCapital)}</td>
        <td class="money-cell">${money.format(scenario.workingCapital || 0)}</td>
        <td class="money-cell"><strong>${money.format(scenario.opportunityCapital)}</strong></td>
        <td class="money-cell"><strong>${money.format(scenario.realWealthCreation)}</strong></td>
        <td class="money-cell">${money.format(scenario.benchmarkRealGain)}</td>
        <td class="money-cell ${scenario.financialGapVsBenchmark >= 0 ? 'positive-text' : 'negative'}"><strong>${money.format(scenario.financialGapVsBenchmark)}</strong></td>
        <td class="money-cell ${scenario.economicGapVsBenchmark >= 0 ? 'positive-text' : 'negative'}"><strong>${money.format(scenario.economicGapVsBenchmark)}</strong></td>
        <td class="money-cell">${money.format(scenario.endNetWorth)}</td>
        <td class="money-cell"><strong>${money.format(scenario.realEndNetWorth)}</strong></td>
        <td class="money-cell">${number1.format(scenario.workHoursAnnual || 0)} h</td>
        <td class="money-cell">${money.format(scenario.laborCost)}</td>
        <td class="money-cell"><strong>${money.format(scenario.economicResult)}</strong></td>
        <td class="percent-cell">${percent.format(scenario.cashYield)}</td>
        <td class="percent-cell"><strong>${percent.format(scenario.realTotalReturn)}</strong></td>
      </tr>`).join('');
  }

  function renderBreakdowns(calc) {
    $('#breakdownGrid').innerHTML = calc.scenarios.map((scenario) => {
      const lines = Object.entries(scenario.details).map(([key, value]) => {
        const lowerKey = key.toLowerCase();
        const isRate = lowerKey.includes('taxa bruta nominal') || lowerKey.includes('impacto admin. na diária');
        const isPercentagePoint = lowerKey.includes('impacto admin. na ocupação');
        const formatted = isPercentagePoint ? `${number1.format(value)} p.p.` : (isRate ? percent.format(value) : money.format(value));
        return `<div><dt>${escapeHtml(key)}</dt><dd>${formatted}</dd></div>`;
      }).join('');
      return `<article class="breakdown"><h3>${escapeHtml(scenario.label)}</h3><dl>${lines}</dl></article>`;
    }).join('');
  }

  function renderDiagnostics(calc) {
    const messages = [];
    if (Math.abs(calc.totalDays - 365) > 0.001) messages.push({ warning: true, text: `Os períodos somam ${number1.format(calc.totalDays)} dias. A comparação anual fica desalinhada até chegar a 365.` });
    if (n(state.airbnb.taxPct) === 0) messages.push({ warning: true, text: 'O IR efetivo do Airbnb está em 0%. Isso pode superestimar o caixa livre.' });
    if (calc.blockedDays > 0) messages.push({ text: `${number1.format(calc.blockedDays)} dias não entram na oferta: ${number1.format(calc.personalUseDays)} de uso pessoal, ${number1.format(calc.habitualUseDays)} de moradia e ${number1.format(calc.operationalUnavailableDays)} de indisponibilidade operacional. A ocupação de ${percent.format(calc.weightedOccupancy)} usa apenas os ${number1.format(calc.availableDays)} dias efetivamente ofertados.` });
    if (calc.blockedOverflowDays > 0) messages.push({ warning: true, text: `A classificação de dias excede a duração dos períodos em ${number1.format(calc.blockedOverflowDays)} dia(s). O motor limitou automaticamente o bloqueio ao total de dias disponível; ajuste a tabela para eliminar a inconsistência.` });
    if (calc.hybridUse?.active) messages.push({ text: `Na lente de uso híbrido, o Airbnb gera ${money.format(calc.hybridUse.freeCash)} de caixa incremental e o uso próprio/moradia gera ${money.format(calc.hybridUse.consumptionBenefit)} de benefício líquido de consumo. Esses valores permanecem separados de receita e patrimônio.` });
    if (calc.reservations > 0) messages.push({ text: `O modelo estima ${number1.format(calc.reservations)} reservas/ano. Cada R$ 10 adicionados ao custo por reserva reduzem o Airbnb autogerido em aproximadamente ${money.format(calc.reservations * 10)} ao ano.` });
    if (calc.selfReserveContribution > 0) messages.push({ text: `${money.format(calc.selfReserveContribution)} são transferidos para reservas vinculadas no Airbnb autogerido. Esse valor reduz o caixa livre, mas continua dentro do patrimônio.` });
    if (calc.selfSetup > 0) messages.push({ text: `Dos ${money.format(calc.selfSetup)} de CAPEX do Airbnb autogerido, ${money.format(calc.selfSetupResidual)} permanecem como valor residual estimado ao fim do 1º ano; a perda econômica estimada é ${money.format(calc.selfSetupDepreciation)}.` });
    const deficitScenarios = calc.scenarios.filter((scenario) => scenario.externalFundingRequired > 0);
    deficitScenarios.forEach((scenario) => messages.push({ warning: true, text: `${scenario.label} exige ${money.format(scenario.externalFundingRequired)} de aporte externo para cobrir o caixa negativo. Esse valor também foi somado ao capital do benchmark financeiro equivalente.` }));
    const rentedScenario = calc.scenarios.find((scenario) => scenario.id === 'airbnb-rented');
    if (rentedScenario) {
      messages.push({ text: `No Airbnb em imóvel alugado, o capital de oportunidade é ${money.format(rentedScenario.opportunityCapital)} — montagem/custos iniciais, capital vinculado e eventual aporte para déficit, sem incluir o valor do imóvel.` });
      if (!calc.rentedSubleaseAuthorized) messages.push({ warning: true, text: 'O cenário financeiro do Airbnb alugado está calculado, mas a autorização contratual para sublocação/locação por temporada ainda não foi confirmada.' });
      if (calc.rentedFurnished) messages.push({ text: 'O imóvel alugado está marcado como mobiliado: itens de CAPEX classificados como “só se não mobiliado” foram excluídos desse cenário.' });
    }
    const adminScenario = calc.scenarios.find((scenario) => scenario.id === 'airbnb-admin');
    if (adminScenario) {
      messages.push({ text: `No Airbnb administrado, o modelo estima ${number1.format(calc.workHours.admin)} horas suas por ano: tarefas não delegadas + supervisão residual da administradora.` });
      if (n(state.airbnb.adminNightlyRateImpactPct) !== 0 || n(state.airbnb.adminOccupancyImpactPp) !== 0) {
        messages.push({ text: `A administradora está configurada com impacto de ${number1.format(n(state.airbnb.adminNightlyRateImpactPct))}% na diária e ${number1.format(n(state.airbnb.adminOccupancyImpactPp))} p.p. na ocupação. Isso altera receita, reservas e custos variáveis do cenário administrado.` });
      }
    }
    if (n(state.globals.ownerHourlyValue) > 0) messages.push({ text: `Com sua hora avaliada em ${money.format(state.globals.ownerHourlyValue)}, o melhor resultado econômico de caixa é ${calc.bestEconomic.label}: ${money.format(calc.bestEconomic.economicResult)} ao ano.` });
    messages.push({ text: `A diária média das noites vendidas é ${money2.format(calc.averageNightlyRate)}. Incluindo taxas cobradas do hóspede, o ADR total é ${money2.format(calc.totalAdr)}. O RevPAR de diárias é ${money2.format(calc.revPar)} e o RevPAR total é ${money2.format(calc.totalRevPar)}.` });
    messages.push({ text: `O imóvel está projetado para valorizar ${percent.format(calc.nominalPropertyAppreciation)} nominalmente: ${percent.format(calc.inflation)} recompõem a inflação e ${percent.format(calc.realAppreciation)} representam valorização real acima dela.` });
    messages.push({ text: `A maior criação de patrimônio em poder de compra de hoje é ${calc.bestRealWealth.label}: ${money.format(calc.bestRealWealth.realWealthCreation)}.` });
    messages.push({ text: `Para transformar o imóvel em investimento financeiro, o modelo estima ${money.format(calc.saleTransactionCosts)} de custos de transação e ${money.format(calc.netSaleProceeds)} de capital líquido investível, partindo de ${money.format(calc.salePrice)} de valor esperado de venda.` });
    if (calc.saleMortgageBalance > 0) messages.push({ warning: true, text: 'Há saldo de financiamento informado. A venda quita essa dívida, mas os cenários que mantêm o imóvel ainda não modelam amortização/juros do financiamento; interprete os Δ de benchmark com cautela.' });
    messages.push({ text: `Na aplicação financeira, ${money.format(calc.investmentCapitalPreservationAmount)} de crescimento nominal são necessários para repor a inflação do patrimônio inicial; o excedente sustentável após a conversão do imóvel é ${money.format(calc.investmentSustainableCash)}.` });
    $('#diagnostics').innerHTML = messages.map((m) => `<div class="diagnostic ${m.warning ? 'warning' : ''}">${escapeHtml(m.text)}</div>`).join('');
  }

  function renderFinalSummary(calc) {
    const sorted = [...calc.scenarios].sort((a, b) => b.nominalExcessOverPreservation - a.nominalExcessOverPreservation);
    const best = sorted[0];
    const second = sorted[1];
    const lead = best.nominalExcessOverPreservation - second.nominalExcessOverPreservation;
    const maxAbsExcess = Math.max(...calc.scenarios.map((s) => Math.abs(s.nominalExcessOverPreservation)), 1);

    $('#finalWinner').innerHTML = `<span class="final-winner-label">Maior excedente nominal sobre preservação</span><strong>${escapeHtml(best.label)}</strong><span>${money.format(best.nominalExcessOverPreservation)} / ano</span><small>${money.format(best.monthlyEquivalentExcess)} / mês equivalente · ${lead > 0 ? `${money.format(lead)} acima do 2º colocado` : 'empate no maior resultado'}</small>`;

    $('#finalScenarioGrid').innerHTML = calc.scenarios.map((scenario) => {
      const isBest = scenario.id === best.id;
      const diff = scenario.nominalExcessOverPreservation - best.nominalExcessOverPreservation;
      const barWidth = Math.max(4, Math.abs(scenario.nominalExcessOverPreservation) / maxAbsExcess * 100);
      const freeCashLens = scenario.id === 'investment' ? 'Caixa sustentável' : 'Caixa livre';
      return `
        <article class="final-scenario-card ${isBest ? 'best' : ''}">
          <div class="final-scenario-topline"><span class="final-scenario-name">${escapeHtml(scenario.label)}</span>${isBest ? '<span class="best-badge">Maior excedente</span>' : ''}</div>
          <div class="final-annual ${scenario.nominalExcessOverPreservation < 0 ? 'negative' : ''}">${money.format(scenario.nominalExcessOverPreservation)}</div>
          <div class="final-annual-label">excedente nominal além da preservação do poder de compra / ano</div>
          <div class="final-monthly-equivalent">${money.format(scenario.monthlyEquivalentExcess)} / mês equivalente</div>
          <div class="final-bar-track" aria-hidden="true"><span style="width:${barWidth.toFixed(1)}%"></span></div>
          <div class="money-lenses">
            <div class="money-lens"><span>${freeCashLens}</span><strong>${money.format(scenario.freeCash)}</strong><small>${money.format(scenario.monthlyEquivalentFreeCash)} / mês equivalente</small></div>
            <div class="money-lens"><span>Ganho patrimonial real</span><strong>${money.format(scenario.realWealthCreation)}</strong><small>em poder de compra de hoje</small></div>
            <div class="money-lens"><span>Capital vinculado</span><strong>${money.format(scenario.tiedCapital)}</strong><small>reservas, cauções e garantias</small></div>
          </div>
          <div class="final-scenario-metrics final-scenario-metrics-v3">
            <div><span>Caixa antes das reservas / preservação</span><strong>${money.format(scenario.operatingCash)}</strong></div>
            <div><span>Necessário p/ preservar principal real</span><strong>${money.format(scenario.cashPreservationRequirement || 0)}</strong></div>
            <div><span>Aporte às reservas</span><strong>${money.format(scenario.reserveContribution)}</strong></div>
            <div><span>Aporte externo p/ déficit</span><strong>${money.format(scenario.externalFundingRequired)}</strong></div>
            <div><span>CAPEX inicial</span><strong>${money.format(scenario.capex)}</strong></div>
            <div><span>Valor residual CAPEX</span><strong>${money.format(scenario.setupResidual)}</strong></div>
            <div><span>Capital de giro vinculado</span><strong>${money.format(scenario.workingCapital || 0)}</strong></div>
            <div><span>Capital de oportunidade</span><strong>${money.format(scenario.opportunityCapital)}</strong></div>
            ${scenario.id === 'investment' ? `<div><span>Custos de venda do imóvel</span><strong>${money.format(scenario.transactionCosts || 0)}</strong></div><div><span>Capital líquido investido</span><strong>${money.format(scenario.opportunityCapital)}</strong></div>` : ''}
            ${scenario.benchmarkUsesPropertySale ? `<div><span>Capital líquido no benchmark</span><strong>${money.format(scenario.benchmarkInvestableCapital)}</strong></div>` : ''}
            <div><span>Ganho real do benchmark</span><strong>${money.format(scenario.benchmarkRealGain)}</strong></div>
            <div><span>Δ financeiro vs. benchmark</span><strong class="${scenario.financialGapVsBenchmark >= 0 ? 'positive-text' : 'negative'}">${money.format(scenario.financialGapVsBenchmark)}</strong></div>
            <div><span>Δ econômico vs. benchmark</span><strong class="${scenario.economicGapVsBenchmark >= 0 ? 'positive-text' : 'negative'}">${money.format(scenario.economicGapVsBenchmark)}</strong></div>
            <div><span>Patrimônio nominal final</span><strong>${money.format(scenario.endNetWorth)}</strong></div>
            <div><span>Patrimônio real final</span><strong>${money.format(scenario.realEndNetWorth)}</strong></div>
            <div><span>Preservação do poder de compra</span><strong>${money.format(scenario.capitalPreservationAmount)}</strong></div>
            <div><span>Excedente nominal sobre preservação</span><strong>${money.format(scenario.nominalExcessOverPreservation)}</strong></div>
            <div><span>Horas próprias / ano</span><strong>${number1.format(scenario.workHoursAnnual || 0)} h</strong></div>
            <div><span>Custo econômico das horas</span><strong>${money.format(scenario.laborCost)}</strong></div>
            <div><span>Resultado econômico (caixa − horas)</span><strong>${money.format(scenario.economicResult)}</strong></div>
            <div><span>Yield de caixa livre</span><strong>${percent.format(scenario.cashYield)}</strong></div>
            <div><span>Retorno patrimonial real</span><strong>${percent.format(scenario.realTotalReturn)}</strong></div>
          </div>
          <div class="final-difference ${isBest ? 'best-difference' : ''}">${isBest ? 'Maior excedente nominal sobre preservação' : `${money.format(Math.abs(diff))} a menos de excedente nominal que o melhor cenário`}</div>
        </article>`;
    }).join('');
  }

  function exportSimulation() {
    const payload = { app: 'simulador-airbnb', version: APP_VERSION, exportedAt: new Date().toISOString(), simulation: state };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(state.name || 'simulacao-airbnb')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function importSimulation(file) {
    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw);
      const incoming = parsed.simulation ?? parsed;
      if (!incoming || typeof incoming !== 'object') throw new Error('Formato inválido');
      state = normalizeState(incoming);
      autosave();
      renderAll();
      showNotice(`Simulação “${state.name || file.name}” carregada com sucesso.`);
    } catch (error) { showNotice(`Não foi possível carregar o arquivo: ${error.message}`, true); }
  }

  function showNotice(text, isError = false) {
    const el = $('#loadNotice');
    el.textContent = text;
    el.classList.remove('hidden');
    el.style.borderLeftColor = isError ? 'var(--danger)' : 'var(--accent)';
    clearTimeout(showNotice.timer);
    showNotice.timer = setTimeout(() => el.classList.add('hidden'), 5000);
  }

  async function copySummary() {
    if (!lastCalculation) return;
    const calc = lastCalculation;
    const lines = [
      `${state.name}`,
      `Valor do imóvel: ${money.format(calc.propertyValue)}`,
      `Inflação: ${percent.format(calc.inflation)}`,
      `Valorização real esperada do imóvel: ${percent.format(calc.realAppreciation)}`,
      `Valorização nominal projetada do imóvel: ${percent.format(calc.nominalPropertyAppreciation)}`,
      `Venda para benchmark: ${money.format(calc.salePrice)} − custos de transação ${money.format(calc.saleTransactionCosts)} − saldo de financiamento ${money.format(calc.saleMortgageBalance)} = capital líquido ${money.format(calc.netSaleProceeds)}`,
      '',
      ...calc.scenarios.map((s) => `${s.label}: excedente ${money.format(s.nominalExcessOverPreservation)}/ano (${money.format(s.monthlyEquivalentExcess)}/mês equivalente) · caixa livre ${money.format(s.freeCash)}/ano · trabalho ${number1.format(s.workHoursAnnual || 0)} h/ano = ${money.format(s.laborCost)} · resultado econômico ${money.format(s.economicResult)} · ganho patrimonial real ${money.format(s.realWealthCreation)} · capital vinculado ${money.format(s.tiedCapital)} · capital de oportunidade ${money.format(s.opportunityCapital)} · benchmark real ${money.format(s.benchmarkRealGain)} · Δ financeiro ${money.format(s.financialGapVsBenchmark)} · Δ econômico ${money.format(s.economicGapVsBenchmark)} · patrimônio real final ${money.format(s.realEndNetWorth)}`),
      '',
      `Airbnb: ${number1.format(calc.occupiedNights)} noites ocupadas · ${number1.format(calc.availableDays)} dias disponíveis · ocupação ${percent.format(calc.weightedOccupancy)} · diária média ${money2.format(calc.averageNightlyRate)} · ADR total ${money2.format(calc.totalAdr)} · RevPAR diárias ${money2.format(calc.revPar)} · RevPAR total ${money2.format(calc.totalRevPar)} · ${number1.format(calc.reservations)} reservas/ano`,
      ...(calc.hybridUse?.active ? [
        `Uso híbrido: ${number1.format(calc.personalUseDays)} dias pessoais + ${number1.format(calc.habitualUseDays)} dias de moradia + ${number1.format(calc.operationalUnavailableDays)} dias operacionais · caixa Airbnb incremental ${money.format(calc.hybridUse.freeCash)} · benefício de consumo ${money.format(calc.hybridUse.consumptionBenefit)} · resultado econômico incremental ${money.format(calc.hybridUse.economicIncrement)}`
      ] : [])
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      showNotice('Resumo copiado para a área de transferência.');
    } catch { showNotice('Seu navegador não permitiu copiar automaticamente. Use o botão de baixar JSON.', true); }
  }

  function slugify(text) {
    return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'simulacao-airbnb';
  }
  function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
  function escapeAttr(value) { return escapeHtml(value); }
  function cssEscape(value) { return (typeof window !== 'undefined' && window.CSS && CSS.escape) ? CSS.escape(String(value)) : String(value).replace(/([ #;?%&,.+*~\\':"!^$\[\]()=>|/@])/g, '\\$1'); }

  function loadAccordionState() { try { const raw = localStorage.getItem(UI_STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; } }
  function saveAccordionState() { try { localStorage.setItem(UI_STORAGE_KEY, JSON.stringify($$('.accordion').filter((s) => s.open).map((s) => s.id))); } catch {} }
  function setAllAccordions(open) { $$('.accordion').forEach((section) => { section.open = open; }); saveAccordionState(); }
  function bindAccordions() {
    const saved = loadAccordionState();
    if (Array.isArray(saved)) $$('.accordion').forEach((section) => { section.open = saved.includes(section.id); });
    $$('.accordion').forEach((section) => section.addEventListener('toggle', saveAccordionState));
    $('#expandAllSections')?.addEventListener('click', () => setAllAccordions(true));
    $('#collapseAllSections')?.addEventListener('click', () => setAllAccordions(false));
  }

  let activeWizard = null;
  let activeWizardPatch = null;

  function financialWizardDraftFromState() {
    const saved = state.guidedSetup?.financial || {};
    const useSaved = Boolean(saved.configured);
    const inferredRateKind = useSaved && saved.rateKind
      ? saved.rateKind
      : (state.investment.mode === 'ipcaPlus' ? 'real-gross' : 'nominal-gross');
    const inferredRate = useSaved && saved.ratePct != null
      ? n(saved.ratePct)
      : (inferredRateKind === 'real-gross' ? n(state.investment.realRatePct) : n(state.investment.nominalRatePct));
    return {
      applicationType: useSaved ? (saved.applicationType || 'other') : 'other',
      rateKind: inferredRateKind,
      ratePct: inferredRate,
      taxPct: useSaved && saved.taxPct != null ? n(saved.taxPct) : n(state.investment.taxPct),
      feesPct: useSaved && saved.feesPct != null ? n(saved.feesPct) : n(state.investment.feesPct),
      termMonths: useSaved && saved.termMonths != null ? n(saved.termMonths) : 12,
      liquidity: useSaved ? (saved.liquidity || 'unknown') : 'unknown',
      role: useSaved ? (saved.role || 'benchmark') : 'benchmark'
    };
  }


  function propertyWizardDraftFromState() {
    const saved = state.guidedSetup?.acquisitionSale || {};
    const useSaved = Boolean(saved.configured);
    const getSetup = (id) => Math.max(0, n(state.setupCosts.find((x) => x.id === id)?.amount));
    return {
      position: useSaved ? saved.position : 'owned',
      availableCapital: useSaved ? n(saved.availableCapital) : 0,
      currentMarketValue: n(state.globals.propertyValue),
      purchasePrice: useSaved ? n(saved.purchasePrice, state.globals.propertyValue) : n(state.globals.propertyValue),
      purchaseCosts: useSaved ? n(saved.purchaseCosts) : 0,
      workingCapitalTarget: useSaved ? (saved.workingCapitalTarget || 'airbnbSelf') : 'airbnbSelf',
      workingCapitalAmount: useSaved ? n(saved.workingCapitalAmount) : n(state.workingCapital.airbnbSelf),
      salePriceAdjustmentPct: n(state.propertySale.salePriceAdjustmentPct),
      brokeragePct: n(state.propertySale.brokeragePct),
      fixedCosts: n(state.propertySale.fixedCosts),
      mortgageBalance: n(state.propertySale.mortgageBalance),
      capitalGainsTax: n(state.propertySale.capitalGainsTax),
      otherCosts: n(state.propertySale.otherCosts),
      setup_reforma: getSetup('reforma'),
      setup_mobilia: getSetup('mobilia'),
      setup_eletro: getSetup('eletro'),
      setup_enxoval: getSetup('enxoval'),
      setup_utensilios: getSetup('utensilios'),
      setup_fechadura: getSetup('fechadura'),
      setup_decoracao: getSetup('decoracao'),
      setup_fotografia: getSetup('fotografia'),
      setup_setup_anuncio: getSetup('setup-anuncio'),
      setup_cadastros: getSetup('cadastros')
    };
  }

  function propertyWizardFormHtml(draft) {
    const moneyInput = (field, label, value, help = '') => `
      <label class="field-group"><span class="field-label">${escapeHtml(label)}</span>
        <div class="input-prefix money-control"><span>R$</span><input data-wizard-field="${escapeAttr(field)}" type="number" min="0" step="100" value="${escapeAttr(value)}" /></div>
        ${help ? `<small class="field-help">${escapeHtml(help)}</small>` : ''}
      </label>`;
    return `
      <div class="wizard-section">
        <h3>Posição e imóvel</h3>
        <div class="wizard-form-grid">
          <label class="field-group"><span class="field-label">Situação que quero descrever</span>
            <select data-wizard-field="position">
              <option value="owned" ${draft.position==='owned'?'selected':''}>Já possuo o imóvel</option>
              <option value="buy" ${draft.position==='buy'?'selected':''}>Tenho capital e penso em comprar</option>
            </select>
          </label>
          ${moneyInput('availableCapital','Capital disponível para compra',draft.availableCapital,'Registrado para o caminho de aquisição; a comparação capital → compra depende da Issue #42.')}
          ${moneyInput('currentMarketValue','Valor de mercado atual do imóvel',draft.currentMarketValue)}
          ${moneyInput('purchasePrice','Preço de compra',draft.purchasePrice,'Usado como valor do imóvel quando a situação escolhida é “tenho capital”.')}
          ${moneyInput('purchaseCosts','Custos de aquisição (ITBI, escritura, registro etc.)',draft.purchaseCosts,'Registrados, mas ainda não entram no motor econômico; rastreado na Issue #42.')}
        </div>
      </div>
      <div class="wizard-section">
        <h3>Reforma e montagem do imóvel próprio</h3>
        <p class="helper">Cada valor é aplicado à categoria de CAPEX já existente, preservando seu residual/depreciação.</p>
        <div class="wizard-form-grid">
          ${moneyInput('setup_reforma','Reforma / adaptação',draft.setup_reforma)}
          ${moneyInput('setup_mobilia','Mobiliário',draft.setup_mobilia)}
          ${moneyInput('setup_eletro','Eletrodomésticos',draft.setup_eletro)}
          ${moneyInput('setup_enxoval','Enxoval inicial',draft.setup_enxoval)}
          ${moneyInput('setup_utensilios','Utensílios e equipamentos',draft.setup_utensilios)}
          ${moneyInput('setup_fechadura','Fechadura / acesso',draft.setup_fechadura)}
          ${moneyInput('setup_decoracao','Decoração',draft.setup_decoracao)}
          ${moneyInput('setup_fotografia','Fotografia',draft.setup_fotografia)}
          ${moneyInput('setup_setup_anuncio','Setup do anúncio',draft.setup_setup_anuncio)}
          ${moneyInput('setup_cadastros','Licenças / cadastros iniciais',draft.setup_cadastros)}
        </div>
      </div>
      <div class="wizard-section">
        <h3>Capital de giro</h3>
        <div class="wizard-form-grid">
          <label class="field-group"><span class="field-label">Cenário que recebe o capital de giro</span>
            <select data-wizard-field="workingCapitalTarget">
              <option value="airbnbSelf" ${draft.workingCapitalTarget==='airbnbSelf'?'selected':''}>Airbnb próprio</option>
              <option value="airbnbAdmin" ${draft.workingCapitalTarget==='airbnbAdmin'?'selected':''}>Airbnb com administradora</option>
              <option value="traditional" ${draft.workingCapitalTarget==='traditional'?'selected':''}>Aluguel tradicional</option>
            </select>
          </label>
          ${moneyInput('workingCapitalAmount','Capital de giro vinculado',draft.workingCapitalAmount)}
        </div>
      </div>
      <div class="wizard-section">
        <h3>Venda / conversão em capital líquido</h3>
        <div class="wizard-form-grid">
          <label class="field-group"><span class="field-label">Ajuste do preço esperado de venda</span><div class="input-suffix compact-control"><input data-wizard-field="salePriceAdjustmentPct" type="number" step="0.1" value="${escapeAttr(draft.salePriceAdjustmentPct)}" /><span>%</span></div></label>
          <label class="field-group"><span class="field-label">Corretagem</span><div class="input-suffix compact-control"><input data-wizard-field="brokeragePct" type="number" min="0" step="0.1" value="${escapeAttr(draft.brokeragePct)}" /><span>%</span></div></label>
          ${moneyInput('fixedCosts','Custos/documentação da venda',draft.fixedCosts)}
          ${moneyInput('mortgageBalance','Saldo de financiamento a quitar',draft.mortgageBalance)}
          ${moneyInput('capitalGainsTax','IR estimado sobre ganho de capital',draft.capitalGainsTax)}
          ${moneyInput('otherCosts','Outros custos de liquidação',draft.otherCosts)}
        </div>
      </div>
      <div class="concept-note"><strong>Limite atual:</strong> a venda líquida já afeta o benchmark financeiro. No caminho “tenho capital e penso em comprar”, preço, CAPEX e capital de giro podem ser aplicados, mas capital disponível e custos de aquisição ainda não entram no cálculo; essa modelagem está registrada na Issue #42.</div>`;
  }


  function airbnbOpsWizardDraftFromState() {
    const saved = state.guidedSetup?.airbnbOps || {};
    const useSaved = Boolean(saved.configured);
    const getStay = (id) => Math.max(0, n(state.stayCosts.find((x) => x.id === id)?.amount));
    const getMonthly = (id) => Math.max(0, n(state.monthlyCosts.find((x) => x.id === id)?.amount));
    const value = (key, fallback) => useSaved && saved[key] != null ? n(saved[key]) : fallback;
    return {
      avgStayNights: value('avgStayNights', n(state.airbnb.avgStayNights)),
      cleaningFeeRevenue: value('cleaningFeeRevenue', n(state.airbnb.cleaningFeeRevenue)),
      checkinCost: value('checkinCost', getStay('checkin')),
      cleaningCost: value('cleaningCost', getStay('limpeza')),
      laundryCost: value('laundryCost', getStay('lavanderia')),
      guestSupportMonthly: value('guestSupportMonthly', getMonthly('guest-support')),
      localSupportMonthly: value('localSupportMonthly', getMonthly('local-support')),
      marketingMonthly: value('marketingMonthly', getMonthly('marketing')),
      pmsMonthly: value('pmsMonthly', getMonthly('software')),
      pricingMonthly: value('pricingMonthly', getMonthly('pricing')),
      waterMonthly: value('waterMonthly', getMonthly('agua')),
      electricityMonthly: value('electricityMonthly', getMonthly('luz')),
      gasMonthly: value('gasMonthly', getMonthly('gas')),
      internetMonthly: value('internetMonthly', getMonthly('internet'))
    };
  }

  function airbnbOpsWizardFormHtml(draft) {
    const moneyInput = (field, label, value, suffix = 'mês') => `
      <label class="field-group"><span class="field-label">${escapeHtml(label)}</span>
        <div class="input-prefix money-control"><span>R$</span><input data-wizard-field="${escapeAttr(field)}" type="number" min="0" step="10" value="${escapeAttr(value)}" /></div>
        <small class="field-help">${suffix === 'reserva' ? 'por reserva' : 'por mês'}</small>
      </label>`;
    return `
      <div class="wizard-section">
        <h3>Estadia e taxas do hóspede</h3>
        <div class="wizard-form-grid">
          <label class="field-group"><span class="field-label">Estadia média</span><div class="input-suffix compact-control"><input data-wizard-field="avgStayNights" type="number" min="0.1" step="0.1" value="${escapeAttr(draft.avgStayNights)}" /><span>noites</span></div></label>
          ${moneyInput('cleaningFeeRevenue','Taxa de limpeza cobrada do hóspede',draft.cleaningFeeRevenue,'reserva')}
        </div>
      </div>
      <div class="wizard-section">
        <h3>Custos por reserva</h3>
        <div class="wizard-form-grid">
          ${moneyInput('checkinCost','Check-in / check-out',draft.checkinCost,'reserva')}
          ${moneyInput('cleaningCost','Limpeza',draft.cleaningCost,'reserva')}
          ${moneyInput('laundryCost','Lavanderia',draft.laundryCost,'reserva')}
        </div>
      </div>
      <div class="wizard-section">
        <h3>Operação mensal</h3>
        <div class="wizard-form-grid">
          ${moneyInput('guestSupportMonthly','Atendimento ao hóspede',draft.guestSupportMonthly)}
          ${moneyInput('localSupportMonthly','Suporte operacional local',draft.localSupportMonthly)}
          ${moneyInput('marketingMonthly','Marketing / conteúdo',draft.marketingMonthly)}
          ${moneyInput('pmsMonthly','PMS / software / automação',draft.pmsMonthly)}
          ${moneyInput('pricingMonthly','Pricing dinâmico',draft.pricingMonthly)}
        </div>
      </div>
      <div class="wizard-section">
        <h3>Utilities</h3>
        <div class="wizard-form-grid">
          ${moneyInput('waterMonthly','Água + esgoto',draft.waterMonthly)}
          ${moneyInput('electricityMonthly','Energia elétrica',draft.electricityMonthly)}
          ${moneyInput('gasMonthly','Gás',draft.gasMonthly)}
          ${moneyInput('internetMonthly','Internet',draft.internetMonthly)}
        </div>
      </div>
      <div class="concept-note"><strong>Premissas editáveis:</strong> o assistente parte dos valores atualmente configurados. Ao aplicar, ele altera somente os mesmos itens de estadia, custos mensais, estadia média e taxa de limpeza já visíveis nas seções detalhadas.</div>`;
  }

  function financialWizardFormHtml(draft) {
    return `
      <div class="wizard-form-grid">
        <label class="field-group"><span class="field-label">Tipo de aplicação</span>
          <select data-wizard-field="applicationType">
            <option value="cdb" ${draft.applicationType==='cdb'?'selected':''}>CDB / renda fixa bancária</option>
            <option value="treasury" ${draft.applicationType==='treasury'?'selected':''}>Tesouro / título público</option>
            <option value="fund" ${draft.applicationType==='fund'?'selected':''}>Fundo</option>
            <option value="etf" ${draft.applicationType==='etf'?'selected':''}>ETF / carteira de mercado</option>
            <option value="other" ${draft.applicationType==='other'?'selected':''}>Outra</option>
          </select>
        </label>
        <label class="field-group"><span class="field-label">Como a taxa está expressa?</span>
          <select data-wizard-field="rateKind">
            <option value="nominal-gross" ${draft.rateKind==='nominal-gross'?'selected':''}>Nominal bruta a.a.</option>
            <option value="nominal-net" ${draft.rateKind==='nominal-net'?'selected':''}>Nominal líquida a.a. (após IR e taxas)</option>
            <option value="real-gross" ${draft.rateKind==='real-gross'?'selected':''}>Real bruta acima da inflação</option>
          </select>
        </label>
        <label class="field-group"><span class="field-label">Taxa informada</span><div class="input-suffix compact-control"><input data-wizard-field="ratePct" type="number" min="0" step="0.01" value="${escapeAttr(draft.ratePct)}" /><span>% a.a.</span></div></label>
        <label class="field-group"><span class="field-label">IR sobre rendimentos</span><div class="input-suffix compact-control"><input data-wizard-field="taxPct" type="number" min="0" max="100" step="0.1" value="${escapeAttr(draft.taxPct)}" /><span>%</span></div></label>
        <label class="field-group"><span class="field-label">Taxas / custos anuais</span><div class="input-suffix compact-control"><input data-wizard-field="feesPct" type="number" min="0" step="0.01" value="${escapeAttr(draft.feesPct)}" /><span>% capital</span></div></label>
        <label class="field-group"><span class="field-label">Prazo de referência</span><div class="input-suffix compact-control"><input data-wizard-field="termMonths" type="number" min="1" step="1" value="${escapeAttr(draft.termMonths)}" /><span>meses</span></div></label>
        <label class="field-group"><span class="field-label">Liquidez</span>
          <select data-wizard-field="liquidity">
            <option value="daily" ${draft.liquidity==='daily'?'selected':''}>Diária / imediata</option>
            <option value="term" ${draft.liquidity==='term'?'selected':''}>No vencimento / com carência</option>
            <option value="market" ${draft.liquidity==='market'?'selected':''}>Venda a mercado</option>
            <option value="unknown" ${draft.liquidity==='unknown'?'selected':''}>Não informada</option>
          </select>
        </label>
        <label class="field-group"><span class="field-label">Papel na análise</span>
          <select data-wizard-field="role">
            <option value="benchmark" ${draft.role==='benchmark'?'selected':''}>Benchmark / custo de oportunidade</option>
            <option value="actual" ${draft.role==='actual'?'selected':''}>Aplicação real que possuo/pretendo fazer</option>
            <option value="both" ${draft.role==='both'?'selected':''}>Ambos</option>
          </select>
        </label>
      </div>
      <div class="concept-note"><strong>Sem regra escondida:</strong> prazo, liquidez e tipo ficam documentados, mas não alteram o retorno por conta própria. O motor anual usa somente taxa, IR e custos. Se você informar uma taxa nominal líquida, o assistente calcula a taxa bruta equivalente necessária para reproduzi-la com o IR e os custos informados.</div>`;
  }

  function readWizardDraft() {
    const out = {};
    $('#wizardBody [data-wizard-field]').forEach((input) => {
      out[input.dataset.wizardField] = input.type === 'number' ? n(input.value) : input.value;
    });
    return out;
  }

  function setWizardReviewMode(reviewing) {
    $('#wizardBody')?.classList.toggle('wizard-reviewing', reviewing);
    $('#wizardPreview')?.classList.toggle('hidden', !reviewing);
    $('#wizardBackButton')?.classList.toggle('hidden', !reviewing);
    $('#wizardReviewButton')?.classList.toggle('hidden', reviewing);
    $('#wizardApplyButton')?.classList.toggle('hidden', !reviewing);
  }

  function openFinancialWizard() {
    activeWizard = 'financial';
    activeWizardPatch = null;
    const draft = financialWizardDraftFromState();
    $('#wizardTitle').textContent = 'Benchmark financeiro';
    $('#wizardDescription').textContent = 'Converta a descrição da aplicação nas variáveis financeiras já usadas pelo simulador.';
    $('#wizardBody').innerHTML = financialWizardFormHtml(draft);
    $('#wizardPreview').innerHTML = '';
    setWizardReviewMode(false);
    $('#wizardDialog').showModal();
  }


  function openPropertyWizard() {
    activeWizard = 'property';
    activeWizardPatch = null;
    const draft = propertyWizardDraftFromState();
    $('#wizardTitle').textContent = 'Aquisição e venda do imóvel';
    $('#wizardDescription').textContent = 'Organize preço, CAPEX, capital de giro e premissas de venda sem criar custos ocultos.';
    $('#wizardBody').innerHTML = propertyWizardFormHtml(draft);
    $('#wizardPreview').innerHTML = '';
    setWizardReviewMode(false);
    $('#wizardDialog').showModal();
  }


  function openAirbnbOpsWizard() {
    activeWizard = 'airbnbOps';
    activeWizardPatch = null;
    const draft = airbnbOpsWizardDraftFromState();
    $('#wizardTitle').textContent = 'Operação Airbnb';
    $('#wizardDescription').textContent = 'Consolide estadia, serviços por reserva, operação recorrente e utilities.';
    $('#wizardBody').innerHTML = airbnbOpsWizardFormHtml(draft);
    $('#wizardPreview').innerHTML = '';
    setWizardReviewMode(false);
    $('#wizardDialog').showModal();
  }

  function reviewActiveWizard() {
    const draft = readWizardDraft();
    const patch = activeWizard === 'financial'
      ? buildFinancialWizardPatch(draft, state)
      : activeWizard === 'property'
        ? buildPropertyWizardPatch(draft, state)
        : activeWizard === 'airbnbOps'
          ? buildAirbnbOpsWizardPatch(draft, state)
          : null;
    if (!patch) return;
    activeWizardPatch = patch;
    const preview = $('#wizardPreview');
    if (!patch.valid) {
      preview.innerHTML = `<div class="notice wizard-error"><strong>Não é possível aplicar:</strong> ${patch.errors.map(escapeHtml).join(' ')}</div>`;
      setWizardReviewMode(true);
      $('#wizardApplyButton').disabled = true;
      return;
    }
    $('#wizardApplyButton').disabled = false;

    if (activeWizard === 'property') {
      const x = patch.normalized;
      const purchaseWarning = x.position === 'buy'
        ? `<li class="wizard-warning"><strong>Atenção:</strong> ${money.format(x.purchaseCosts)} de custos de aquisição e o capital disponível ficam registrados, mas ainda não entram no resultado econômico. A lacuna está na Issue #42.</li>`
        : '';
      const gapLine = x.position === 'buy' && x.availableCapital > 0
        ? `<li>Necessidade conhecida (antes da modelagem dos custos de compra): <strong>${money.format(x.purchaseCapitalNeedKnown)}</strong>; diferença vs. capital informado: <strong>${money.format(x.purchaseFundingGap)}</strong>.</li>`
        : '';
      preview.innerHTML = `
        <h3>Revise antes de aplicar</h3>
        <ul class="wizard-change-list">
          <li>Valor do imóvel aplicado ao motor: <strong>${money.format(x.propertyValue)}</strong>.</li>
          <li>CAPEX inicial distribuído nas categorias existentes: <strong>${money.format(x.setupTotal)}</strong>.</li>
          <li>Capital de giro: <strong>${money.format(x.workingCapitalAmount)}</strong> em <strong>${escapeHtml(x.workingCapitalTarget)}</strong>.</li>
          <li>Venda: ajuste ${number1.format(x.salePriceAdjustmentPct)}% · corretagem ${number1.format(x.brokeragePct)}% · custos fixos ${money.format(x.fixedCosts)} · financiamento ${money.format(x.mortgageBalance)} · IR ${money.format(x.capitalGainsTax)} · outros ${money.format(x.otherCosts)}.</li>
          ${gapLine}
          ${purchaseWarning}
        </ul>`;
      setWizardReviewMode(true);
      return;
    }

    if (activeWizard === 'airbnbOps') {
      const x = patch.normalized;
      const monthlyOps = x.guestSupportMonthly + x.localSupportMonthly + x.marketingMonthly + x.pmsMonthly + x.pricingMonthly;
      const utilities = x.waterMonthly + x.electricityMonthly + x.gasMonthly + x.internetMonthly;
      const perStay = x.checkinCost + x.cleaningCost + x.laundryCost;
      preview.innerHTML = `
        <h3>Revise antes de aplicar</h3>
        <ul class="wizard-change-list">
          <li>Estadia média: <strong>${number1.format(x.avgStayNights)} noites</strong> · taxa de limpeza do hóspede: <strong>${money.format(x.cleaningFeeRevenue)}</strong> por reserva.</li>
          <li>Custos por reserva: check-in ${money.format(x.checkinCost)} + limpeza ${money.format(x.cleaningCost)} + lavanderia ${money.format(x.laundryCost)} = <strong>${money.format(perStay)}</strong>.</li>
          <li>Operação recorrente configurada: <strong>${money.format(monthlyOps)}/mês</strong> em suporte, marketing, PMS e pricing.</li>
          <li>Utilities configuradas: <strong>${money.format(utilities)}/mês</strong>.</li>
          <li>Horas próprias, dedutibilidade fiscal, responsabilidade do locatário e itens da administradora não são alterados por este wizard.</li>
        </ul>`;
      setWizardReviewMode(true);
      return;
    }

    const x = patch.normalized;
    const rateLine = x.mode === 'ipcaPlus'
      ? `Inflação + <strong>${number1.format(x.realRatePct)}%</strong> real bruto a.a.`
      : `Taxa nominal bruta aplicada ao motor: <strong>${number1.format(x.nominalRatePct)}% a.a.</strong>`;
    const conversionLine = x.convertedGrossNominalPct == null
      ? ''
      : `<li>Taxa líquida informada convertida para <strong>${number1.format(x.convertedGrossNominalPct)}% a.a. brutos</strong>, para que IR e custos não sejam descontados duas vezes.</li>`;
    preview.innerHTML = `
      <h3>Revise antes de aplicar</h3>
      <ul class="wizard-change-list">
        <li>${rateLine}</li>
        <li>IR: <strong>${number1.format(x.taxPct)}%</strong> · custos anuais: <strong>${number1.format(x.feesPct)}%</strong> do capital.</li>
        ${conversionLine}
        <li>Prazo registrado: <strong>${number1.format(x.termMonths)} meses</strong> · liquidez: <strong>${escapeHtml(x.liquidity)}</strong> · papel: <strong>${escapeHtml(x.role)}</strong>.</li>
        <li>Tipo registrado: <strong>${escapeHtml(x.applicationType)}</strong>. Esses metadados não criam ajustes econômicos implícitos.</li>
      </ul>`;
    setWizardReviewMode(true);
  }

  function applyActiveWizard() {
    if (!activeWizardPatch?.valid) return;
    state = applyWizardPatch(state, activeWizardPatch);
    autosave();
    renderAll();
    $('#wizardDialog').close();
    showNotice('Premissas do benchmark financeiro aplicadas. Os campos detalhados continuam editáveis.');
    activeWizard = null;
    activeWizardPatch = null;
  }

  function bindWizards() {
    $('#openFinancialWizard')?.addEventListener('click', openFinancialWizard);
    $('#openPropertyWizard')?.addEventListener('click', openPropertyWizard);
    $('#openAirbnbOpsWizard')?.addEventListener('click', openAirbnbOpsWizard);
    $('#wizardReviewButton')?.addEventListener('click', reviewActiveWizard);
    $('#wizardBackButton')?.addEventListener('click', () => setWizardReviewMode(false));
    $('#wizardApplyButton')?.addEventListener('click', applyActiveWizard);
    $('#wizardDialog')?.addEventListener('close', () => {
      activeWizard = null;
      activeWizardPatch = null;
      $('#wizardApplyButton').disabled = false;
    });
  }

  function renderAll() { hydrateStaticInputs(); renderDynamicTables(); renderMarketComparables(); calculateAndRender(); }

  function init() {
    bindStaticInputs();
    bindDynamicTables();
    bindMarketComparables();
    bindAccordions();
    bindWizards();
    $('#addSeasonButton').addEventListener('click', addSeason);
    $('#addStayCostButton').addEventListener('click', addStayCost);
    $('#addMonthlyCostButton').addEventListener('click', addMonthlyCost);
    $('#addPercentageCostButton').addEventListener('click', addPercentageCost);
    $('#addReserveFundButton').addEventListener('click', addReserveFund);
    $('#addSetupCostButton').addEventListener('click', addSetupCost);
    $('#addMarketComparableButton')?.addEventListener('click', addMarketComparable);
    ['#saveButton', '#saveButtonBottom'].forEach((selector) => $(selector).addEventListener('click', exportSimulation));
    ['#loadButton', '#loadButtonBottom'].forEach((selector) => $(selector).addEventListener('click', () => $('#fileInput').click()));
    $('#fileInput').addEventListener('change', (event) => { const [file] = event.target.files || []; if (file) importSimulation(file); event.target.value = ''; });
    $('#copySummaryButton').addEventListener('click', copySummary);
    renderAll();
  }

  if (typeof window !== 'undefined') window.SimulatorAirbnb = {
    calculateModel, calculateMarketComparables, calculateMarketSuggestion, calculateHorizonProjection,
    defaultState: structuredCloneSafe(defaultState), normalizeState,
    buildFinancialWizardPatch, buildPropertyWizardPatch, buildAirbnbOpsWizardPatch, applyWizardPatch
  };
  if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', init);
})();
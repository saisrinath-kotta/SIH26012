// Cadastral GeoJSON and 3D Stratum Dataset
// Standard 3D Cadastral attributes according to ISO 19152 (LADM - Land Administration Domain Model)
// Coordinates in local metric space for 3D extrusion, with mapped WGS84 GeoJSON features for Turf.js

export const CADASTRAL_METRIC_ORIGIN = {
  longitude: 77.5945627,
  latitude: 12.9715987,
  srid: 'EPSG:4326 / Local Projected Grid (Meters)',
  zoneName: 'Central Innovation District, Cadastral Block-07',
  district: 'Bengaluru Urban / Central Revenue Division',
  state: 'Karnataka, India'
};

export const INITIAL_PARCELS = [
  {
    id: 'PAR-2024-C01',
    ulpin: '14092400192837', // 14-digit Unique Land Parcel Identification Number
    surveyNumber: 'Sy. No. 42/1A',
    khasraNumber: 'KH-892',
    name: 'Cyber Towers Tech Park',
    zone: 'Commercial',
    color: '#0ea5e9', // Sky blue
    wireColor: '#38bdf8',
    height: 48,
    floors: 14,
    setback: 4.5,
    taxStatus: 'Paid',
    taxAmount: '₹ 8,42,000 / yr',
    valuation: '₹ 42.50 Cr',
    owner: {
      primary: 'Skyline Infotech Infrastructures Ltd.',
      panOrId: 'AAACS8921K',
      registrationDate: '14-Mar-2018',
      deedBook: 'Volume 482, Page 112',
      encumbrance: 'Clear / Non-Encumbered'
    },
    // Local polygon coordinates in meters (X, Z relative to origin)
    polygon: [
      [-40, -40],
      [5, -45],
      [15, -10],
      [-30, -5],
      [-40, -40]
    ],
    // Geographic WGS84 coordinates for Turf.js calculations
    geoJsonCoordinates: [
      [
        [77.59416, 12.97120],
        [77.59461, 12.97115],
        [77.59471, 12.97150],
        [77.59426, 12.97155],
        [77.59416, 12.97120]
      ]
    ],
    strataUnits: [
      { unit: 'B1-B2', floor: 'Basement', type: 'EV Parking & Data Center', area: '1,450 sq.m', owner: 'Skyline Corp Facility', status: 'Reserved' },
      { unit: 'L01-L03', floor: 'Fl 1-3', type: 'Tech Experience Center', area: '2,800 sq.m', owner: 'Nexus Digital Labs', status: 'Leased' },
      { unit: 'L04-L09', floor: 'Fl 4-9', type: 'AI Engineering Hub', area: '5,600 sq.m', owner: 'Cognitive Cloud Global Inc.', status: 'Occupied' },
      { unit: 'L10-L14', floor: 'Fl 10-14', type: 'Executive Suites & Skydeck', area: '4,200 sq.m', owner: 'Skyline Infotech HQ', status: 'Owner Occupied' }
    ],
    restrictions: 'FAA Height Clearance 75m AGL, Non-polluting IT/ITES zone'
  },
  {
    id: 'PAR-2024-R02',
    ulpin: '14092400192838',
    surveyNumber: 'Sy. No. 42/1B',
    khasraNumber: 'KH-893',
    name: 'Green Valley Residences (Tower Alpha)',
    zone: 'Residential',
    color: '#10b981', // Emerald green
    wireColor: '#34d399',
    height: 32,
    floors: 10,
    setback: 3.5,
    taxStatus: 'Paid',
    taxAmount: '₹ 3,95,000 / yr',
    valuation: '₹ 26.80 Cr',
    owner: {
      primary: 'Green Valley Resident Welfare Association (Co-op)',
      panOrId: 'AAAGG4512P',
      registrationDate: '22-Aug-2020',
      deedBook: 'Volume 512, Page 45',
      encumbrance: 'Clear / Individual Mortgage Titles'
    },
    polygon: [
      [25, -45],
      [65, -40],
      [60, -5],
      [25, -10],
      [25, -45]
    ],
    geoJsonCoordinates: [
      [
        [77.59481, 12.97115],
        [77.59521, 12.97120],
        [77.59516, 12.97155],
        [77.59481, 12.97150],
        [77.59481, 12.97115]
      ]
    ],
    strataUnits: [
      { unit: 'A-101', floor: 'Fl 1', type: '3BHK Strata Condo', area: '185 sq.m', owner: 'Ananya Deshmukh', status: 'Occupied' },
      { unit: 'A-201', floor: 'Fl 2', type: '3BHK Strata Condo', area: '185 sq.m', owner: 'Dr. Vikram K. Rao', status: 'Occupied' },
      { unit: 'A-501', floor: 'Fl 5', type: '4BHK Duplex', area: '260 sq.m', owner: 'Kunal Singhania & Smt. Rita', status: 'Occupied' },
      { unit: 'A-PH01', floor: 'Fl 10 (Penthouse)', type: 'Sky Penthouse', area: '340 sq.m', owner: 'Meera Nambiar', status: 'Occupied' }
    ],
    restrictions: 'Residential Strata by-law Act 2017, Max FSI 2.75'
  },
  {
    id: 'PAR-2024-M03',
    ulpin: '14092400192839',
    surveyNumber: 'Sy. No. 43/2',
    khasraNumber: 'KH-894',
    name: 'Metro City Promenade & Retail Mall',
    zone: 'Mixed-Use',
    color: '#ec4899', // Pink
    wireColor: '#f472b6',
    height: 24,
    floors: 6,
    setback: 5.0,
    taxStatus: 'Overdue',
    taxAmount: '₹ 5,12,000 / yr (Overdue 60d)',
    valuation: '₹ 38.00 Cr',
    owner: {
      primary: 'Metro City Retail Holdings LLP',
      panOrId: 'AAAFM9921D',
      registrationDate: '05-Jan-2019',
      deedBook: 'Volume 498, Page 201',
      encumbrance: 'Hypothecated to Federal Union Bank'
    },
    polygon: [
      [-40, 10],
      [10, 10],
      [15, 45],
      [-35, 50],
      [-40, 10]
    ],
    geoJsonCoordinates: [
      [
        [77.59416, 12.97170],
        [77.59466, 12.97170],
        [77.59471, 12.97205],
        [77.59421, 12.97210],
        [77.59416, 12.97170]
      ]
    ],
    strataUnits: [
      { unit: 'G-01', floor: 'Ground', type: 'Anchor Hypermarket', area: '1,200 sq.m', owner: 'Nature Fresh Supermarkets', status: 'Leased' },
      { unit: 'F1-F3', floor: 'Fl 1-3', type: 'Boutique Fashion & Electronics', area: '2,400 sq.m', owner: 'Multiple Brand Tenants', status: 'Leased' },
      { unit: 'F4-F6', floor: 'Fl 4-6', type: 'Multiplex Cinema & Food Court', area: '2,100 sq.m', owner: 'Star Cineplex Group', status: 'Occupied' }
    ],
    restrictions: 'Mixed Commercial-Retail zoning, Public pedestrian arcade covenant'
  },
  {
    id: 'PAR-2024-G04',
    ulpin: '14092400192840',
    surveyNumber: 'Sy. No. 44/P',
    khasraNumber: 'KH-895',
    name: 'District Civil Administration & E-Governance Center',
    zone: 'Government',
    color: '#8b5cf6', // Violet
    wireColor: '#a78bfa',
    height: 18,
    floors: 4,
    setback: 6.0,
    taxStatus: 'Exempt',
    taxAmount: 'Exempt (Govt Property)',
    valuation: '₹ 19.50 Cr',
    owner: {
      primary: 'Revenue Dept., Directorate of Land Records',
      panOrId: 'GOVT-KA-REV-01',
      registrationDate: '10-Nov-2015',
      deedBook: 'Gazette Notification 451',
      encumbrance: 'State Sovereign Asset'
    },
    polygon: [
      [25, 10],
      [65, 12],
      [60, 48],
      [22, 45],
      [25, 10]
    ],
    geoJsonCoordinates: [
      [
        [77.59481, 12.97170],
        [77.59521, 12.97172],
        [77.59516, 12.97208],
        [77.59478, 12.97205],
        [77.59481, 12.97170]
      ]
    ],
    strataUnits: [
      { unit: 'ADM-01', floor: 'Ground', type: 'Public Citizen Facilitation Kendra', area: '950 sq.m', owner: 'Govt of Karnataka', status: 'Public Service' },
      { unit: 'GIS-02', floor: 'Fl 1', type: 'Survey & 3D Cadastral Mapping Cell', area: '950 sq.m', owner: 'Survey Settlement Dept', status: 'Govt Office' },
      { unit: 'DAT-03', floor: 'Fl 2', type: 'State Digital Land Registry Data Center', area: '900 sq.m', owner: 'Bhoomi E-Services', status: 'High Security' }
    ],
    restrictions: 'Public administrative use only, 100% boundary perimeter CCTV'
  },
  {
    id: 'PAR-2024-I05',
    ulpin: '14092400192841',
    surveyNumber: 'Sy. No. 45/1',
    khasraNumber: 'KH-896',
    name: 'Precision Advanced Hardware & Clean Room Facility',
    zone: 'Industrial',
    color: '#f59e0b', // Amber
    wireColor: '#fbbf24',
    height: 16,
    floors: 3,
    setback: 7.0,
    taxStatus: 'Paid',
    taxAmount: '₹ 4,75,000 / yr',
    valuation: '₹ 31.20 Cr',
    owner: {
      primary: 'Bharat Nano-Semiconductor Systems Pvt. Ltd.',
      panOrId: 'AAACN7710B',
      registrationDate: '18-Feb-2021',
      deedBook: 'Volume 530, Page 88',
      encumbrance: 'Clear Title'
    },
    polygon: [
      [-95, -45],
      [-55, -45],
      [-50, 10],
      [-90, 8],
      [-95, -45]
    ],
    geoJsonCoordinates: [
      [
        [77.59361, 12.97115],
        [77.59401, 12.97115],
        [77.59406, 12.97170],
        [77.59366, 12.97168],
        [77.59361, 12.97115]
      ]
    ],
    strataUnits: [
      { unit: 'ISO-01', floor: 'Ground', type: 'Class-100 Cleanroom Fabrication', area: '2,200 sq.m', owner: 'Bharat Nano Systems', status: 'Active Fab' },
      { unit: 'RND-02', floor: 'Fl 1', type: 'Photolithography & Testing Lab', area: '1,800 sq.m', owner: 'Bharat Nano Systems', status: 'Active Lab' }
    ],
    restrictions: 'Pollution Board Green Category, Heavy Vibration Isolation Zone'
  },
  {
    id: 'PAR-2024-P06',
    ulpin: '14092400192842',
    surveyNumber: 'Sy. No. 45/2',
    khasraNumber: 'KH-897',
    name: 'Cadastral Green Reserve & Rainwater Retention Basin',
    zone: 'Public Reserve',
    color: '#059669', // Deep green
    wireColor: '#10b981',
    height: 1.5,
    floors: 0,
    setback: 0,
    taxStatus: 'Exempt',
    taxAmount: 'Exempt (Public Park)',
    valuation: '₹ 12.00 Cr',
    owner: {
      primary: 'Parks & Urban Horticulture Authority',
      panOrId: 'GOVT-KA-PARKS',
      registrationDate: '01-Jan-2010',
      deedBook: 'Gazette 102',
      encumbrance: 'Inalienable Public Common'
    },
    polygon: [
      [-90, 20],
      [-50, 22],
      [-55, 55],
      [-95, 52],
      [-90, 20]
    ],
    geoJsonCoordinates: [
      [
        [77.59366, 12.97180],
        [77.59406, 12.97182],
        [77.59401, 12.97215],
        [77.59361, 12.97212],
        [77.59366, 12.97180]
      ]
    ],
    strataUnits: [
      { unit: 'PRK-01', floor: 'Surface', type: 'Ecological Urban Wetland & Micro-Forest', area: '1,650 sq.m', owner: 'Public Commons', status: 'Open Access' }
    ],
    restrictions: 'Strict non-development reserve, groundwater recharge aquifer protection'
  }
];

// 3D Subsurface Strata (Underground easements and utilities demonstrating 3D cadastral rights)
export const SUBSURFACE_STRATA = [
  {
    id: 'STRATA-METRO-01',
    name: 'Metro Underground Transit Tube (Line 3)',
    type: 'Subsurface Rail Easement',
    depth: -14, // 14m below surface
    radius: 3.2,
    color: '#06b6d4',
    authority: 'Bangalore Metro Rail Corporation (BMRCL)',
    strataVolume: '18,400 m³',
    legalDeed: 'Right of Way Easement Act Section 32',
    path: [
      [-110, -14, -25],
      [-50, -14, -20],
      [0, -14, 0],
      [45, -14, 25],
      [90, -14, 30]
    ]
  },
  {
    id: 'STRATA-POWER-02',
    name: 'Subterranean 220kV Cryogenic Power Conduit',
    type: 'High-Voltage Utility Corridor',
    depth: -7, // 7m below surface
    radius: 1.2,
    color: '#eab308',
    authority: 'State Electricity Transmission Corp.',
    strataVolume: '3,200 m³',
    legalDeed: 'Underground Transmission Rights Deed #441',
    path: [
      [-100, -7, 15],
      [-30, -7, 12],
      [20, -7, 10],
      [80, -7, 10]
    ]
  }
];

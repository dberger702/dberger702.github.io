/* OnlyBands catalog — all music synthesized in-house, 100% royalty-free.
   Artists, albums, tracks, tour dates, merch. */
window.CATALOG = {
  artists: [
    {
      id: "neon_tide",
      name: "Neon Tide",
      genre: "Synthwave",
      location: "Los Angeles, CA",
      monthly: 84213,
      accent: "#ff2e88",
      bio: "Neon Tide is the solo project of a night-shift synth obsessive chasing the sound of a coastline at 2am. Analog arpeggios, saturated drums, and skylines made of chrome.",
      albums: [
        { id: "coastal_static", title: "Coastal Static", year: 2025, tracks: ["neon_tide__midnight_coastline","neon_tide__chrome_dreams"] }
      ],
      tour: [
        { date: "2026-08-14", city: "Los Angeles, CA", venue: "The Echoplex", status: "tickets" },
        { date: "2026-08-22", city: "San Francisco, CA", venue: "Rickshaw Stop", status: "tickets" },
        { date: "2026-09-05", city: "Portland, OR", venue: "Doug Fir Lounge", status: "low" },
        { date: "2026-09-19", city: "Seattle, WA", venue: "Barboza", status: "soldout" }
      ],
      merch: [
        { name: "Coastal Static — Neon Vinyl", price: 32, type: "Vinyl LP" },
        { name: "Chrome Logo Tee", price: 28, type: "Apparel" },
        { name: "Midnight Enamel Pin", price: 12, type: "Accessory" }
      ]
    },
    {
      id: "sage_cedar",
      name: "Sage & Cedar",
      genre: "Lo-Fi / Acoustic",
      location: "Asheville, NC",
      monthly: 51902,
      accent: "#6b8f71",
      bio: "A duo who record to tape in a cabin and leave the rain in the mix. Warm keys, brushed drums, and songs built for slow mornings.",
      albums: [
        { id: "porch_light", title: "Porch Light", year: 2026, tracks: ["sage_cedar__rainy_window","sage_cedar__slow_morning"] }
      ],
      tour: [
        { date: "2026-08-09", city: "Asheville, NC", venue: "The Grey Eagle", status: "tickets" },
        { date: "2026-08-30", city: "Nashville, TN", venue: "The Basement", status: "tickets" },
        { date: "2026-09-12", city: "Atlanta, GA", venue: "Eddie's Attic", status: "low" }
      ],
      merch: [
        { name: "Porch Light — Cream Vinyl", price: 30, type: "Vinyl LP" },
        { name: "Hand-Screened Tote", price: 22, type: "Accessory" },
        { name: "Cabin Sessions Cassette", price: 14, type: "Cassette" }
      ]
    },
    {
      id: "aurora_fields",
      name: "Aurora Fields",
      genre: "Ambient / Cinematic",
      location: "Reykjavík, IS",
      monthly: 38477,
      accent: "#26d0a0",
      bio: "Glacial pads and patient melodies. Aurora Fields writes music for the space between thoughts — scored as if the northern sky had a pulse.",
      albums: [
        { id: "long_dawn", title: "Long Dawn", year: 2025, tracks: ["aurora_fields__northern_light","aurora_fields__glacier"] }
      ],
      tour: [
        { date: "2026-10-03", city: "Reykjavík, IS", venue: "Harpa Hall", status: "tickets" },
        { date: "2026-10-18", city: "London, UK", venue: "Union Chapel", status: "low" }
      ],
      merch: [
        { name: "Long Dawn — Clear Vinyl", price: 34, type: "Vinyl LP" },
        { name: "Field Recordings Zine", price: 18, type: "Print" }
      ]
    },
    {
      id: "glass_hours",
      name: "The Glass Hours",
      genre: "Indie Electronic",
      location: "Brooklyn, NY",
      monthly: 96540,
      accent: "#ffd166",
      bio: "Bright plucks, restless bass, and hooks that refuse to sit still. The Glass Hours make dance music for people who overthink.",
      albums: [
        { id: "paper_city", title: "Paper City", year: 2026, tracks: ["glass_hours__paper_planes","glass_hours__afterglow"] }
      ],
      tour: [
        { date: "2026-08-16", city: "Brooklyn, NY", venue: "Elsewhere Zone One", status: "tickets" },
        { date: "2026-08-29", city: "Philadelphia, PA", venue: "Johnny Brenda's", status: "tickets" },
        { date: "2026-09-14", city: "Boston, MA", venue: "The Sinclair", status: "low" },
        { date: "2026-09-27", city: "Washington, DC", venue: "Songbyrd", status: "tickets" }
      ],
      merch: [
        { name: "Paper City — Splatter Vinyl", price: 33, type: "Vinyl LP" },
        { name: "Glass Hours Windbreaker", price: 58, type: "Apparel" },
        { name: "Paper Planes Sticker Pack", price: 8, type: "Accessory" }
      ]
    },
    {
      id: "kofi_mensah",
      name: "Kofi Mensah",
      genre: "Deep House",
      location: "Accra, GH",
      monthly: 72188,
      accent: "#ff7b00",
      bio: "Sunrise-set deep house with a warm low end and endless groove. Kofi Mensah builds long, hypnotic arcs meant to be felt on a full system.",
      albums: [
        { id: "golden_hour", title: "Golden Hour", year: 2026, tracks: ["kofi_mensah__sunrise_set","kofi_mensah__deep_end"] }
      ],
      tour: [
        { date: "2026-08-23", city: "Accra, GH", venue: "+233 Jazz Bar", status: "tickets" },
        { date: "2026-09-06", city: "Berlin, DE", venue: "Watergate", status: "low" },
        { date: "2026-09-20", city: "Amsterdam, NL", venue: "Shelter", status: "tickets" }
      ],
      merch: [
        { name: "Golden Hour — Gold Vinyl", price: 35, type: "Vinyl LP" },
        { name: "Sunrise Set Dad Cap", price: 26, type: "Apparel" }
      ]
    },
    {
      id: "vela",
      name: "Vela",
      genre: "Dream Pop",
      location: "Melbourne, AU",
      monthly: 45031,
      accent: "#c8a2ff",
      bio: "Instrumental dream pop that feels like sunlight through water. Vela layers soft plucks and glass-clear leads into music that holds you still.",
      albums: [
        { id: "shorelines", title: "Shorelines", year: 2025, tracks: ["vela__held","vela__tidepool"] }
      ],
      tour: [
        { date: "2026-09-11", city: "Melbourne, AU", venue: "Northcote Social Club", status: "tickets" },
        { date: "2026-09-25", city: "Sydney, AU", venue: "Oxford Art Factory", status: "low" }
      ],
      merch: [
        { name: "Shorelines — Sea Glass Vinyl", price: 31, type: "Vinyl LP" },
        { name: "Vela Longsleeve", price: 34, type: "Apparel" }
      ]
    }
  ],

  // per-track metadata keyed by track id
  tracks: {
    "neon_tide__midnight_coastline": { title: "Midnight Coastline", dur: 74.8, price: 1.29 },
    "neon_tide__chrome_dreams":      { title: "Chrome Dreams",      dur: 66.1, price: 1.29 },
    "sage_cedar__rainy_window":      { title: "Rainy Window",       dur: 76.8, price: 0.99 },
    "sage_cedar__slow_morning":      { title: "Slow Morning",       dur: 81.0, price: 0.99 },
    "aurora_fields__northern_light": { title: "Northern Light",     dur: 71.6, price: 1.09 },
    "aurora_fields__glacier":        { title: "Glacier",            dur: 73.0, price: 1.09 },
    "glass_hours__paper_planes":     { title: "Paper Planes",       dur: 70.8, price: 1.29 },
    "glass_hours__afterglow":        { title: "Afterglow",          dur: 68.2, price: 1.29 },
    "kofi_mensah__sunrise_set":      { title: "Sunrise Set",        dur: 71.8, price: 1.19 },
    "kofi_mensah__deep_end":         { title: "Deep End",           dur: 70.7, price: 1.19 },
    "vela__held":                    { title: "Held",               dur: 71.9, price: 0.99 },
    "vela__tidepool":                { title: "Tidepool",           dur: 69.6, price: 0.99 }
  },

  /* Cost model — priced on ACTUAL AWS hosting.
     Egress: Amazon CloudFront $0.085/GB (first 10 TB/mo, US/EU) + S3 storage/
     requests ≈ $0.005/GB blended -> ~$0.09/GB delivered.
     Audio data per 3-minute song: Normal 256kbps = 5.76 MB, High 320kbps =
     7.2 MB, Lossless 1411kbps (CD) = 31.7 MB. 1 hour ≈ 20 songs. */
  costModel: {
    egressPerGB: 0.085,          // CloudFront $/GB out
    blendedPerGB: 0.09,          // + storage/requests
    processingPct: 0.029, processingFlat: 0.30,  // Stripe 2.9% + $0.30
    songMB: { normal: 5.76, high: 7.20, lossless: 31.75 },
    bitrate: { normal: 256, high: 320, lossless: 1411 }
  },

  // subscription tiers — monthly listening allowance (hours) priced on AWS cost
  tiers: [
    { id: "supporter", name: "Supporter", price: 4.99, popular: false,
      quality: "normal", dataGB: 2.5, hoursMonth: 22, hoursDay: "~45 min",
      hostingCost: 0.21, songs: { normal: 434, high: 347, lossless: null },
      perks: ["Full catalog access","Standard audio (256 kbps)","No ads, ever","Buy tracks & merch direct"] },
    { id: "listener",  name: "Listener",  price: 8.99, popular: true,
      quality: "lossless", dataGB: 12, hoursMonth: 83, hoursDay: "~2.8 hrs",
      hostingCost: 1.02, songs: { normal: 2083, high: 1667, lossless: 378 },
      perks: ["Full catalog access","Lossless Hi-Fi + High + Standard","Offline downloads","10% off all merch","No ads, ever"] },
    { id: "patron",    name: "Patron",    price: 14.99, popular: false,
      quality: "lossless", dataGB: null, hoursMonth: null, hoursDay: "Unlimited",
      hostingCost: 3.40, songs: { normal: 6944, high: 5556, lossless: 1260 },
      perks: ["Unlimited listening","Lossless Hi-Fi + High + Standard","Offline downloads","20% off all merch","Early access to tour tickets"] }
  ],

  // transparency ledger (public) — monthly, USD
  ledger: {
    month: "June 2026",
    subscribers: 41280,
    grossRevenue: 401870,       // subscriptions + store cut
    costs: [
      { label: "Cloud hosting & CDN (AWS)", amount: 18420, note: "Storage, egress, streaming edge" },
      { label: "Payment processing", amount: 11654, note: "2.9% + $0.30 per transaction" },
      { label: "Employee compensation", amount: 62500, note: "See team table — fully public" },
      { label: "Software & tooling", amount: 3110, note: "Ops, analytics, support desk" },
      { label: "Legal & compliance", amount: 4200, note: "Artist contract stewardship" }
    ],
    team: [
      { role: "Founder / Engineering", pay: 9500 },
      { role: "Platform Engineer", pay: 11000 },
      { role: "Artist Relations Lead", pay: 9000 },
      { role: "Support & Community (x2)", pay: 14000 },
      { role: "Design", pay: 9500 },
      { role: "Operations / Finance", pay: 9000 }
    ]
  }
};

/* Royalty-free photography — Unsplash (Unsplash License: free for commercial
   and non-commercial use, no permission or attribution required). Values are
   Unsplash photo IDs. Every artist and every track has a DISTINCT image (no
   duplicates). The app builds responsive URLs; if a specific Unsplash photo
   fails, it falls back to a unique Lorem Picsum photo (seeded by id, also
   Unsplash-sourced), and finally to the generated gradient artwork. */
window.CATALOG.photos = {
  // 6 distinct artist heroes
  heroes: {
    neon_tide:     "1459749411175-04bf5292ceea",
    sage_cedar:    "1493676304819-0d7a8d026dcf",
    aurora_fields: "1470071459604-3b5ec3a7fe05",
    glass_hours:   "1470225620780-dba8ba36b745",
    kofi_mensah:   "1511671782779-c97d3d27a1d4",
    vela:          "1444723121867-7a241cacace9"
  },
  // 12 distinct album/track covers — one per track, no repeats
  covers: {
    "neon_tide__midnight_coastline": "1550745165-9bc0b252726f",
    "neon_tide__chrome_dreams":      "1514525253161-7a46d19cd819",
    "sage_cedar__rainy_window":      "1483412033650-1015ddeb83d1",
    "sage_cedar__slow_morning":      "1510915361894-db8b60106cb1",
    "aurora_fields__northern_light": "1419242902214-272b3f66ee7a",
    "aurora_fields__glacier":        "1418065460487-3e41a6c84dc5",
    "glass_hours__paper_planes":     "1501386761578-eac5c94b800a",
    "glass_hours__afterglow":        "1493225457124-a3eb161ffa5f",
    "kofi_mensah__sunrise_set":      "1516280440614-37939bbacd81",
    "kofi_mensah__deep_end":         "1526478806334-5fd488fb3411",
    "vela__held":                    "1506157786151-b8491531f063",
    "vela__tidepool":                "1439405326854-014607f694d7"
  }
};

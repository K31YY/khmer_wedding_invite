export const wedding = {
  // url: 'https://sokha-maly.example.com',
  music: '/media/music.mp3',

  couple: {
    groom: {
      shortKm: 'សុឃី',        // name used in the logo lockup (2–3 syllables)
      fullKm:  'ឃឿត​ សុឃី',     // full Khmer name
      en:      'Khoeurt Sokhy',  // English name
    },
    bride: {
      shortKm: 'រ៉ាស៊ី',
      fullKm:  'នី​ រ៉ាស៊ី',
      en:      'Ny Rasy',
    },
  },

  parents: {
    groom: {
      father: { km: 'វ័ន ឃឿត',  en: 'Vorn Khoeurt' },
      mother: { km: 'ចិ​ វលក្ខណ័',    en: 'Che Voleak' },
      titleSr: { km: 'មាតាបិតាកូនកំលោះ', en: "Groom's Parents" },
    },
    bride: {
      father: { km: 'ប៉ានី',   en: 'Pa Ny' },
      mother: { km: 'ម៉ាក់ម៊ំុ',    en: 'Mak Mom' },
      titleSr: { km: 'មាតាបិតាកូនក្រមុំ', en: "Bride's Parents" },
    },
  },

  // Wedding day (Asia/Phnom_penh). Countdown + .ics + date chips read this.
  date: '2026-12-12T08:00:00+07:00', 
  endDate: '2026-12-12T21:00:00+07:00',

  lunar: {
    km: 'ត្រូវនឹងថ្ងៃអាទិត្យ ១១ កើត ខែបុស្ស ឆ្នាំមម',
    en: '11 waxing moon, Pushya (Bos), Year of the Horse',
  },

  venue: {
    name:    { km: 'មណ្ឌលមង្គល ផ្កាឈូក', en: 'Lotus Mangal Hall' },
    address: { km: 'ផ្លូវលេខ ៥៩៨ សង្កាត់ ភ្នំពេញថ្មី ខណ្ឌ សែនសុខ រាជធានីភ្នំពេញ',
               en: '598 St, Phnom Penh Thmey, Sen Sok, Phnom Penh' },
    pin: [11.6006, 104.8783],
  },

  programme: [
    { time: '06:30', km: 'ពិធីហែកូនកំលោះ',                            en: 'Groom procession',              icon: 'procession' },
    { time: '07:30', km: 'ពិធីនិមន្តព្រះសង្ឃ និងប្រគេនចង្ហាន់',            en: 'Monk chanting & alms offering', icon: 'monks' },
    { time: '09:00', km: 'ពិធីសូត្រមន្ត ប្រទានពរ និងដាក់ចិញ្ចៀន',          en: 'Blessing & ring ceremony',      icon: 'rings' },
    { time: '10:00', km: 'ពិធីសែនបុព្វការីជន និងថ្វាយបង្គំមាតាបិតា',       en: 'Ancestor tribute & parents\u2019 blessing', icon: 'ancestors' },
    { time: '11:00', km: 'ពិធីចូលរួមអាហារថ្ងៃត្រង់ជាហេតុ',               en: 'Wedding lunch',                 icon: 'lunch' },
    { time: '17:30', km: 'ពិធីជប់លៀងល្ងាច និងចម្រៀងផឹកស៊ីសប្បាយ',        en: 'Evening reception & party',     icon: 'party' },
  ],

  //  love story strip (day → dusk). SAMPLE captions.
  story: [
    { photo: 'story1', km: 'ជួបគ្នាដោយចៃដន្យ ក្នុងរដូវវស្សាមួយ ព្រិលស្រាលៗ មិនបានបាត់រូបសម្រស់ពិត',
      en: 'We met by chance one rainy season — the drizzle never faded.' },
    { photo: 'story2', km: 'ដំណើរឆ្ងាយៗ ធ្វើឱ្យបេះដូងកាន់តែជិត ក្នុងរាល់ការរង់ចាំមានតែឈ្មោះគាត់',
      en: 'Long journeys drew the heart closer; every wait wore their name.' },
    { photo: 'story3', km: 'ថ្ងៃមួយ គាត់ក្រោកពីដំណេក ព្រះអាទិត្យក៏ក្រោមតាម — សំណួរតូចមួយ ចម្លើយបាទ/បាច់',
      en: 'One morning they asked a small question. The sun rose anyway. I said yes.' },
  ],

  galleryCaptions: {},

  gifts: [
    { label: { km: 'KHQR ឈ្មោះគណនី', en: 'KHQR Account' }, holder: 'SOKHY', file: '/gift/qr-a.png' },
    { label: { km: 'ABA Pay Now', en: 'ABA Pay Now' },        holder: 'RASY',   file: '/gift/qr-b.png' },
  ],

  // Slow blessing marquee behind the countdown
  blessings: {
    km: [
      'សូមឱ្យគ្រួសារថ្មីទាំងសុខភាពល្អ និងជីវភាពរីកចម្រើន',
      'សូមឱ្យទឹកចិត្តស្រឡាញ់គ្នា យូរអង្វែងដូចព្រះច័ន្ទពេញបូណ៌មី',
      'សូមឱ្យមង្គលទាំង៣២ គង់វង្សកក្នុងគ្រួសារថ្មី',
    ],
    en: [
      'May the new family enjoy health, harmony and prosperity',
      'May your love last as long as the full moon',
      'May all thirty-two blessings dwell in this home',
    ],
  },
};

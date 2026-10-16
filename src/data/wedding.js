/* =====================================================================
   ព័ត៌មានអាពាហ៍ពិពាហ៍ទាំងអស់ស្ថិតនៅក្នុងឯកសារតែមួយនេះ។
   ⚠️ គ្រប់តម្លៃខាងក្រោមជា "ទិន្នន័យគំរូ" (SAMPLE) សម្រាប់មើលរូបរាង
   សូមជំនួសដោយព័ត៌មានពិតរបស់ប្អូន មុនចែកផ្សាយ។ កុំបង្កើតឈ្មោះ/
   កាលបរិច្ឆេទ/ម៉ោង ជំនួសប្អូនឡើយ — ប្តូរត្រឹមតែនៅទីនេះប៉ុណ្ណោះ។
   All wedding details live in this one file. Values below are SAMPLE
   placeholders to be replaced with the real couple's information.
   ===================================================================== */

export const wedding = {
  // Public URL used for link previews + share buttons (set after deploy)
  url: 'https://sokha-maly.example.com',

  // Optional: place an mp3 you have rights to in /public/media/music.mp3
  music: '/media/music.mp3',

  couple: {
    groom: {
      shortKm: 'សុខា',        // name used in the logo lockup (2–3 syllables)
      fullKm:  'ជា សុខា',     // full Khmer name
      en:      'Chea Sokha',  // English name
    },
    bride: {
      shortKm: 'ជាមាន',
      fullKm:  'ស៊ូ មលី',
      en:      'Su Maly',
    },
  },

  // Parents render as "លោក X" on one line, "និង លោកស្រី Y" on the next.
  parents: {
    groom: {
      father: { km: 'ជា សុវណ្ណ',  en: 'Chea Sovann' },
      mother: { km: 'ជា សីលា',    en: 'Chea Seila' },
      titleSr: { km: 'មាតាបិតាកូនកំលោះ', en: "Groom's Parents" },
    },
    bride: {
      father: { km: 'ស៊ូ ដារ៉ា',   en: 'Su Dara' },
      mother: { km: 'ស៊ូ ចន្ធា',    en: 'Su Chanta' },
      titleSr: { km: 'មាតាបិតាកូនក្រមុំ', en: "Bride's Parents" },
    },
  },

  // Wedding day (Asia/Phnom_penh). Countdown + .ics + date chips read this.
  date: '2026-12-12T08:00:00+07:00', // ⚠️ SAMPLE — Saturday
  endDate: '2026-12-12T21:00:00+07:00',

  // Khmer lunar date line (verify the real conversion — SAMPLE here)
  lunar: {
    km: 'ត្រូវនឹងថ្ងៃអាទិត្យ ១១ កើត ខែបុស្ស ឆ្នាំមម',
    en: '11 waxing moon, Pushya (Bos), Year of the Horse',
  },

  venue: {
    name:    { km: 'មណ្ឌលមង្គល ផ្កាឈូក', en: 'Lotus Mangal Hall' },
    address: { km: 'ផ្លូវលេខ ៥៩៨ សង្កាត់ ភ្នំពេញថ្មី ខណ្ឌ សែនសុខ រាជធានីភ្នំពេញ',
               en: '598 St, Phnom Penh Thmey, Sen Sok, Phnom Penh' },
    pin: [11.6006, 104.8783], // ⚠️ SAMPLE coordinates — replace with your Google Maps pin [lat, lng]
  },

  // កម្មវិធី — ceremony programme. Edit items / times freely.
  // icon keys: 'procession' | 'monks' | 'alms' | 'rings' | 'ancestors' | 'lunch' | 'party'
  programme: [
    { time: '06:30', km: 'ពិធីហែកូនកំលោះ',                            en: 'Groom procession',              icon: 'procession' },
    { time: '07:30', km: 'ពិធីនិមន្តព្រះសង្ឃ និងប្រគេនចង្ហាន់',            en: 'Monk chanting & alms offering', icon: 'monks' },
    { time: '09:00', km: 'ពិធីសូត្រមន្ត ប្រទានពរ និងដាក់ចិញ្ចៀន',          en: 'Blessing & ring ceremony',      icon: 'rings' },
    { time: '10:00', km: 'ពិធីសែនបុព្វការីជន និងថ្វាយបង្គំមាតាបិតា',       en: 'Ancestor tribute & parents\u2019 blessing', icon: 'ancestors' },
    { time: '11:00', km: 'ពិធីចូលរួមអាហារថ្ងៃត្រង់ជាហេតុ',               en: 'Wedding lunch',                 icon: 'lunch' },
    { time: '17:30', km: 'ពិធីជប់លៀងល្ងាច និងចម្រៀងផឹកស៊ីសប្បាយ',        en: 'Evening reception & party',     icon: 'party' },
  ],

  // រឿងរ៉ាវស្នេហ៍ — love story strip (day → dusk). SAMPLE captions.
  story: [
    { photo: 'story1', km: 'ជួបគ្នាដោយចៃដន្យ ក្នុងរដូវវស្សាមួយ ព្រិលស្រាលៗ មិនបានបាត់រូបសម្រស់ពិត',
      en: 'We met by chance one rainy season — the drizzle never faded.' },
    { photo: 'story2', km: 'ដំណើរឆ្ងាយៗ ធ្វើឱ្យបេះដូងកាន់តែជិត ក្នុងរាល់ការរង់ចាំមានតែឈ្មោះគាត់',
      en: 'Long journeys drew the heart closer; every wait wore their name.' },
    { photo: 'story3', km: 'ថ្ងៃមួយ គាត់ក្រោកពីដំណេក ព្រះអាទិត្យក៏ក្រោមតាម — សំណួរតូចមួយ ចម្លើយបាទ/បាច់',
      en: 'One morning they asked a small question. The sun rose anyway. I said yes.' },
  ],

  // Gallery is built by scripts/prepare-photos.mjs → public/img/gallery.json
  // Leave [] and the script fills it; captions optional.
  galleryCaptions: {},

  // ចំណងដៃ — gift QRs. Put images in /public/gift/ or generate samples:
  // script make-sample-qr fills these two cards if no real KHQR is supplied.
  gifts: [
    { label: { km: 'KHQR ឈ្មោះគណនី', en: 'KHQR Account' }, holder: 'SOKHA CHEA', file: '/gift/qr-a.png' },
    { label: { km: 'ABA Pay Now', en: 'ABA Pay Now' },        holder: 'MALY SU',   file: '/gift/qr-b.png' },
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

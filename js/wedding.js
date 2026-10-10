// All wedding details live here. Edit this file only to change facts.
export const WEDDING = {
  groom: { km: 'សុខ នរិន្ទ', en: 'Sok Norint', short: { km: 'នរិន្ទ', en: 'Norint' },
    father: 'សុខ ប៊ុនថាវុធ', mother: 'លឹម ពៅ' },
  bride: { km: 'ទូច សុធីតា', en: 'Touch Sothida', short: { km: 'សុធីតា', en: 'Sothida' },
    father: 'ទូច វណ្ណា', mother: 'ទេព ចាន់ស៊ីណារី' },
  date: { y: 2026, m: 12, d: 7, weekdayKm: 'ចន្ទ', weekdayEn: 'Monday' },
  lunarKm: 'ត្រូវនឹងថ្ងៃ១៣រោច ខែកត្តិក ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០',
  lunarEn: null, // not provided: the English page simply omits the lunar line
  tz: '+07:00',
  programme: [
    { t: '06:30', km: 'ពិធីសូត្រមន្ត', en: 'Chanting Ceremony', icon: 'chant' },
    { t: '07:30', km: 'ពិធីហែជំនូន', en: 'Dowry Procession', icon: 'tray' },
    { t: '09:00', km: 'ពិធីបំពាក់ចិញ្ជៀន', en: 'Ring Ceremony', icon: 'ring' },
    { t: '10:00', km: 'ពិធីកាត់សក់បង្កក់សិរី', en: 'Hair-Cutting Ceremony', icon: 'scissors' },
    { t: '11:00', km: 'ពិធីសំពះផ្ទឹមចងដៃ និងបង្វិលពពិល', en: 'Bonding, Hand-Tying & Candle Circling', icon: 'knot' },
    { t: '17:00', km: 'ពិធីជប់លៀង', en: 'Wedding Banquet', icon: 'cheers' },
  ],
  venue: { km: 'The Premier Centre Sen Sok, Building H', en: 'The Premier Centre Sen Sok, Building H', lat: 11.60054, lng: 104.88305 },
  // Calendar file: ASSUMPTION - end time was not given. Change here if needed.
  calendar: { start: '06:30', end: '21:00' },
  photos: {
    envelopeBg: 'p15', cover: 'p05', coverWide: 'p19', invite: 'p07', groom: 'p10', bride: 'p11', candle: 'p17', thanks: 'p03',
  },
  qr: [{ src: 'assets/img/gift-qr.png', label: 'ABA KHQR' }],
  music: 'assets/music.mp3',
  siteUrl: '', // set after deploy; used for share buttons (falls back to the current page address)
};

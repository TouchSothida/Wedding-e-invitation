// All text, Khmer first. Parents-name lines are built in sections.js from wedding.js.
export const KM_DIGITS = '០១២៣៤៥៦៧៨៩';
export const num = (n, lang) => lang === 'km' ? String(n).replace(/\d/g, d => KM_DIGITS[d]) : String(n);
export const MONTHS_KM = ['', 'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
export const MONTHS_EN = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function fmtTime(t, lang) {
  let [h, m] = t.split(':').map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  if (lang === 'km') {
    const p = h < 12 ? 'ព្រឹក' : h < 16 ? 'រសៀល' : 'ល្ងាច';
    return `${num(h12, 'km')}:${num(String(m).padStart(2, '0'), 'km')} ${p}`;
  }
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}
export const T = {
  km: {
    envTitle: 'សិរីសួស្តីអាពាហ៍ពិពាហ៍', envSub: 'The Wedding Invitation', tap: 'ចុចត្រាបិទ ដើម្បីបើក',
    blessing: 'សិរីសួស្តីអាពាហ៍ពិពាហ៍', honour: 'សូមគោរពអញ្ជើញ',
    dDay: 'ថ្ងៃ', dDate: 'ទី', dMonth: 'ខែ', dYear: 'ឆ្នាំ', scroll: 'ទាញចុះក្រោម',
    inviteHead: 'សិរីសួស្តីអាពាហ៍ពិពាហ៍',
    inviteBody: 'យើងខ្ញុំមានកិត្តិយសសូមគោរពអញ្ជើញ ឯកឧត្តម <span class="nw">លោកជំទាវ</span> លោក លោកស្រី <span class="nw">អ្នកនាង</span> កញ្ញា អញ្ជើញចូលរួមជាអធិបតី និងជាសាក្សីនៃមង្គលការ របស់<span class="dnw"><span class="nw">កូនប្រុស</span> <span class="nw">កូនស្រី</span></span>របស់យើងខ្ញុំ ដើម្បី<span class="nw">ប្រសិទ្ធពរជ័យសិរីមង្គល។</span>',
    groomParents: 'មាតាបិតាកូនកំលោះ', brideParents: 'មាតាបិតាកូនក្រមុំ', mr: 'លោក', mrs: 'លោកស្រី',
    coupleHead: 'កូនកំលោះ និង កូនក្រមុំ', groomRole: 'កូនកំលោះ', brideRole: 'កូនក្រមុំ',
    sonOf: 'ជាកូនប្រុសរបស់', daughterOf: 'ជាកូនស្រីរបស់', and: 'និង',
    countHead: 'រាប់ថយក្រោយ', cdD: 'ថ្ងៃ', cdH: 'ម៉ោង', cdM: 'នាទី', cdS: 'វិនាទី', cdDone: 'ថ្ងៃមង្គលការមកដល់ហើយ',
    marquee: 'សូមឲ្យមានក្តីសុខ ក្តីស្រលាញ់ និងពរជ័យជានិច្ចកាល',
    progHead: 'កម្មវិធី',
    candleHead: 'ពន្លឺទៀន', candleHint: 'ប៉ះលើទឹក ដើម្បីបង្កើតរលក និងអណ្តែតគោមផ្កាឈូក',
    galHead: 'អាល់ប៊ុមរូបភាព', close: 'បិទ',
    venueHead: 'ទីកន្លែង', openMaps: 'បើក Google Maps', saveCal: 'រក្សាទុកក្នុងប្រតិទិន',
    apologyHead: '<span class="nw">សេចក្តីថ្លែងអំណរគុណ</span> <span class="nw">និងសូមអភ័យទោស</span>', apologyBody: 'យើងខ្ញុំ សូមគោរពថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះវត្តមានដ៏ឧត្តុង្គឧត្តមរបស់ <span class="nw">សម្តេច</span> <span class="nw">ឯកឧត្តម</span> <span class="nw">លោកជំទាវ</span> <span class="nw">លោកអ្នកឧកញ្ញា</span> <span class="nw">អ្នកឧកញ្ញា</span> <span class="nw">ឧកញ្ញា</span> <span class="nw">លោក</span> <span class="nw">លោកស្រី</span> <span class="nw">អ្នកនាង</span> <span class="nw">កញ្ញា</span> ក្នុងសិរីមង្គលអាពាហ៍ពិពាហ៍ <span class="nw">កូនប្រុស</span> <span class="nw">កូនស្រី</span> របស់យើងខ្ញុំនាពេលខាងមុខនេះ។ យើងខ្ញុំសុំការខន្តីអភ័យទោសផងដែរ ករណីដែលយើងខ្ញុំពុំបានជូនលិខិតអញ្ជើញនេះដោយផ្ទាល់ ឬចំពោះកំហុសអក្ខរាវិរុទ្ធក្នុងការសរសេរឈ្មោះ។ សូមមេត្តាទទួលនូវសេចក្តីគោរពដ៏ខ្ពង់ខ្ពស់ពីយើងខ្ញុំ។',
    giftHead: 'ចំណងដៃ', giftSub: 'សូមអរគុណចំពោះក្តីស្រលាញ់របស់លោកអ្នក', saveQr: 'រក្សាទុក QR',
    thanks: 'សូមអរគុណ', shareTg: 'ផ្ញើតាម Telegram', shareMs: 'ផ្ញើតាម Messenger', shareFb: 'ផ្ញើតាម Facebook', copyLink: 'ចម្លងតំណភ្ជាប់', copied: 'បានចម្លងហើយ',
    music: 'តន្ត្រី', lang: 'EN',
    ogTitle: 'សិរីសួស្តីអាពាហ៍ពិពាហ៍ នរិន្ទ & សុធីតា',
  },
  en: {
    envTitle: 'សិរីសួស្តីអាពាហ៍ពិពាហ៍', envSub: 'The Wedding Invitation', tap: 'Tap the seal to open',
    blessing: 'សិរីសួស្តីអាពាហ៍ពិពាហ៍', honour: 'You are warmly invited',
    dDay: 'Day', dDate: 'Date', dMonth: 'Month', dYear: 'Year', scroll: 'Scroll',
    inviteHead: 'The Wedding Invitation',
    inviteBody: 'With great honour and joy, we invite you to join us as a guest of honour and witness to the wedding of our son and daughter, and to share in the blessings of this happy occasion.',
    groomParents: "Groom's Parents", brideParents: "Bride's Parents", mr: 'Mr.', mrs: 'Mrs.',
    coupleHead: 'The Couple', groomRole: 'The Groom', brideRole: 'The Bride',
    sonOf: 'Son of', daughterOf: 'Daughter of', and: 'and',
    countHead: 'Counting Down', cdD: 'Days', cdH: 'Hours', cdM: 'Minutes', cdS: 'Seconds', cdDone: 'The big day is here',
    marquee: 'May happiness, love and blessings be with you always',
    progHead: 'Programme',
    candleHead: 'Candlelight', candleHint: 'Touch the water to make ripples and float a lotus lantern',
    galHead: 'Gallery', close: 'Close',
    venueHead: 'Venue', openMaps: 'Open Google Maps', saveCal: 'Save to Calendar',
    apologyHead: 'Gratitude &amp; Apology', apologyBody: 'We offer our deepest and most respectful thanks for the esteemed presence of every guest of honour who joins us at the wedding of our son and daughter. We humbly ask your forgiveness if we were unable to deliver this invitation to you in person, or for any mistake in the spelling of your name. Please accept our highest respect and heartfelt gratitude.',
    giftHead: 'Wedding Gift', giftSub: 'Thank you for your love and kindness', saveQr: 'Save QR',
    thanks: 'Thank You', shareTg: 'Send via Telegram', shareMs: 'Send via Messenger', shareFb: 'Share on Facebook', copyLink: 'Copy link', copied: 'Copied',
    music: 'Music', lang: 'ខ្មែរ',
    ogTitle: 'Norint & Sothida · Wedding Invitation',
  },
};

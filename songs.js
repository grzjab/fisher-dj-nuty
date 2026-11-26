// Domyślny układ 8 klawiszy Fisher-Price DJ (skala C-dur: C4 -> C5)
// Użytkownik może w każdej chwili zmienić kolor i kształt dowolnego klawisza w Ustawieniach!

export const SHAPES = {
  circle: {
    id: 'circle',
    name: 'Koło',
    svg: '<circle cx="24" cy="24" r="15" fill="currentColor" />'
  },
  square: {
    id: 'square',
    name: 'Kwadrat',
    svg: '<rect x="10" y="10" width="28" height="28" rx="5" fill="currentColor" />'
  },
  triangle: {
    id: 'triangle',
    name: 'Trójkąt',
    svg: '<path d="M24 8 L40 37 Q41 39 38.5 39 L9.5 39 Q7 39 8 37 Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />'
  },
  star: {
    id: 'star',
    name: 'Gwiazdka',
    svg: '<path d="M24 7 L28.9 17.2 L40.1 18.7 L31.9 26.6 L33.9 37.8 L24 32.4 L14.1 37.8 L16.1 26.6 L7.9 18.7 L19.1 17.2 Z" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />'
  },
  heart: {
    id: 'heart',
    name: 'Serce',
    svg: '<path d="M24 39 C24 39 8 28.5 8 17.5 C8 12.2 12.2 8.5 17 8.5 C20.1 8.5 22.7 10.2 24 12.6 C25.3 10.2 27.9 8.5 31 8.5 C35.8 8.5 40 12.2 40 17.5 C40 28.5 24 39 24 39 Z" fill="currentColor" />'
  },
  diamond: {
    id: 'diamond',
    name: 'Romb',
    svg: '<path d="M24 7 L40 24 L24 41 L8 24 Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />'
  },
  pentagon: {
    id: 'pentagon',
    name: 'Pięciokąt',
    svg: '<path d="M24 7 L40 18.8 L33.9 38 L14.1 38 L8 18.8 Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />'
  },
  flower: {
    id: 'flower',
    name: 'Kwiatek',
    svg: '<path d="M24 14 A6.5 6.5 0 1 1 32.5 20 A6.5 6.5 0 1 1 29.5 30 A6.5 6.5 0 1 1 18.5 30 A6.5 6.5 0 1 1 15.5 20 A6.5 6.5 0 1 1 24 14 Z" fill="currentColor" />'
  },
  hexagon: {
    id: 'hexagon',
    name: 'Sześciokąt',
    svg: '<path d="M24 7 L38.7 15.5 L38.7 32.5 L24 41 L9.3 32.5 L9.3 15.5 Z" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />'
  },
  oval: {
    id: 'oval',
    name: 'Owal',
    svg: '<ellipse cx="24" cy="24" rx="11.5" ry="16.5" fill="currentColor" />'
  },
  note: {
    id: 'note',
    name: 'Nutka',
    svg: '<path d="M19 34 A5.5 4.5 0 1 1 19 25 A5.5 4.5 0 0 1 23 26.5 V11 L36 8.5 V28.5 A5.5 4.5 0 1 1 32 24.5 V15.5 L25 17 V32.5 A5.5 4.5 0 0 1 19 34 Z" fill="currentColor" />'
  },
  bolt: {
    id: 'bolt',
    name: 'Błyskawica',
    svg: '<path d="M27 6 L12 26 H23 L20 42 L36 21 H25 Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />'
  }
};

export const COLOR_PALETTE = [
  { id: 'red', name: 'Czerwony', hex: '#EF3B39', darkHex: '#B91C1C', text: '#FFFFFF' },
  { id: 'orange', name: 'Pomarańczowy', hex: '#FF8416', darkHex: '#C25100', text: '#FFFFFF' },
  { id: 'yellow', name: 'Żółty', hex: '#FFD11A', darkHex: '#B78900', text: '#1F2937' },
  { id: 'lime', name: 'Jasnozielony', hex: '#7ED321', darkHex: '#4B8B0B', text: '#1F2937' },
  { id: 'green', name: 'Zielony', hex: '#18B759', darkHex: '#0D7A38', text: '#FFFFFF' },
  { id: 'teal', name: 'Turkusowy', hex: '#00C2CB', darkHex: '#00828A', text: '#FFFFFF' },
  { id: 'sky', name: 'Błękitny', hex: '#2296F3', darkHex: '#0E62A8', text: '#FFFFFF' },
  { id: 'blue', name: 'Niebieski', hex: '#3D5AFE', darkHex: '#1E36B8', text: '#FFFFFF' },
  { id: 'purple', name: 'Fioletowy', hex: '#8E44EC', darkHex: '#5C1FA8', text: '#FFFFFF' },
  { id: 'pink', name: 'Różowy', hex: '#FF4791', darkHex: '#B81D5B', text: '#FFFFFF' },
  { id: 'white', name: 'Biały', hex: '#F3F4F6', darkHex: '#9CA3AF', text: '#1F2937' }
];

export const DEFAULT_KEYS = [
  { keyNum: 1, note: 'C', solfege: 'Do', freq: 261.63, colorId: 'red', shapeId: 'circle' },
  { keyNum: 2, note: 'D', solfege: 'Re', freq: 293.66, colorId: 'orange', shapeId: 'square' },
  { keyNum: 3, note: 'E', solfege: 'Mi', freq: 329.63, colorId: 'yellow', shapeId: 'triangle' },
  { keyNum: 4, note: 'F', solfege: 'Fa', freq: 349.23, colorId: 'green', shapeId: 'star' },
  { keyNum: 5, note: 'G', solfege: 'Sol', freq: 392.00, colorId: 'teal', shapeId: 'heart' },
  { keyNum: 6, note: 'A', solfege: 'La', freq: 440.00, colorId: 'blue', shapeId: 'diamond' },
  { keyNum: 7, note: 'H', solfege: 'Si', freq: 493.88, colorId: 'purple', shapeId: 'pentagon' },
  { keyNum: 8, note: 'C2', solfege: 'Do higher', freq: 523.25, colorId: 'pink', shapeId: 'flower' }
];

// Baza 12 znanych polskich utworów w czystej skali C-dur (klawisze 1..8)
// Każda linia to tablica obiektów: [numerKlawisza (1-8), czasTrwania (w ćwierćnutach), "sylaba"]
export const BUILTIN_SONGS = [
  {
    id: 'wlazl-kotek',
    title: 'Wlazł kotek na płotek',
    subtitle: 'Najpopularniejsza polska kołysanka',
    emoji: '🐱',
    category: 'Dziecięce',
    difficulty: 'Łatwy',
    bpm: 112,
    lines: [
      [[5, 1, 'Wlazł'], [3, 1, 'ko-'], [3, 1, 'tek'], [4, 1, 'na'], [2, 1, 'pło-'], [2, 1, 'tek'], [1, 0.5, 'i'], [3, 0.5, 'mru-'], [5, 2, 'ga,']],
      [[5, 1, 'ła-'], [3, 1, 'dna'], [3, 1, 'to'], [4, 1, 'pio-'], [2, 1, 'sen-'], [2, 1, 'ka,'], [1, 0.5, 'nie-'], [3, 0.5, 'dłu-'], [1, 2, 'ga.']],
      [[1, 1, 'Nie-'], [3, 1, 'dłu-'], [5, 1, 'ga,'], [4, 1, 'nie-'], [2, 1, 'krót-'], [2, 1, 'ka,'], [1, 0.5, 'lecz'], [3, 0.5, 'w sam'], [5, 2, 'raz,']],
      [[5, 1, 'za-'], [3, 1, 'śpie-'], [3, 1, 'waj'], [4, 1, 'ko-'], [2, 1, 'tecz-'], [2, 1, 'ku'], [1, 0.5, 'jesz-'], [3, 0.5, 'cze'], [1, 2, 'raz!']]
    ]
  },
  {
    id: 'panie-janie',
    title: 'Panie Janie',
    subtitle: 'Poranny kanon na 6 klawiszy',
    emoji: '🔔',
    category: 'Dziecięce',
    difficulty: 'Łatwy',
    bpm: 108,
    lines: [
      [[1, 1, 'Pa-'], [2, 1, 'nie'], [3, 1, 'Ja-'], [1, 1, 'nie!'], [1, 1, 'Pa-'], [2, 1, 'nie'], [3, 1, 'Ja-'], [1, 1, 'nie!']],
      [[3, 1, 'Ra-'], [4, 1, 'no'], [5, 2, 'wstań!'], [3, 1, 'Ra-'], [4, 1, 'no'], [5, 2, 'wstań!']],
      [[5, 0.5, 'Wszyst-'], [6, 0.5, 'kie'], [5, 0.5, 'dzwo-'], [4, 0.5, 'ny'], [3, 1, 'bi-'], [1, 1, 'ją,'], [5, 0.5, 'wszyst-'], [6, 0.5, 'kie'], [5, 0.5, 'dzwo-'], [4, 0.5, 'ny'], [3, 1, 'bi-'], [1, 1, 'ją:']],
      [[1, 1, 'Bim,'], [5, 1, 'bam,'], [1, 2, 'bom!'], [1, 1, 'Bim,'], [5, 1, 'bam,'], [1, 2, 'bom!']]
    ]
  },
  {
    id: 'kurki-trzy',
    title: 'Wyszły w pole kurki trzy',
    subtitle: 'Skoczna melodia (Twinkle Twinkle)',
    emoji: '🐥',
    category: 'Dziecięce',
    difficulty: 'Łatwy',
    bpm: 106,
    lines: [
      [[1, 1, 'Wy-'], [1, 1, 'szły'], [5, 1, 'w po-'], [5, 1, 'le'], [6, 1, 'kur-'], [6, 1, 'ki'], [5, 2, 'trzy']],
      [[4, 1, 'i'], [4, 1, 'gę-'], [3, 1, 'sie-'], [3, 1, 'go'], [2, 1, 'so-'], [2, 1, 'bie'], [1, 2, 'szły.']],
      [[5, 1, 'Pierw-'], [5, 1, 'sza'], [4, 1, 'przo-'], [4, 1, 'dem,'], [3, 1, 'w środ-'], [3, 1, 'ku'], [2, 1, 'dru-'], [2, 1, 'ga,']],
      [[5, 1, 'trze-'], [5, 1, 'cia'], [4, 1, 'z ty-'], [4, 1, 'łu'], [3, 1, 'ocz-'], [3, 1, 'kiem'], [2, 1, 'mru-'], [2, 1, 'ga.']],
      [[1, 1, 'I'], [1, 1, 'tak'], [5, 1, 'so-'], [5, 1, 'bie'], [6, 1, 'kur-'], [6, 1, 'ki'], [5, 2, 'trzy']],
      [[4, 1, 'raz'], [4, 1, 'dwa!'], [3, 1, 'raz'], [3, 1, 'dwa!'], [2, 1, 'w po-'], [2, 1, 'le'], [1, 2, 'szły!']]
    ]
  },
  {
    id: 'jada-misie',
    title: 'Jadą, jadą misie',
    subtitle: 'Wesoła przejażdżka na 5 klawiszach',
    emoji: '🐻',
    category: 'Dziecięce',
    difficulty: 'Łatwy',
    bpm: 116,
    lines: [
      [[1, 0.75, 'Ja-'], [1, 0.75, 'dą,'], [2, 0.75, 'ja-'], [2, 0.75, 'dą'], [3, 1, 'mi-'], [3, 1, 'sie,'], [4, 0.5, 'tra'], [4, 0.5, 'la'], [3, 0.5, 'la'], [2, 0.5, 'la'], [5, 2, 'la,']],
      [[5, 0.75, 'śmie-'], [5, 0.75, 'ją'], [4, 0.75, 'im'], [4, 0.75, 'się'], [3, 1, 'py-'], [3, 1, 'sie,'], [2, 0.5, 'cha'], [2, 0.5, 'cha'], [3, 0.5, 'cha'], [2, 0.5, 'cha'], [1, 2, 'cha!']],
      [[1, 0.75, 'Przy-'], [1, 0.75, 'je-'], [2, 0.75, 'cha-'], [2, 0.75, 'ły'], [3, 0.75, 'do'], [3, 0.75, 'la-'], [3, 1, 'su,'], [4, 0.5, 'na-'], [4, 0.5, 'ro-'], [3, 0.5, 'bi-'], [2, 0.5, 'ły'], [5, 1, 'ha-'], [5, 0.75, 'ła-'], [5, 1.25, 'su,']],
      [[5, 0.75, 'przy-'], [5, 0.75, 'je-'], [4, 0.75, 'cha-'], [4, 0.75, 'ły'], [3, 0.75, 'do'], [3, 0.75, 'bo-'], [3, 1, 'ru,'], [2, 0.5, 'na-'], [2, 0.5, 'ro-'], [3, 0.5, 'bi-'], [2, 0.5, 'ły'], [1, 1, 'ru-'], [1, 0.75, 'mo-'], [1, 1.25, 'ru!']]
    ]
  },
  {
    id: 'stary-niedzwiedz',
    title: 'Stary niedźwiedź mocno śpi',
    subtitle: 'Zabawa przedszkolna z finałem',
    emoji: '💤',
    category: 'Dziecięce',
    difficulty: 'Łatwy',
    bpm: 108,
    lines: [
      [[1, 1, 'Sta-'], [2, 1, 'ry'], [3, 1.5, 'niedź-'], [3, 1.5, 'wiedź'], [5, 1.5, 'moc-'], [3, 1.5, 'no'], [1, 2, 'śpi,']],
      [[1, 1, 'sta-'], [2, 1, 'ry'], [3, 1.5, 'niedź-'], [3, 1.5, 'wiedź'], [5, 1.5, 'moc-'], [3, 1.5, 'no'], [1, 2, 'śpi.']],
      [[3, 1, 'My'], [4, 1, 'się'], [5, 1.5, 'go'], [5, 1, 'bo-'], [6, 1, 'i-'], [5, 2, 'my,']],
      [[4, 1, 'na'], [4, 1, 'pal-'], [3, 1.5, 'cach'], [2, 1, 'cho-'], [2, 1, 'dzi-'], [1, 2, 'my,']],
      [[1, 1, 'jak'], [2, 1, 'się'], [3, 1.5, 'zbu-'], [3, 1.5, 'dzi'], [5, 1.5, 'to'], [3, 1.5, 'nas'], [1, 2.5, 'zje!']]
    ]
  },
  {
    id: 'kolko-graniaste',
    title: 'Kółko graniaste',
    subtitle: 'Prosta zabawa w kółeczku (5 klawiszy)',
    emoji: '⭕',
    category: 'Dziecięce',
    difficulty: 'Łatwy',
    bpm: 114,
    lines: [
      [[5, 1, 'Kół-'], [3, 1, 'ko'], [5, 1, 'gra-'], [3, 1, 'nia-'], [5, 2, 'ste,']],
      [[5, 1, 'czwo-'], [3, 1, 'ro-'], [5, 1, 'kan-'], [3, 1, 'cia-'], [5, 2, 'ste,']],
      [[5, 0.75, 'kół-'], [5, 0.75, 'ko'], [4, 0.75, 'nam'], [4, 0.75, 'się'], [3, 0.75, 'po-'], [3, 0.75, 'ła-'], [2, 1, 'ma-'], [2, 1, 'ło,']],
      [[5, 0.75, 'czte-'], [5, 0.75, 'ry'], [4, 0.75, 'gro-'], [4, 0.75, 'sze'], [3, 0.75, 'kosz-'], [3, 0.75, 'to-'], [2, 1, 'wa-'], [2, 1, 'ło,']],
      [[5, 1, 'a'], [4, 1, 'my'], [3, 1, 'wszys-'], [2, 1, 'cy'], [1, 2.5, 'bęc!']]
    ]
  },
  {
    id: 'sto-lat',
    title: 'Sto lat!',
    subtitle: 'Urodzinowy klasyk na wszystkie 8 klawiszy',
    emoji: '🎂',
    category: 'Tradycyjne',
    difficulty: 'Średni',
    bpm: 118,
    lines: [
      [[5, 1.5, 'Sto'], [3, 1.5, 'lat,'], [5, 1.5, 'sto'], [3, 1.5, 'lat,']],
      [[5, 1, 'niech'], [6, 0.5, 'ży-'], [5, 0.5, 'je,'], [4, 1, 'ży-'], [3, 1, 'je'], [2, 2.5, 'nam!']],
      [[4, 1.5, 'Sto'], [2, 1.5, 'lat,'], [4, 1.5, 'sto'], [2, 1.5, 'lat,']],
      [[4, 1, 'niech'], [5, 0.5, 'ży-'], [4, 0.5, 'je,'], [3, 1, 'ży-'], [2, 1, 'je'], [3, 2.5, 'nam!']],
      [[5, 1, 'Jesz-'], [5, 0.5, 'cze'], [3, 1.5, 'raz,'], [5, 1, 'jesz-'], [5, 0.5, 'cze'], [3, 1.5, 'raz,']],
      [[5, 1, 'niech'], [8, 1, 'ży-'], [7, 1, 'je,'], [6, 1, 'ży-'], [5, 1, 'je'], [6, 2, 'nam!']],
      [[7, 1.5, 'Niech'], [7, 1, 'ży-'], [7, 1, 'je'], [8, 3, 'nam!']]
    ]
  },
  {
    id: 'mam-chusteczke',
    title: 'Mam chusteczkę haftowaną',
    subtitle: 'Płynna melodia przedszkolna',
    emoji: '🧣',
    category: 'Dziecięce',
    difficulty: 'Średni',
    bpm: 110,
    lines: [
      [[3, 0.75, 'Mam'], [5, 0.75, 'chus-'], [5, 0.75, 'tecz-'], [5, 0.75, 'kę'], [3, 0.75, 'haf-'], [5, 0.75, 'to-'], [5, 0.75, 'wa-'], [5, 0.75, 'ną,']],
      [[6, 0.75, 'co'], [5, 0.75, 'ma'], [4, 0.75, 'czte-'], [3, 0.75, 'ry'], [4, 1.5, 'ro-'], [2, 1.5, 'gi,']],
      [[2, 0.75, 'ko-'], [4, 0.75, 'go'], [4, 0.75, 'ko-'], [4, 0.75, 'cham,'], [2, 0.75, 'ko-'], [4, 0.75, 'go'], [4, 0.75, 'lu-'], [4, 0.75, 'bię,']],
      [[5, 0.75, 'rzu-'], [4, 0.75, 'cę'], [3, 0.75, 'mu'], [2, 0.75, 'pod'], [3, 1.5, 'no-'], [1, 1.5, 'gi.']]
    ]
  },
  {
    id: 'zabka-mala',
    title: 'Była sobie żabka mała',
    subtitle: 'Re-re kum-kum na pełnej oktawie',
    emoji: '🐸',
    category: 'Dziecięce',
    difficulty: 'Średni',
    bpm: 112,
    lines: [
      [[1, 0.75, 'By-'], [1, 0.75, 'ła'], [1, 0.75, 'so-'], [3, 0.75, 'bie'], [5, 0.75, 'żab-'], [5, 0.75, 'ka'], [5, 0.75, 'ma-'], [3, 0.75, 'ła,']],
      [[2, 0.75, 're'], [2, 0.75, 're'], [4, 0.75, 'kum'], [4, 0.75, 'kum,'], [3, 0.75, 're'], [3, 0.75, 're'], [5, 0.75, 'kum'], [5, 0.75, 'kum,']],
      [[1, 0.75, 'któ-'], [1, 0.75, 'ra'], [1, 0.75, 'ma-'], [3, 0.75, 'my'], [5, 0.75, 'nie'], [5, 0.75, 'słu-'], [5, 0.75, 'cha-'], [3, 0.75, 'ła,']],
      [[5, 0.75, 're'], [4, 0.75, 're'], [3, 0.75, 'kum'], [2, 0.75, 'kum'], [1, 2, 'bęc!']],
      [[6, 0.75, 'Na'], [6, 0.75, 'spa-'], [6, 0.75, 'ce-'], [8, 0.75, 'ry'], [5, 0.75, 'wy-'], [5, 0.75, 'cho-'], [5, 0.75, 'dzi-'], [3, 0.75, 'ła,']],
      [[2, 0.75, 'in-'], [2, 0.75, 'nym'], [4, 0.75, 'żab-'], [4, 0.75, 'kom'], [3, 0.75, 'się'], [3, 0.75, 'dzi-'], [5, 0.75, 'wi-'], [5, 0.75, 'ła,']],
      [[5, 0.75, 're'], [4, 0.75, 're'], [3, 0.75, 'kum'], [2, 0.75, 'kum'], [1, 2, 'bęc!']]
    ]
  },
  {
    id: 'miala-baba-koguta',
    title: 'Miała baba koguta',
    subtitle: 'Tradycyjna przyśpiewka ludowa',
    emoji: '🐓',
    category: 'Tradycyjne',
    difficulty: 'Łatwy',
    bpm: 120,
    lines: [
      [[1, 0.75, 'Mia-'], [2, 0.75, 'ła'], [3, 0.75, 'ba-'], [4, 0.75, 'ba'], [5, 1.5, 'ko-'], [5, 1.5, 'gu-ta,']],
      [[6, 0.75, 'ko-'], [6, 0.75, 'gu-'], [6, 0.75, 'ta,'], [6, 0.75, 'ko-'], [5, 2, 'gu-ta,']],
      [[4, 0.75, 'wsa-'], [4, 0.75, 'dzi-'], [4, 0.75, 'ła'], [4, 0.75, 'go'], [3, 1.5, 'do'], [3, 1.5, 'bu-ta,']],
      [[2, 0.75, 'do'], [2, 0.75, 'bu-'], [5, 0.75, 'ta,'], [5, 0.75, 'o'], [1, 2, 'jej!']]
    ]
  },
  {
    id: 'pojedziemy-na-low',
    title: 'Pojedziemy na łów',
    subtitle: 'Rytmiczna polska pieśń tradycyjna',
    emoji: '📯',
    category: 'Tradycyjne',
    difficulty: 'Łatwy',
    bpm: 116,
    lines: [
      [[1, 0.75, 'Po-'], [2, 0.75, 'je-'], [3, 0.75, 'dzie-'], [4, 0.75, 'my'], [5, 1, 'na'], [3, 1, 'łów,'], [5, 1, 'na'], [3, 1, 'łów,']],
      [[3, 0.75, 'to-'], [3, 0.75, 'wa-'], [2, 0.75, 'rzy-'], [2, 0.75, 'szu'], [1, 2, 'mój!']],
      [[3, 0.75, 'Na'], [3, 0.75, 'łów,'], [2, 0.75, 'na'], [2, 0.75, 'łów,'], [3, 0.75, 'na'], [3, 0.75, 'ło-'], [4, 1.5, 'wy,']],
      [[3, 0.75, 'do'], [3, 0.75, 'zie-'], [2, 0.75, 'lo-'], [2, 0.75, 'nej'], [3, 0.75, 'dą-'], [3, 0.75, 'bro-'], [4, 1.5, 'wy,']],
      [[3, 0.75, 'to-'], [3, 0.75, 'wa-'], [2, 0.75, 'rzy-'], [2, 0.75, 'szu'], [1, 2, 'mój!']]
    ]
  },
  {
    id: 'tancowaly-dwa-michaly',
    title: 'Tańcowały dwa Michały',
    subtitle: 'Skoczny wiersz Juliana Tuwima',
    emoji: '🕺',
    category: 'Dziecięce',
    difficulty: 'Średni',
    bpm: 115,
    lines: [
      [[2, 0.75, 'Tań-'], [2, 0.75, 'co-'], [3, 0.75, 'wa-'], [4, 0.75, 'ły'], [5, 0.75, 'dwa'], [5, 0.75, 'Mi-'], [4, 0.75, 'cha-'], [3, 0.75, 'ły,']],
      [[2, 0.75, 'je-'], [3, 0.75, 'den'], [4, 0.75, 'du-'], [5, 0.75, 'ży,'], [6, 0.75, 'dru-'], [5, 0.75, 'gi'], [4, 0.75, 'ma-'], [3, 0.75, 'ły,']],
      [[2, 0.75, 'jak'], [2, 0.75, 'ten'], [3, 0.75, 'du-'], [4, 0.75, 'ży'], [5, 0.75, 'za-'], [6, 0.75, 'czął'], [4, 0.75, 'krą-'], [3, 0.75, 'żyć,']],
      [[2, 0.75, 'to'], [4, 0.75, 'ten'], [3, 0.75, 'ma-'], [2, 0.75, 'ły'], [5, 0.75, 'nie'], [4, 0.75, 'mógł'], [2, 0.75, 'zdą-'], [1, 1.5, 'żyć!']]
    ]
  }
];

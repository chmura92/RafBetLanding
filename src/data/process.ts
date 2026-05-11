export interface ProcessStep {
  num: string;
  meta: string;
  duration: string;
  title: string;
  desc: string;
  details: { label: string; value: string }[];
  active?: boolean;
}

export const processSteps: ProcessStep[] = [
  {
    num: '01',
    meta: 'Krok pierwszy',
    duration: '5 minut',
    title: 'Zadzwoń lub napisz',
    desc: 'Zostaw numer w formularzu albo zadzwoń bezpośrednio. Mówisz co budujesz, gdzie, ile metrów. My słuchamy i zadajemy konkretne pytania.',
    details: [
      { label: 'Koszt', value: '0 zł' },
      { label: 'Czas', value: '5 minut' },
    ],
  },
  {
    num: '02',
    meta: 'Krok drugi',
    duration: 'w 24h',
    title: 'Otrzymujesz wycenę',
    desc: 'W ciągu doby dostajesz wycenę z rozpisaną ceną za m² i terminem. Bez zobowiązań. Decydujesz w swoim tempie, porównujesz, pytasz dalej.',
    details: [
      { label: 'Koszt', value: '0 zł' },
      { label: 'Czas', value: 'do 24h' },
      { label: 'Zobowiązanie', value: 'brak' },
    ],
  },
  {
    num: '03',
    meta: 'Krok trzeci',
    duration: '1 dzień (dom)',
    title: 'Wylewamy posadzkę',
    desc: 'Mixokret zostaje na ulicy, w środku tylko czysty wąż i 4-osobowa ekipa. Najpierw hydroizolacja, termoizolacja, dylatacje. Potem wylewka półsucha i od razu zatarcie maszynowe.',
    details: [
      { label: 'Sprzęt', value: 'Mixokret Brinkmann' },
      { label: 'Ekipa', value: '4-6 osób' },
      { label: 'Czas', value: '1 dzień / dom' },
    ],
  },
  {
    num: '04',
    meta: 'Krok czwarty',
    duration: 'po 2 tygodniach',
    title: 'Gotowe pod podłogę',
    desc: 'Po 2 tygodniach schnięcia posadzka jest gotowa pod parkiet, panele lub płytki. Zostawiamy plac czysty, ty układasz wykończenie albo zlecasz dalej.',
    details: [
      { label: 'Suszenie', value: '~2 tygodnie' },
      { label: 'Gotowe pod', value: 'Parkiet, panele, płytki' },
    ],
    active: true,
  },
];

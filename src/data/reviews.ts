export const reviewsAggregate = {
  google: { rating: 4.4, count: 14, url: 'https://www.google.com/maps/place/RafBet/@50.721085,17.7721754,12z/data=!3m1!4b1!4m6!3m5!1s0x47104c99d1d2af27:0xa4551354b1a8b37a!8m2!3d50.721085!4d17.7721754!16s%2Fg%2F1ptyg4956' },
  oferteo: { rating: 5.0, count: 2, url: 'https://www.oferteo.pl/rafbet/firma/5854574' },
};

export interface Review {
  source: 'GOOGLE' | 'OFERTEO';
  stars: 5;
  date: string;
  quote: string;
  authorName: string;
  authorMeta: string;
  initials: string;
}

export const reviews: Review[] = [
  {
    source: 'OFERTEO',
    stars: 5,
    date: '06.2023',
    quote: 'Jestem pełen uznania za wykonanie wylewki w moim domu. Organizacja pracy jak i fachowość wykonania na najwyższym poziomie. Gorąco polecam firmę i usługi Pana Rafała. Firma rzetelna, solidna i dokładna.',
    authorName: 'Bartłomiej S.',
    authorMeta: 'Klient indywidualny',
    initials: 'BS',
  },
  {
    source: 'GOOGLE',
    stars: 5,
    date: '2024',
    quote: 'Bardzo zadowolony z pracy Pana Rafała. Spełniła moje oczekiwania, bardzo czysta robota, szybko i równo. Wylewka w garażu zrobiona perfekcyjnie, dobry kontakt z klientem, praca zgodna z umową, na czas. Cena uczciwa, polecam firmę RafBet.',
    authorName: 'Tomasz Czerwiński',
    authorMeta: 'Wylewka w garażu',
    initials: 'TC',
  },
  {
    source: 'GOOGLE',
    stars: 5,
    date: '2022',
    quote: 'Mile zaskoczony wykonaniem tej trudnej roboty, bo łatwa nie była. Praca spełniła moje oczekiwania. Polecam RAFBET każdemu zainteresowanemu. Profesjonalni, dokładni, szybcy i niezawodni.',
    authorName: 'Dariusz Różycki',
    authorMeta: 'Trudna realizacja',
    initials: 'DR',
  },
];

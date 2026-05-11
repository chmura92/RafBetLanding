export interface Service {
  num: string;
  title: string;
  metric: string;
  desc: string;
  tags: string[];
  ctaLabel: string;
  ctaHref: string;
}

export const services: Service[] = [
  {
    num: '01',
    title: 'Posadzki w domu<br>jednorodzinnym',
    metric: 'do 200 m²\n1 dzień pracy',
    desc: 'Wylewamy całość parteru lub piętra w jeden dzień. Mixokret zostaje na ulicy, w środku tylko czysty wąż. Po 2 tygodniach możesz układać parkiet.',
    tags: ['Hydroizolacja', 'Termoizolacja (styropian)', 'Ogrzewanie podłogowe', 'Dylatacje', 'Wylewka półsucha', 'Zatarcie mechaniczne'],
    ctaLabel: 'Zobacz realizacje domów',
    ctaHref: '#realizacje',
  },
  {
    num: '02',
    title: 'Hale przemysłowe<br>i magazyny',
    metric: '500+ m²\netapowo',
    desc: 'Duże powierzchnie wymagają większego zespołu i kilku mixokretów na zmianę. Robimy hale przemysłowe i magazyny na Opolszczyźnie i dalej.',
    tags: ['Zbrojenie siatką', 'Włókna polipropylenowe', 'Plastyfikatory', 'Poziomy laserowe', 'Dylatacje technologiczne', 'Zatarcie maszynowe'],
    ctaLabel: 'Zapytaj o wycenę hali',
    ctaHref: '#kontakt',
  },
];

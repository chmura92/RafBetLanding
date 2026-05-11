export interface FaqItem {
  num: string;
  question: string;
  answer: string; // HTML allowed
}

export const faqItems: FaqItem[] = [
  {
    num: '01',
    question: 'Ile kosztuje wylewka za m²?',
    answer: 'Cena zależy od metrażu, technologii i lokalizacji. Najczęściej domowe wylewki kosztują <strong>60–110 zł / m²</strong> z materiałem. Bezpłatna wycena po pomiarze, bez zobowiązań.',
  },
  {
    num: '02',
    question: 'Kiedy mogę chodzić po wylewce i kłaść podłogę?',
    answer: 'Po <strong>24-48 godzinach</strong> spokojnie chodzisz. Po <strong>2 tygodniach</strong> jest gotowa pod parkiet, panele lub płytki. Pełne wysuszenie zajmuje miesiąc.',
  },
  {
    num: '03',
    question: 'Materiał kupujecie wy czy ja?',
    answer: 'Najczęściej kupujemy my (cement, plastyfikatory, dylatacje, siatki). Możesz też dostarczyć własny, wtedy rabat ujmiemy w wycenie.',
  },
  {
    num: '04',
    question: 'Robicie wylewki na ogrzewaniu podłogowym?',
    answer: 'Tak. Wylewka na ogrzewaniu podłogowym to nasza specjalność. <strong>Półsucha metoda mixokretem</strong> to idealna podstawa pod rury PE-X.',
  },
  {
    num: '05',
    question: 'Dajecie gwarancję?',
    answer: 'Tak, <strong>5 lat gwarancji</strong> na wylewkę. Jeśli pęknięcia lub odspojenia są z naszej winy, naprawiamy bezpłatnie.',
  },
  {
    num: '06',
    question: 'W jakim obszarze działacie?',
    answer: '<strong>Województwo opolskie i dolnośląskie</strong> standardowo. Do 80 km od Dąbrowy bez dopłat, dalej do uzgodnienia. Hale 500+ m² robimy w całej Polsce.',
  },
];

import gallery01 from '@/assets/images/gallery-01.jpg';
import gallery02 from '@/assets/images/gallery-02.jpg';
import gallery03 from '@/assets/images/gallery-03.jpg';
import gallery04 from '@/assets/images/gallery-04.jpg';
import gallery05 from '@/assets/images/gallery-05.jpg';
import gallery06 from '@/assets/images/gallery-06.jpg';
import gallery07 from '@/assets/images/gallery-07.jpg';
import gallery08 from '@/assets/images/gallery-08.jpg';
import gallery09 from '@/assets/images/gallery-09.jpg';
import gallery10 from '@/assets/images/gallery-10.jpg';
import gallery11 from '@/assets/images/gallery-11.jpg';
import gallery12 from '@/assets/images/gallery-12.jpg';

export interface GalleryItem {
  src: ImageMetadata;
  caption: string;
  category: string;
  visible: boolean;
}

export const galleryItems: GalleryItem[] = [
  { src: gallery01, caption: 'Zatarta tafla, refleks słońca', category: 'Dom', visible: true },
  { src: gallery02, caption: 'Cisza po wylewce', category: 'Detal', visible: true },
  { src: gallery03, caption: 'Przejście między pokojami', category: 'Dom', visible: true },
  { src: gallery04, caption: 'Mixokret Brinkmann w akcji', category: 'Sprzęt', visible: true },
  { src: gallery05, caption: 'Honda na zatarciu', category: 'Sprzęt', visible: true },
  { src: gallery06, caption: 'Poziomy laserowe', category: 'Proces', visible: true },
  { src: gallery07, caption: 'Tafla gotowa pod parkiet', category: 'Dom', visible: false },
  { src: gallery08, caption: 'Pętle ogrzewania, laser, narzędzia', category: 'Proces', visible: false },
  { src: gallery09, caption: 'Dom drewniany, świeża wylewka', category: 'Dom', visible: false },
  { src: gallery10, caption: 'Helikopter na pętlach', category: 'Proces', visible: false },
  { src: gallery11, caption: 'Hala w foliach ochronnych', category: 'Hala', visible: false },
  { src: gallery12, caption: 'Dylatacja przy ścianie', category: 'Detal', visible: false },
];

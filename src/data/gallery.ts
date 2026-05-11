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
import gallery13 from '@/assets/images/gallery-13.jpg';
import gallery14 from '@/assets/images/gallery-14.jpg';

export interface GalleryItem {
  src: ImageMetadata;
  caption: string;
  category: string;
  visible: boolean;
}

export const galleryItems: GalleryItem[] = [
  { src: gallery01, caption: 'Zatarta tafla, refleks słońca', category: 'Dom', visible: true },
  { src: gallery02, caption: 'Zatarcie helikopterem', category: 'Proces', visible: true },
  { src: gallery03, caption: 'Mixokret Brinkmann w akcji', category: 'Sprzęt', visible: true },
  { src: gallery04, caption: 'Poziomica na świeżej wylewce', category: 'Detal', visible: true },
  { src: gallery05, caption: 'Gotowa pod parkiet', category: 'Dom', visible: true },
  { src: gallery06, caption: 'Poziomy laserowe', category: 'Proces', visible: true },
  { src: gallery07, caption: 'Posadzka cementowa', category: 'Dom', visible: false },
  { src: gallery08, caption: 'Wylewka na ogrzewaniu podłogowym', category: 'Proces', visible: false },
  { src: gallery09, caption: 'Dom drewniany, świeża wylewka', category: 'Dom', visible: false },
  { src: gallery10, caption: 'Zatarcie maszynowe', category: 'Proces', visible: false },
  { src: gallery11, caption: 'Hala przed wylewką', category: 'Hala', visible: false },
  { src: gallery12, caption: 'Hydroizolacja folią', category: 'Proces', visible: false },
  { src: gallery13, caption: 'Wyrównanie terenu pod podbudowę', category: 'Przygotowanie', visible: false },
  { src: gallery14, caption: 'Dom drewniany, Opolszczyzna', category: 'Dom', visible: false },
];

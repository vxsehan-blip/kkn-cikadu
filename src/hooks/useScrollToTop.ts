import { useEffect } from 'react';

/**
 * Custom hook untuk scroll to top otomatis
 * Mendeteksi klik pada elemen dengan atribut data-scroll-to-top
 */
export const useScrollToTop = () => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Cek apakah elemen yang diklik adalah tombol atau memiliki parent button
      const button = target.closest('button, a[role="button"], [data-scroll-to-top]');
      
      if (button) {
        // Scroll ke atas dengan animasi halus
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    };

    // Tambahkan event listener ke document
    document.addEventListener('click', handleClick);

    // Cleanup function
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
};
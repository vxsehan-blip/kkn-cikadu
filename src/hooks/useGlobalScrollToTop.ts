import { useEffect } from 'react';

/**
 * Custom hook untuk implementasi scroll-to-top global
 * Mendeteksi klik pada elemen dengan data attribute dan melakukan scroll otomatis
 */
export const useGlobalScrollToTop = () => {
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Cari elemen yang dapat diklik (button, a, atau elemen dengan role button)
      const clickableElement = target.closest('button, a, [role="button"], [data-scroll-trigger]');
      
      if (clickableElement) {
        // Cek apakah elemen memiliki data attribute untuk disable scroll
        const shouldScroll = clickableElement.getAttribute('data-scroll-to-top');
        
        // Default behavior: scroll to top kecuali explicitly disabled
        if (shouldScroll !== 'false') {
          // Delay sedikit untuk memastikan action asli tombol selesai
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    };

    // Tambahkan event listener ke document
    document.addEventListener('click', handleGlobalClick, { passive: true });

    // Cleanup function
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);
};

/**
 * Hook untuk scroll to top manual (untuk kasus khusus)
 */
export const useScrollToTop = () => {
  const scrollToTop = (smooth: boolean = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  };

  return { scrollToTop };
};
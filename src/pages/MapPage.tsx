import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import { MapPin, Building, Newspaper, Navigation, Layers } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { supabase, Business } from '../services/supabase';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const newsIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const businessIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const villageIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [35, 57],
  iconAnchor: [17, 57],
  popupAnchor: [1, -47],
  shadowSize: [57, 57]
});

interface NewsLocation {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  category: string;
}

const MapPage: React.FC = () => {
  const [newsLocations, setNewsLocations] = useState<NewsLocation[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNews, setShowNews] = useState(true);
  const [showBusinesses, setShowBusinesses] = useState(true);
  const [showVillageCenter, setShowVillageCenter] = useState(true);

  // Koordinat Desa Cikadu, Pelabuhanratu, Sukabumi, Jawa Barat
  const CIKADU_CENTER = [-6.9175, 106.5225]; // Koordinat perkiraan Desa Cikadu

  // Mock data lokasi berita
  const mockNewsLocations: NewsLocation[] = [
    {
      id: '1',
      title: 'Panen Raya di Sawah Emas',
      description: 'Lokasi panen spektakuler yang memukau mata',
      lat: -6.9185,
      lng: 106.5235,
      category: 'pertanian',
    },
    {
      id: '2',
      title: 'Pembangunan Jembatan Harapan',
      description: 'Lokasi gotong royong membangun jembatan',
      lat: -6.9165,
      lng: 106.5215,
      category: 'sosial',
    },
    {
      id: '3',
      title: 'Festival Budaya Spektakuler',
      description: 'Panggung utama festival budaya tahunan',
      lat: -6.9175,
      lng: 106.5225,
      category: 'budaya',
    },
  ];

  const mockBusinesses: Business[] = [
    {
      id: '1',
      name: 'Kebun Organik Lembah Hijau',
      description: 'Surga pertanian organik keluarga',
      contact: '+62 812-3456-7890',
      location: 'Kawasan Utara Desa',
      image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Kafe Pemandangan Gunung',
      description: 'Kedai kopi dengan pemandangan memukau',
      contact: '+62 814-5678-9012',
      location: 'Jalan Utama',
      image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      created_at: new Date().toISOString(),
    },
  ];

  // Add lat/lng to mock businesses for map display
  const mockBusinessesWithCoords = mockBusinesses.map((business, index) => ({
    ...business,
    lat: -6.9175 + (index * 0.002),
    lng: 106.5225 + (index * 0.002),
  }));

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      // Try to fetch from Supabase
      const [newsResponse, businessResponse] = await Promise.all([
        supabase.from('news_locations').select('*'),
        supabase.from('businesses').select('*')
      ]);

      if (newsResponse.error || businessResponse.error) {
        console.log('Using mock data as Supabase is not configured');
        setNewsLocations(mockNewsLocations);
        setBusinesses(mockBusinessesWithCoords);
      } else {
        setNewsLocations(newsResponse.data || mockNewsLocations);
        setBusinesses(businessResponse.data || mockBusinessesWithCoords);
      }
    } catch (error) {
      console.log('Using mock data:', error);
      setNewsLocations(mockNewsLocations);
      setBusinesses(mockBusinessesWithCoords);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-accent-50 to-primary-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Peta Ajaib Desa Cikadu
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Jelajahi keajaiban Desa Cikadu melalui peta interaktif yang menampilkan lokasi berita terkini, 
              usaha lokal membanggakan, dan titik-titik penting yang menyimpan cerita menakjubkan.
            </p>
          </motion.div>

          {/* Map Controls */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant={showNews ? 'primary' : 'outline'}
              icon={Newspaper}
              onClick={() => setShowNews(!showNews)}
              disableScrollToTop={true}
            >
              Lokasi Berita
            </Button>
            <Button
              variant={showBusinesses ? 'primary' : 'outline'}
              icon={Building}
              onClick={() => setShowBusinesses(!showBusinesses)}
              disableScrollToTop={true}
            >
              Usaha Lokal
            </Button>
            <Button
              variant={showVillageCenter ? 'primary' : 'outline'}
              icon={MapPin}
              onClick={() => setShowVillageCenter(!showVillageCenter)}
              disableScrollToTop={true}
            >
              Pusat Desa
            </Button>
            <Button
              variant="ghost"
              icon={Navigation}
              onClick={() => window.navigator.geolocation?.getCurrentPosition(() => {})}
              disableScrollToTop={true}
            >
              Lokasi Saya
            </Button>
          </div>
        </div>
      </section>

      {/* Map Container */}
      <section className="h-[70vh] relative">
        <MapContainer
          center={CIKADU_CENTER as [number, number]}
          zoom={15}
          className="h-full w-full"
        >
          {/* Satellite Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          />
          
          {/* Village Center Marker */}
          {showVillageCenter && (
            <Marker
              position={CIKADU_CENTER as [number, number]}
              icon={villageIcon}
            >
              <Popup className="custom-popup">
                <div className="p-3 min-w-[280px]">
                  <h3 className="font-bold text-xl mb-2 text-green-800">🏘️ Pusat Desa Cikadu</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Jantung kehidupan masyarakat Desa Cikadu yang penuh kehangatan dan kebersamaan.
                  </p>
                  <div className="bg-green-50 p-2 rounded-lg">
                    <p className="text-xs text-green-700 font-medium">
                      📍 Pelabuhanratu, Sukabumi, Jawa Barat
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* News Location Markers */}
          {showNews && newsLocations.map((news) => (
            <Marker
              key={`news-${news.id}`}
              position={[news.lat, news.lng]}
              icon={newsIcon}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[250px]">
                  <h3 className="font-bold text-lg mb-1 text-red-800">📰 {news.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{news.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {news.category}
                    </span>
                    <button
                      onClick={() => window.open(`/news#${news.id}`, '_blank')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                      data-scroll-to-top="false"
                    >
                      Baca Selengkapnya →
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Business Markers */}
          {showBusinesses && businesses.map((business) => (
            <Marker
              key={`business-${business.id}`}
              position={[(business as any).lat || -6.9175, (business as any).lng || 106.5225]}
              icon={businessIcon}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[250px]">
                  <img
                    src={business.image_url}
                    alt={business.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-bold text-lg mb-1 text-blue-800">🏪 {business.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{business.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{business.location}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`tel:${business.contact}`, '_self')}
                        data-scroll-to-top="false"
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                      >
                        Hubungi
                      </button>
                      <button
                        onClick={() => window.open(`/business#${business.id}`, '_blank')}
                        data-scroll-to-top="false"
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                      >
                        Detail →
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>

      {/* Legend and Info */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Panduan Peta Interaktif
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Setiap marker menyimpan cerita unik yang menunggu untuk dijelajahi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Pusat Desa</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Marker hijau besar menunjukkan jantung kehidupan Desa Cikadu yang penuh kehangatan.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Newspaper className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Lokasi Berita</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Marker merah menandai lokasi peristiwa dan berita terkini yang menginspirasi.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Usaha Lokal</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Marker biru menampilkan usaha lokal dan layanan yang membanggakan desa.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Fitur Interaktif</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Klik marker untuk informasi detail dan aksi langsung yang memudahkan.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Jelajahi Lebih Dalam Keajaiban Desa
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Peta ini hanya permulaan dari petualangan menakjubkan Anda. 
              Mari kunjungi langsung dan rasakan kehangatan serta keindahan Desa Cikadu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold shadow-lg"
               onClick={() => navigate('/contact')}
               disableScrollToTop={false}
              >
                Rencanakan Kunjungan
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold"
               onClick={() => navigate('/news')}
               disableScrollToTop={false}
              >
                Baca Berita Terkini
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MapPage;
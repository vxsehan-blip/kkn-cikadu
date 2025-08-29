import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  MapPin,
  Search,
  Filter,
  Star,
  Users,
  TrendingUp,
  ChevronDown,
  MessageCircle,
  Building2,
  Calendar,
  BarChart3,
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { supabase, Business } from '../services/supabase';

// Custom Dropdown Component
interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  icon?: React.ComponentType<any>;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center">
          {Icon && <Icon className="h-5 w-5 mr-3 text-emerald-600" />}
          <span>{selectedOption?.label || placeholder}</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-600 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors ${
                    value === option.value
                      ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

const BusinessPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Data UMKM dengan konten yang lebih formal dan informatif
  const mockBusinesses: Business[] = [
    {
      id: '1',
      name: 'Kebun Organik Lembah Hijau',
      description:
        'Pusat produksi pertanian organik yang menghasilkan sayuran berkualitas tinggi, rempah-rempah, dan telur ayam kampung. Menerapkan sistem pertanian berkelanjutan untuk mendukung ketahanan pangan lokal dengan standar kualitas terjamin.',
      contact: '+62 812-3456-7890',
      location: 'Kawasan Utara Desa Cikadu',
      image_url:
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      created_at: new Date().toISOString(),
      category: 'pertanian',
    },
    {
      id: '2',
      name: 'Sanggar Kerajinan Warisan Nusantara',
      description:
        'Sentra produksi kerajinan tradisional yang menghasilkan gerabah, tekstil, dan ukiran kayu berkualitas ekspor. Mempertahankan teknik kerajinan turun-temurun dengan inovasi desain kontemporer untuk pasar modern.',
      contact: '+62 813-4567-8901',
      location: 'Pusat Desa Cikadu',
      image_url:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      created_at: new Date().toISOString(),
      category: 'kerajinan',
    },
    {
      id: '3',
      name: 'Kafe Pemandangan Gunung',
      description:
        'Usaha kuliner lokal yang menyediakan kopi berkualitas premium dan makanan tradisional. Menawarkan pengalaman kuliner dengan pemandangan alam pegunungan sebagai daya tarik utama untuk wisatawan dan masyarakat lokal.',
      contact: '+62 814-5678-9012',
      location: 'Jalan Utama Desa Cikadu',
      image_url:
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      created_at: new Date().toISOString(),
      category: 'kuliner',
    },
    {
      id: '4',
      name: 'Jasa Pemandu Wisata Alam',
      description:
        'Layanan pemandu wisata profesional dengan sertifikasi resmi. Menyediakan paket wisata alam, hiking, pengamatan burung, dan tur edukasi budaya lokal dengan pemandu berpengalaman dan berlisensi.',
      contact: '+62 815-6789-0123',
      location: 'Pusat Informasi Wisata Cikadu',
      image_url:
        'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      created_at: new Date().toISOString(),
      category: 'jasa',
    },
    {
      id: '5',
      name: 'Toko Roti Fajar Berkah',
      description:
        'Usaha produksi roti dan kue tradisional dengan metode pembuatan menggunakan oven kayu bakar. Menggunakan resep turun-temurun dan bahan baku lokal untuk menghasilkan produk berkualitas dengan cita rasa autentik.',
      contact: '+62 816-7890-1234',
      location: 'Kampung Tengah Desa Cikadu',
      image_url:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      created_at: new Date().toISOString(),
      category: 'kuliner',
    },
    {
      id: '6',
      name: 'Apotek Herbal Tradisional',
      description:
        'Penyedia produk kesehatan herbal dan ramuan tradisional dari tanaman obat lokal. Melayani konsultasi kesehatan dengan tenaga ahli herbal bersertifikat untuk pengobatan alami dan pencegahan penyakit.',
      contact: '+62 817-8901-2345',
      location: 'Kawasan Timur Desa Cikadu',
      image_url:
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      created_at: new Date().toISOString(),
      category: 'kesehatan',
    },
  ];

  const sortOptions = [
    { value: 'name', label: 'Nama (A-Z)' },
    { value: 'location', label: 'Lokasi' },
    { value: 'created_at', label: 'Terbaru' },
    { value: 'category', label: 'Kategori' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'pertanian', label: 'Pertanian' },
    { value: 'kerajinan', label: 'Kerajinan' },
    { value: 'kuliner', label: 'Kuliner' },
    { value: 'jasa', label: 'Jasa' },
    { value: 'kesehatan', label: 'Kesehatan' },
  ];

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    filterAndSortBusinesses();
  }, [businesses, searchTerm, sortBy, selectedCategory]);

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log(
          'Menggunakan data lokal karena Supabase belum dikonfigurasi'
        );
        setBusinesses(mockBusinesses);
      } else {
        setBusinesses(data || mockBusinesses);
      }
    } catch (error) {
      console.log('Menggunakan data lokal:', error);
      setBusinesses(mockBusinesses);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBusinesses = () => {
    let filtered = businesses;

    // Filter berdasarkan kategori
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (business) => business.category === selectedCategory
      );
    }

    // Filter berdasarkan pencarian
    if (searchTerm) {
      filtered = filtered.filter(
        (business) =>
          business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          business.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Urutkan data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'location':
          return a.location.localeCompare(b.location);
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        case 'created_at':
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredBusinesses(filtered);
  };

  const handleWhatsApp = (phoneNumber: string, businessName: string) => {
    const message = `Halo, saya ingin mengetahui informasi lebih lanjut tentang ${businessName}. Terima kasih.`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(
      /[^0-9]/g,
      ''
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      {/* Hero Section dengan Background Image */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Image dengan Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-full">
                <Building2 className="h-5 w-5 mr-2" />
                <span className="font-semibold">Direktori UMKM</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Usaha Mikro Kecil Menengah
              <span className="block text-emerald-400">Desa Cikadu</span>
            </h1>

            <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Informasi lengkap mengenai usaha mikro, kecil, dan menengah yang
              beroperasi di Desa Cikadu, Kecamatan Pelabuhanratu, Kabupaten
              Sukabumi, Jawa Barat.
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-white mb-2">
                  {filteredBusinesses.length}
                </div>
                <div className="text-gray-200">UMKM Terdaftar</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-white mb-2">5</div>
                <div className="text-gray-200">Kategori Usaha</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-white mb-2">150+</div>
                <div className="text-gray-200">Tenaga Kerja</div>
              </div>
            </div>
          </motion.div>

          {/* Search dan Filter yang Diperbaiki */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl">
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Cari nama usaha, deskripsi, atau lokasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-sm md:text-base shadow-sm"
                  />
                </div>

                {/* Filter Controls - Responsif */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {/* Category Filter */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-500 pointer-events-none z-10" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-10 md:pl-12 pr-8 py-3 md:py-4 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-sm md:text-base appearance-none cursor-pointer font-medium shadow-sm hover:shadow-md"
                    >
                      {categoryOptions.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-500 pointer-events-none" />
                  </div>

                  {/* Sort Filter */}
                  <div className="relative">
                    <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-500 pointer-events-none z-10" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full pl-10 md:pl-12 pr-8 py-3 md:py-4 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-sm md:text-base appearance-none cursor-pointer font-medium shadow-sm hover:shadow-md"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Business */}
      {filteredBusinesses.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full mb-4">
                  <Star className="h-4 w-4 mr-2" />
                  <span className="font-semibold">UMKM Unggulan</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Profil Usaha Terdepan
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Menampilkan UMKM dengan kontribusi signifikan dalam
                  perekonomian desa
                </p>
              </div>

              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative h-64 lg:h-auto min-h-[400px]">
                    <img
                      src={filteredBusinesses[0].image_url}
                      alt={filteredBusinesses[0].name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-6 left-6">
                      <div className="flex items-center bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold shadow-lg">
                        <Star className="h-4 w-4 mr-2 fill-current" />
                        UNGGULAN
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="font-medium">
                            {filteredBusinesses[0].location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                      {filteredBusinesses[0].name}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                      {filteredBusinesses[0].description}
                    </p>

                    <div className="flex flex-col gap-4">
                      <Button
                        variant="primary"
                        size="lg"
                        icon={MessageCircle}
                        onClick={() =>
                          handleWhatsApp(
                            filteredBusinesses[0].contact,
                            filteredBusinesses[0].name
                          )
                        }
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        disableScrollToTop={true}
                      >
                        Hubungi via WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Businesses Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
              <Users className="h-4 w-4 mr-2" />
              <span className="font-semibold">Direktori Lengkap</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Semua UMKM Terdaftar
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Daftar lengkap usaha mikro, kecil, dan menengah yang beroperasi di
              Desa Cikadu
            </p>
          </motion.div>

          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <Search className="h-16 w-16 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Data Tidak Ditemukan
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Silakan ubah kata kunci pencarian atau filter yang digunakan
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredBusinesses.slice(1).map((business, index) => (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all duration-500 group border-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={business.image_url}
                        alt={business.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                          {business.category || 'Umum'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 transition-colors">
                        {business.name}
                      </h3>

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                        <span>{business.location}</span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1 leading-relaxed text-sm">
                        {business.description}
                      </p>

                      <div className="space-y-3">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={MessageCircle}
                          onClick={() =>
                            handleWhatsApp(business.contact, business.name)
                          }
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          disableScrollToTop={true}
                        >
                          Hubungi via WhatsApp
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BusinessPage;

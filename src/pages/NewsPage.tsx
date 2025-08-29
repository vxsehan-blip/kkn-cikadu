import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  User,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  BookOpen,
  ChevronDown,
  X,
  FileText,
  Clock,
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { supabase } from '../services/supabase';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  category: string;
  created_at: string;
}

const NewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title:
        'Program Pemberdayaan Masyarakat melalui Pelatihan Keterampilan Digital',
      excerpt:
        'Mahasiswa KKN Universitas Nusa Putra menyelenggarakan pelatihan komputer dan media sosial untuk meningkatkan kemampuan digital warga Desa Cikadu dalam mengembangkan usaha mikro.',
      content:
        'Program pelatihan keterampilan digital ini merupakan bagian dari kegiatan KKN yang bertujuan untuk meningkatkan literasi digital masyarakat desa...',
      image_url:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'Tim KKN Universitas Nusa Putra',
      category: 'pendidikan',
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Gotong Royong Pembangunan Infrastruktur Jalan Desa',
      excerpt:
        'Masyarakat Desa Cikadu bersama mahasiswa KKN bergotong royong memperbaiki jalan desa yang rusak untuk memperlancar akses transportasi dan distribusi hasil pertanian.',
      content:
        'Kegiatan gotong royong ini melibatkan seluruh elemen masyarakat dalam upaya perbaikan infrastruktur desa...',
      image_url:
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'Kepala Desa Cikadu',
      category: 'infrastruktur',
      created_at: '2024-01-12T14:30:00Z',
    },
    {
      id: '3',
      title: 'Festival Budaya dan Seni Tradisional Desa Cikadu',
      excerpt:
        'Penyelenggaraan festival budaya tahunan yang menampilkan tarian tradisional, musik daerah, dan pameran kerajinan tangan sebagai upaya pelestarian warisan budaya lokal.',
      content:
        'Festival budaya ini merupakan wadah untuk melestarikan dan memperkenalkan kekayaan budaya Desa Cikadu...',
      image_url:
        'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'Karang Taruna Desa Cikadu',
      category: 'budaya',
      created_at: '2024-01-10T19:00:00Z',
    },
    {
      id: '4',
      title: 'Pengembangan UMKM Produk Olahan Pertanian',
      excerpt:
        'Program pendampingan UMKM oleh mahasiswa KKN dalam mengembangkan produk olahan hasil pertanian lokal untuk meningkatkan nilai tambah dan daya saing produk desa.',
      content:
        'Kegiatan pendampingan UMKM ini fokus pada pengembangan produk olahan yang memiliki nilai ekonomi tinggi...',
      image_url:
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'Tim Ekonomi KKN',
      category: 'ekonomi',
      created_at: '2024-01-08T11:15:00Z',
    },
    {
      id: '5',
      title: 'Program Beasiswa Pendidikan untuk Anak Desa Berprestasi',
      excerpt:
        'Pemberian beasiswa pendidikan kepada siswa berprestasi dari keluarga kurang mampu sebagai bentuk investasi jangka panjang dalam pengembangan sumber daya manusia desa.',
      content:
        'Program beasiswa ini merupakan hasil kerjasama antara pemerintah desa dengan berbagai pihak...',
      image_url:
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'Dinas Pendidikan Desa',
      category: 'pendidikan',
      created_at: '2024-01-05T16:45:00Z',
    },
    {
      id: '6',
      title: 'Program Penghijauan dan Konservasi Lingkungan',
      excerpt:
        'Kegiatan penanaman pohon dan edukasi lingkungan yang dilaksanakan mahasiswa KKN bersama masyarakat untuk menjaga kelestarian alam dan mencegah erosi tanah.',
      content:
        'Program penghijauan ini merupakan bagian dari upaya konservasi lingkungan yang berkelanjutan...',
      image_url:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'Tim Lingkungan KKN',
      category: 'lingkungan',
      created_at: '2024-01-03T08:20:00Z',
    },
  ];

  const categories = [
    { value: 'all', label: 'Semua Kategori', count: mockArticles.length },
    {
      value: 'pendidikan',
      label: 'Pendidikan',
      count: mockArticles.filter((a) => a.category === 'pendidikan').length,
    },
    {
      value: 'infrastruktur',
      label: 'Infrastruktur',
      count: mockArticles.filter((a) => a.category === 'infrastruktur').length,
    },
    {
      value: 'budaya',
      label: 'Budaya',
      count: mockArticles.filter((a) => a.category === 'budaya').length,
    },
    {
      value: 'ekonomi',
      label: 'Ekonomi',
      count: mockArticles.filter((a) => a.category === 'ekonomi').length,
    },
    {
      value: 'lingkungan',
      label: 'Lingkungan',
      count: mockArticles.filter((a) => a.category === 'lingkungan').length,
    },
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, selectedCategory, searchTerm]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setArticles(mockArticles);
      } else {
        setArticles(data || mockArticles);
      }
    } catch (error) {
      setArticles(mockArticles);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      pendidikan: 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-800 dark:text-emerald-100 dark:border-emerald-600',
      infrastruktur: 'bg-green-100 text-green-900 border border-green-300 dark:bg-green-800 dark:text-green-100 dark:border-green-600',
      budaya: 'bg-teal-100 text-teal-900 border border-teal-300 dark:bg-teal-800 dark:text-teal-100 dark:border-teal-600',
      ekonomi: 'bg-lime-100 text-lime-900 border border-lime-300 dark:bg-lime-800 dark:text-lime-100 dark:border-lime-600',
      lingkungan: 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-800 dark:text-emerald-100 dark:border-emerald-600',
    };
    return (
      colors[category as keyof typeof colors] ||
      'bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-500/50'
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCardClick = (articleId: string) => {
    navigate(`/news/${articleId}`);
  };

  const handleCategorySelect = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setShowMobileFilter(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section dengan Background Image Profesional */}
      <section
        className="py-20 md:py-32 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(5, 150, 105, 0.85) 0%, rgba(16, 185, 129, 0.8) 50%, rgba(4, 120, 87, 0.9) 100%), url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-6 py-3 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <FileText className="w-5 h-5 text-white mr-2" />
              <span className="text-white font-semibold">
                Portal Informasi Resmi
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Berita dan Informasi
              </span>
              <br />
              <span className="text-emerald-200">Desa Cikadu</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Portal informasi resmi untuk program Kuliah Kerja Nyata, kegiatan
              pembangunan desa, dan perkembangan terkini menuju Desa Cikadu yang
              maju dan sejahtera.
            </p>
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
                    placeholder="Cari berita dan informasi..."
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
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label} ({category.count})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-500 pointer-events-none" />
                  </div>

                  {/* Sort Filter - Diperbaiki untuk Mobile */}
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-500 pointer-events-none z-10" />
                    <select
                      defaultValue="newest"
                      className="w-full pl-10 md:pl-12 pr-8 py-3 md:py-4 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-sm md:text-base appearance-none cursor-pointer font-medium shadow-sm hover:shadow-md"
                    >
                      <option value="newest">Terbaru</option>
                      <option value="oldest">Terlama</option>
                      <option value="title">Judul A-Z</option>
                      <option value="category">Kategori</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      {filteredArticles.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="font-semibold">BERITA UTAMA</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Informasi Terkini
                </h2>
              </div>

              <Card
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                onClick={() => handleCardClick(filteredArticles[0].id)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                  <div className="lg:col-span-3 relative overflow-hidden">
                    <img
                      src={filteredArticles[0].image_url}
                      alt={filteredArticles[0].title}
                      className="w-full h-72 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-6 left-6">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${getCategoryColor(
                          filteredArticles[0].category
                        )}`}
                      >
                        {filteredArticles[0].category.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-2 p-6 md:p-8 flex flex-col justify-center">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-emerald-600 transition-colors duration-300">
                      {filteredArticles[0].title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-base md:text-lg leading-relaxed">
                      {filteredArticles[0].excerpt}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 mb-6 gap-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span className="font-medium">
                          {filteredArticles[0].author}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {formatDate(filteredArticles[0].created_at)}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 md:py-4 px-6 rounded-xl shadow-lg hover:shadow-xl"
                      icon={ArrowRight}
                      onClick={() => handleCardClick(filteredArticles[0].id)}
                    >
                      Baca Selengkapnya
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Berita dan Kegiatan Terbaru
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Informasi terkini mengenai program KKN dan perkembangan
              pembangunan Desa Cikadu
            </p>
          </motion.div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Tidak Ada Hasil
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Tidak ada berita yang sesuai dengan pencarian Anda. Silakan
                  coba kata kunci lain.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredArticles.slice(1).map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    className="overflow-hidden h-full hover:shadow-2xl transition-all duration-500 cursor-pointer group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600"
                    onClick={() => handleCardClick(article.id)}
                  >
                    <div className="relative">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/60 transition-all duration-300"></div>
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${getCategoryColor(
                            article.category
                          )}`}
                        >
                          {article.category.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 md:p-6 flex flex-col h-full">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                        {article.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow leading-relaxed text-sm md:text-base">
                        {article.excerpt}
                      </p>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs md:text-sm text-gray-500 mb-4 gap-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span className="truncate max-w-[120px] font-medium">
                            {article.author}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(article.created_at)}</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-200 font-medium"
                        onClick={() => handleCardClick(article.id)}
                      >
                        Baca Artikel
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredArticles.length > 6 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button
                variant="outline"
                size="lg"
                className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold border-emerald-500 text-emerald-600 hover:bg-emerald-600 hover:text-white"
              >
                Muat Lebih Banyak Berita
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
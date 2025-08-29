import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useGlobalScrollToTop } from '../hooks/useGlobalScrollToTop';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import NewsPage from '../pages/NewsPage';
import NewsDetailPage from '../pages/NewsDetailPage';
import BusinessPage from '../pages/BusinessPage';
import MapPage from '../pages/MapPage';

const AppContent: React.FC = () => {
  useGlobalScrollToTop();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#059669',
            color: '#ffffff',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#ffffff',
              secondary: '#059669',
            },
          },
          error: {
            style: {
              background: '#dc2626',
              color: '#ffffff',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#dc2626',
            },
          },
        }}
      />
    </div>
  );
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default AppRouter;
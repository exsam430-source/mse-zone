import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Hero from '../../Components/Frontend/Hero';
import SEO from '../../Components/Frontend/SEO';
import LatestCollection from '../../Components/Frontend/LatestCollection';
import BestSeller from '../../Components/Frontend/BestSeller';
import OurPolicy from '../../Components/Frontend/OurPolicy';
import NewSletterBox from '../../Components/Frontend/NewSletterBox';
import FeaturesBar from '../../Components/Frontend/FeaturesBar';
import TrendingBanner from '../../Components/Frontend/TrendingBanner';

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }, []);

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "MSE Zone",
    "description": "Discover MSE Zone, your ultimate e-commerce destination for online shopping. Shop the latest collections of high-quality clothes, fashion wear, cosmetics, kitchenware, toys, and lifestyle accessories in the UAE.",
    "url": typeof window !== "undefined" ? window.location.origin : "https://msezone.com",
    "logo": typeof window !== "undefined" ? `${window.location.origin}/logo.png` : "https://msezone.com/logo.png",
    "image": typeof window !== "undefined" ? `${window.location.origin}/logo.png` : "https://msezone.com/logo.png",
    "telephone": "+92 300 1234567",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Industrial Area 6",
      "addressLocality": "Sharjah",
      "addressCountry": "AE"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
      <SEO 
        title="MSE Zone | Ultimate Online Shopping & Clothes E-commerce"
        description="Shop clothes, fashion, cosmetics, kitchenware, toys, and lifestyle accessories online at MSE Zone. Best quality products, secure payments, and fast shipping in UAE."
        keywords="clothes shopping, buy clothes online, clothing brand UAE, fashion store, MSE Zone"
        schema={storeSchema}
      />
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-100/40 to-pink-100/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-100/40 to-cyan-100/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-amber-100/40 to-orange-100/40 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <section className="w-full min-h-screen">
        <Hero />
      </section>

      {/* Features Bar */}
      <section className="relative z-10 -mt-20">
        <FeaturesBar />
      </section>

      {/* Latest Collection */}
      <section className="relative py-20 px-4 md:px-12 lg:px-20">
        <LatestCollection />
      </section>

      {/* Trending Banner */}
      <section className="relative py-10">
        <TrendingBanner />
      </section>

      {/* Best Seller */}
      <section className="relative py-20 px-4 md:px-12 lg:px-20">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 skew-y-2 -z-10" />
        <BestSeller />
      </section>

      {/* Our Policy */}
      <section className="relative py-24 px-4 md:px-12 lg:px-20">
        <OurPolicy />
      </section>

      {/* Newsletter */}
      <section className="relative py-20 px-4 md:px-12 lg:px-20 mb-10">
        <NewSletterBox />
      </section>
    </div>
  );
};

export default Home;
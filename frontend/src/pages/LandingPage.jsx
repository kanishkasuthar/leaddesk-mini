import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StorySection from '../components/StorySection';
import WorkflowJourney from '../components/WorkflowJourney';
import WhyLeadManagement from '../components/WhyLeadManagement';
import ProductPreview from '../components/ProductPreview';
import StatsCounter from '../components/StatsCounter';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#F4EFE8] text-[#343434] flex flex-col font-sans selection:bg-[#4A3728] selection:text-white"
    >
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <StorySection />
        <WorkflowJourney />
        <WhyLeadManagement />
        <ProductPreview />
        <StatsCounter />
      </main>
      <Footer />
    </motion.div>
  );
}

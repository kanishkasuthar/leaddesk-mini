import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Menu, X, ArrowLeft } from 'lucide-react';
import LiveClock from './LiveClock';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isAdminPage = location.pathname === '/admin';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 left-0 right-0 z-40 transition-all duration-250 ${
      isScrolled ? 'bg-[#F4EFE8]/95 backdrop-blur-md border-b border-[#E5DDD3] py-3.5 shadow-sm' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            aria-label="LeadDesk Mini Home"
            className="flex items-center gap-3 group focus-visible:outline-none rounded-[18px]"
          >
            <div className="w-10 h-10 rounded-[14px] bg-[#4A3728] flex items-center justify-center text-[#FFFFFF] shadow-sm group-hover:bg-[#34261C] transition-colors">
              <Shield className="w-5 h-5 text-[#CDAA7D]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold tracking-tight text-[#343434]">
                LeadDesk <span className="text-[#4A3728] font-semibold">Mini</span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          {!isAdminPage ? (
            <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-xs font-semibold uppercase tracking-wider text-[#6F6A63] hover:text-[#4A3728] transition-colors">
                Home
              </a>
              <a href="#features" className="text-xs font-semibold uppercase tracking-wider text-[#6F6A63] hover:text-[#4A3728] transition-colors">
                Features
              </a>
              <a href="#workflow" className="text-xs font-semibold uppercase tracking-wider text-[#6F6A63] hover:text-[#4A3728] transition-colors">
                Workflow
              </a>
              <a href="#contact" className="text-xs font-semibold uppercase tracking-wider text-[#6F6A63] hover:text-[#4A3728] transition-colors">
                Contact
              </a>
              <Link to="/admin" className="text-xs font-semibold uppercase tracking-wider text-[#6F6A63] hover:text-[#4A3728] transition-colors">
                Admin
              </Link>
            </nav>
          ) : (
            <span className="hidden md:inline-flex text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#CDAA7D]/20 text-[#4A3728] border border-[#CDAA7D]/40">
              Executive Workspace
            </span>
          )}

          {/* Bangalore Live Time Clock */}
          <LiveClock />

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            {isAdminPage ? (
              <Link
                to="/"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-[16px] bg-[#FFFFFF] hover:bg-[#ECE4DA] text-[#343434] border border-[#E5DDD3] transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-[#4A3728]" />
                <span>Back to Site</span>
              </Link>
            ) : (
              <Link
                to="/admin"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-[16px] bg-[#4A3728] hover:bg-[#34261C] text-[#FFFFFF] shadow-espresso transition-all transform hover:-translate-y-0.5"
              >
                <LayoutDashboard className="w-4 h-4 text-[#CDAA7D]" />
                <span>Explore Dashboard</span>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-[16px] bg-[#FFFFFF] border border-[#E5DDD3] text-[#343434]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 p-4 rounded-[20px] bg-[#FFFFFF] border border-[#E5DDD3] shadow-xl flex flex-col gap-3">
            {!isAdminPage && (
              <>
                <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-wider text-[#343434] px-3 py-2 rounded-xl hover:bg-[#ECE4DA]">Home</a>
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-wider text-[#343434] px-3 py-2 rounded-xl hover:bg-[#ECE4DA]">Features</a>
                <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-wider text-[#343434] px-3 py-2 rounded-xl hover:bg-[#ECE4DA]">Workflow</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-wider text-[#343434] px-3 py-2 rounded-xl hover:bg-[#ECE4DA]">Contact</a>
              </>
            )}
            <Link
              to={isAdminPage ? "/" : "/admin"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-[16px] bg-[#4A3728] text-white"
            >
              <LayoutDashboard className="w-4 h-4 text-[#CDAA7D]" />
              <span>{isAdminPage ? 'Back to Site' : 'Explore Dashboard'}</span>
            </Link>
          </nav>
        )}

      </div>
    </header>
  );
}

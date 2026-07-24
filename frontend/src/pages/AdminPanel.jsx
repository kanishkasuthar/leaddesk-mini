import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import Pagination from '../components/Pagination';
import LeadDrawer from '../components/LeadDrawer';
import CommandPalette from '../components/CommandPalette';
import QuoteBanner from '../components/QuoteBanner';
import QuickActions from '../components/QuickActions';
import { CardSkeleton } from '../components/SkeletonLoader';
import { leadService, authService } from '../services/api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Activity, 
  Archive, 
  Calendar, 
  Search, 
  Loader2,
  X,
  LayoutGrid,
  List,
  Sparkles,
  RotateCcw,
  ChevronRight,
  LogOut,
  UserCheck
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function AdminPanel() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, activeCount: 0, inactiveCount: 0, todayCount: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Current admin session
  const adminUser = authService.getAdmin();

  // Drawer & Modal States
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    leadId: null,
    leadName: '',
    currentStatus: '',
    targetStatus: '',
    isLoading: false
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    const adminName = adminUser?.name || 'Admin';
    if (hour < 12) return `Good Morning, ${adminName}.`;
    if (hour < 17) return `Good Afternoon, ${adminName}.`;
    return `Good Evening, ${adminName}.`;
  };

  const handleLogout = () => {
    authService.logout();
    setToast({ message: 'Logged out successfully.', type: 'success' });
    navigate('/login');
  };

  // Listen for session expiry event from Axios interceptor
  useEffect(() => {
    const handleSessionExpired = (e) => {
      const msg = e.detail?.message || 'Authentication session expired. Please log in again.';
      setToast({ message: msg, type: 'error' });
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    };

    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, [navigate]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [leadsRes, statsRes] = await Promise.all([
        leadService.getLeads(),
        leadService.getStats()
      ]);

      if (leadsRes.success) {
        setLeads(leadsRes.data || []);
      }
      if (statsRes.success) {
        setStats(statsRes.data || { total: 0, activeCount: 0, inactiveCount: 0, todayCount: 0 });
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      if (error.response?.status === 401) {
        setToast({ message: 'Session expired. Redirecting to login...', type: 'error' });
        authService.logout();
        setTimeout(() => navigate('/login'), 1000);
      } else {
        setToast({ message: 'Failed to connect to lead database backend API.', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Keyboard Shortcuts ('/', 'Ctrl+K', 'N')
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        if (searchInputRef.current) searchInputRef.current.focus();
      }
      if ((e.key === 'n' || e.key === 'N') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        navigate('/#contact');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const requestStatusChange = (lead, newStatus) => {
    if (lead.status === newStatus) return;
    setConfirmModal({
      isOpen: true,
      leadId: lead.id,
      leadName: lead.name,
      currentStatus: lead.status,
      targetStatus: newStatus,
      isLoading: false
    });
  };

  const executeStatusChange = async () => {
    const { leadId, targetStatus } = confirmModal;
    setConfirmModal(prev => ({ ...prev, isLoading: true }));
    setUpdatingId(leadId);

    try {
      const response = await leadService.updateStatus(leadId, targetStatus);
      if (response.success) {
        setToast({
          message: 'Status updated successfully.',
          type: 'success'
        });

        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: targetStatus } : l));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(prev => ({ ...prev, status: targetStatus }));
        }

        const statsRes = await leadService.getStats();
        if (statsRes.success) {
          setStats(statsRes.data);
        }
      }
    } catch (error) {
      console.error('Status update error:', error);
      setToast({
        message: 'Failed to update status in database.',
        type: 'error'
      });
    } finally {
      setUpdatingId(null);
      setConfirmModal({
        isOpen: false,
        leadId: null,
        leadName: '',
        currentStatus: '',
        targetStatus: '',
        isLoading: false
      });
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) {
      setToast({ message: 'No opportunities available to export.', type: 'error' });
      return;
    }
    const headers = ['ID', 'Name', 'Email', 'Budget', 'Message', 'Status', 'Created At'];
    const rows = leads.map(l => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.budget.replace(/"/g, '""')}"`,
      `"${l.message.replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.created_at}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sandstone_opportunities_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast({ message: 'CSV export complete.', type: 'success' });
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (statusFilter !== 'All' && lead.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = lead.name?.toLowerCase().includes(q);
        const matchesEmail = lead.email?.toLowerCase().includes(q);
        const matchesMessage = lead.message?.toLowerCase().includes(q);
        const matchesBudget = lead.budget?.toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesMessage || matchesBudget;
      }
      return true;
    });
  }, [leads, searchQuery, statusFilter]);

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(d);
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New':
        return 'bg-[#CDAA7D]/20 text-[#4A3728] border-[#CDAA7D]/40';
      case 'Contacted':
        return 'bg-[#5E7A5D]/20 text-[#344533] border-[#5E7A5D]/40';
      case 'Closed':
        return 'bg-[#4A3728] text-white border-[#4A3728]';
      default:
        return 'bg-[#F4EFE8] text-[#6F6A63] border-[#E5DDD3]';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE8] text-[#343434] flex flex-col font-sans">
      <Navbar />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Confirm Status Update"
        message={`Are you sure you want to update ${confirmModal.leadName}'s status from "${confirmModal.currentStatus}" to "${confirmModal.targetStatus}"?`}
        targetStatus={confirmModal.targetStatus}
        isLoading={confirmModal.isLoading}
        onConfirm={executeStatusChange}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      <LeadDrawer
        lead={selectedLead}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onStatusChange={(id, newStatus) => {
          const targetLead = leads.find(l => l.id === id);
          if (targetLead) requestStatusChange(targetLead, newStatus);
        }}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onFocusSearch={() => {
          if (searchInputRef.current) searchInputRef.current.focus();
        }}
        onExportCSV={exportToCSV}
      />

      <QuickActions
        onAddLead={() => navigate('/#contact')}
        onRefresh={fetchData}
        onExportCSV={exportToCSV}
      />

      <main className="flex-grow pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Executive Header & Session Logout Bar */}
        <div className="grid lg:grid-cols-12 gap-6 items-end border-b border-[#E5DDD3] pb-6">
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#4A3728]">Executive Workspace</span>
              {adminUser && (
                <span className="text-[11px] font-semibold text-[#5E7A5D] bg-[#5E7A5D]/10 border border-[#5E7A5D]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span>Authenticated ({adminUser.email})</span>
                </span>
              )}
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#343434]">
              {getGreeting()}
            </h1>
            <p className="text-[#6F6A63] text-sm">
              Here's today's opportunity overview.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col items-end gap-3">
            <QuoteBanner />
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] bg-[#FFFFFF] hover:bg-[#ECE4DA] text-[#A04E45] border border-[#E5DDD3] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4 text-[#A04E45]" />
              <span>Log Out Session</span>
            </button>
          </div>
        </div>

        {/* 4 Statistics KPI Cards with Subtle Hover Animations */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Total Leads Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
            className="sandstone-card p-5 sm:p-6 border border-[#E5DDD3] shadow-sandstone flex items-center justify-between transition-shadow hover:shadow-lg cursor-default"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6F6A63]">Total Leads</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#343434] mt-1">{stats.total}</h2>
            </div>
            <div className="w-11 h-11 rounded-[14px] bg-[#4A3728] text-[#CDAA7D] flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Active Leads Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="sandstone-card p-5 sm:p-6 border border-[#E5DDD3] shadow-sandstone flex items-center justify-between transition-shadow hover:shadow-lg cursor-default"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5E7A5D]">Active Leads</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#5E7A5D] mt-1">{stats.activeCount}</h2>
            </div>
            <div className="w-11 h-11 rounded-[14px] bg-[#5E7A5D]/20 text-[#5E7A5D] flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Inactive Leads Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="sandstone-card p-5 sm:p-6 border border-[#E5DDD3] shadow-sandstone flex items-center justify-between transition-shadow hover:shadow-lg cursor-default"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A3728]">Inactive Leads</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#4A3728] mt-1">{stats.inactiveCount}</h2>
            </div>
            <div className="w-11 h-11 rounded-[14px] bg-[#4A3728] text-white flex items-center justify-center shadow-sm">
              <Archive className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Leads Added Today Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="sandstone-card p-5 sm:p-6 border border-[#E5DDD3] shadow-sandstone flex items-center justify-between transition-shadow hover:shadow-lg cursor-default"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#CDAA7D]">Leads Added Today</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#4A3728] mt-1">{stats.todayCount}</h2>
            </div>
            <div className="w-11 h-11 rounded-[14px] bg-[#CDAA7D]/20 text-[#4A3728] flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
          </motion.div>

        </div>

        {/* Search & Controls */}
        <div className="sandstone-card p-4 border border-[#E5DDD3] shadow-sandstone flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A3728] pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search names, emails or opportunities... (/)"
              className="w-full pl-10 pr-10 py-2.5 rounded-[14px] bg-[#F4EFE8] border border-[#E5DDD3] text-[#343434] placeholder-[#6F6A63] focus:outline-none focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10 text-xs font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6A63] hover:text-[#343434]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-[#F4EFE8] p-1 rounded-[14px] border border-[#E5DDD3]">
              {['All', 'New', 'Contacted', 'Closed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    statusFilter === tab
                      ? 'bg-[#4A3728] text-white shadow-sm'
                      : 'text-[#6F6A63] hover:text-[#343434]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* View Switcher */}
            <div className="hidden lg:flex items-center gap-1 bg-[#F4EFE8] p-1 rounded-[14px] border border-[#E5DDD3]">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-[#FFFFFF] text-[#4A3728] shadow-sm' : 'text-[#6F6A63]'}`}
                title="Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-[#FFFFFF] text-[#4A3728] shadow-sm' : 'text-[#6F6A63]'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Opportunity Listing */}
        <div className="sandstone-card border border-[#E5DDD3] shadow-sandstone overflow-hidden">
          
          {isLoading ? (
            <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-20 px-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-[20px] bg-[#F4EFE8] border border-[#E5DDD3] flex items-center justify-center mx-auto text-[#4A3728]">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-xl font-bold text-[#343434]">Your workspace is ready.</h3>
                <p className="text-xs text-[#6F6A63] max-w-md mx-auto">
                  {searchQuery
                    ? `No matching opportunities found for query "${searchQuery}"`
                    : 'New opportunities will appear here as soon as someone reaches out.'}
                </p>
              </div>
              {(searchQuery || statusFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] bg-[#F4EFE8] hover:bg-[#ECE4DA] text-[#4A3728] border border-[#E5DDD3] text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {viewMode === 'cards' ? (
                <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsDrawerOpen(true);
                      }}
                      className="sandstone-card p-6 border border-[#E5DDD3] shadow-sandstone hover:border-[#4A3728]/40 cursor-pointer flex flex-col justify-between space-y-4 group transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6A63]">#{lead.id}</span>
                          <select
                            value={lead.status}
                            disabled={updatingId === lead.id}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              requestStatusChange(lead, e.target.value);
                            }}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${getStatusBadgeClass(lead.status)}`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>

                        <div>
                          <h4 className="font-heading text-lg font-bold text-[#343434] group-hover:text-[#4A3728] transition-colors">
                            {lead.name}
                          </h4>
                          <p className="text-xs text-[#6F6A63]">{lead.email}</p>
                        </div>

                        <div className="p-3.5 rounded-[14px] bg-[#F4EFE8] border border-[#E5DDD3] text-xs text-[#343434] line-clamp-2">
                          "{lead.message}"
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E5DDD3] flex items-center justify-between text-xs">
                        <span className="font-bold text-[#4A3728]">{lead.budget}</span>
                        <span className="text-[10px] text-[#6F6A63] flex items-center gap-1">
                          <span>{formatDate(lead.created_at)}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#6F6A63] group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F4EFE8] border-b border-[#E5DDD3] text-[#6F6A63] font-bold uppercase tracking-wider">
                        <th className="py-4 px-6">Name</th>
                        <th className="py-4 px-6">Email</th>
                        <th className="py-4 px-6">Budget</th>
                        <th className="py-4 px-6">Message</th>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5DDD3]/60">
                      {paginatedLeads.map((lead) => (
                        <tr
                          key={lead.id}
                          onClick={() => {
                            setSelectedLead(lead);
                            setIsDrawerOpen(true);
                          }}
                          className="hover:bg-[#F4EFE8]/70 transition-colors cursor-pointer"
                        >
                          <td className="py-4 px-6 font-heading font-bold text-sm text-[#343434]">
                            {lead.name}
                          </td>
                          <td className="py-4 px-6 text-[#6F6A63]">
                            {lead.email}
                          </td>
                          <td className="py-4 px-6 font-bold text-[#4A3728]">
                            {lead.budget}
                          </td>
                          <td className="py-4 px-6 text-[#6F6A63] max-w-xs truncate" title={lead.message}>
                            {lead.message}
                          </td>
                          <td className="py-4 px-6 text-[#6F6A63] text-[11px]">
                            {formatDate(lead.created_at)}
                          </td>
                          <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={lead.status}
                              disabled={updatingId === lead.id}
                              onChange={(e) => requestStatusChange(lead, e.target.value)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${getStatusBadgeClass(lead.status)}`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <Pagination
                currentPage={currentPage}
                totalItems={filteredLeads.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
}

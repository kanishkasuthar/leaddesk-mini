import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import Pagination from '../components/Pagination';
import LeadDrawer from '../components/LeadDrawer';
import CommandPalette from '../components/CommandPalette';
import QuoteBanner from '../components/QuoteBanner';
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
  X,
  LayoutGrid,
  List,
  Sparkles,
  RotateCcw,
  ChevronRight,
  LogOut,
  UserCheck,
  Clock,
  PlusCircle,
  Eye,
  Shield,
  Zap,
  ArrowRight,
  Trash2,
  Edit,
  ArrowUpDown,
  ArrowDown,
  ArrowUp
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function AdminPanel() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const leadListRef = useRef(null);

  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, activeCount: 0, inactiveCount: 0, todayCount: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [lastLoginTime, setLastLoginTime] = useState('');

  // Sorting state
  const [sortField, setSortField] = useState('date'); // 'date' | 'name'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Current admin session
  const adminUser = authService.getAdmin();

  // Set initial last login time
  useEffect(() => {
    const now = new Date();
    setLastLoginTime(new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(now));
  }, []);

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

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    leadId: null,
    leadName: '',
    isLoading: false
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    const adminName = adminUser?.name || 'Administrator';
    if (hour < 12) return `Good Morning, ${adminName}.`;
    if (hour < 17) return `Good Afternoon, ${adminName}.`;
    return `Good Evening, ${adminName}.`;
  };

  const handleLogout = () => {
    authService.logout();
    setToast({ message: 'Logged out successfully.', type: 'success' });
    navigate('/login');
  };

  const scrollToLeads = () => {
    if (leadListRef.current) {
      leadListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
  }, [searchQuery, statusFilter, sortField, sortOrder]);

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

        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: targetStatus, updated_at: new Date().toISOString() } : l));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(prev => ({ ...prev, status: targetStatus, updated_at: new Date().toISOString() }));
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

  const requestDeleteLead = (e, lead) => {
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      leadId: lead.id,
      leadName: lead.name,
      isLoading: false
    });
  };

  const executeDeleteLead = async () => {
    const { leadId } = deleteModal;
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await leadService.deleteLead(leadId);
      if (response.success) {
        setToast({ message: 'Opportunity removed successfully.', type: 'success' });
        setLeads(prev => prev.filter(l => l.id !== leadId));
        if (selectedLead && selectedLead.id === leadId) setSelectedLead(null);
        
        const statsRes = await leadService.getStats();
        if (statsRes.success) setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Delete error:', error);
      setToast({ message: 'Failed to delete opportunity.', type: 'error' });
    } finally {
      setDeleteModal({ isOpen: false, leadId: null, leadName: '', isLoading: false });
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
    let result = leads.filter(lead => {
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

    result.sort((a, b) => {
      if (sortField === 'name') {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (sortOrder === 'asc') return nameA.localeCompare(nameB);
        return nameB.localeCompare(nameA);
      } else {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        if (sortOrder === 'asc') return dateA - dateB;
        return dateB - dateA;
      }
    });

    return result;
  }, [leads, searchQuery, statusFilter, sortField, sortOrder]);

  // Latest 5 Recent Leads
  const recentLeads = useMemo(() => {
    return [...leads].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  }, [leads]);

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'name' ? 'asc' : 'desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-[#6F6A63]/50" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-[#4A3728]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#4A3728]" />;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Contacted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Closed':
        return 'bg-[#4A3728] text-[#CDAA7D] border-[#34261C]';
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

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Opportunity"
        message={`Are you sure you want to permanently delete the opportunity for ${deleteModal.leadName}? This action cannot be undone.`}
        targetStatus="Delete"
        isLoading={deleteModal.isLoading}
        onConfirm={executeDeleteLead}
        onCancel={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
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

      <main className="flex-grow pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Executive Header Bar */}
        <div className="grid lg:grid-cols-12 gap-6 items-end border-b border-[#E5DDD3] pb-6">
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#4A3728]">Executive Workspace</span>
              {adminUser && (
                <span className="text-[11px] font-semibold text-[#5E7A5D] bg-[#5E7A5D]/10 border border-[#5E7A5D]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span>Authenticated Session</span>
                </span>
              )}
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#343434]">
              {getGreeting()}
            </h1>
            <p className="text-[#6F6A63] text-sm">
              Here's your executive lead intelligence overview.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col items-end gap-3">
            <QuoteBanner />
          </div>
        </div>

        {/* 4 Statistics KPI Cards */}
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

        {/* Executive Admin Profile, Last Login & Quick Actions Grid */}
        <div className="grid lg:grid-cols-12 gap-6">

          {/* Logged-in Admin Card & Quick Actions (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-5 sandstone-card p-6 border border-[#E5DDD3] shadow-sandstone flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              
              {/* Profile Card Header */}
              <div className="flex items-center justify-between border-b border-[#E5DDD3] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[16px] bg-[#4A3728] text-[#CDAA7D] flex items-center justify-center font-bold text-lg shadow-espresso">
                    {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-[#343434]">
                      {adminUser?.name || 'Administrator'}
                    </h3>
                    <p className="text-xs text-[#6F6A63] font-medium">{adminUser?.email || 'admin@leaddesk.com'}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-[#CDAA7D]/20 text-[#4A3728] text-[10px] font-bold uppercase tracking-wider border border-[#CDAA7D]/40 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#4A3728]" />
                  <span>Executive</span>
                </span>
              </div>

              {/* Last Login Info Box */}
              <div className="p-3.5 rounded-[14px] bg-[#F4EFE8] border border-[#E5DDD3] space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#6F6A63]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#4A3728]" />
                    <span>Last Login Activity</span>
                  </span>
                  <span className="text-[#5E7A5D] font-bold">Active Session</span>
                </div>
                <p className="text-xs font-semibold text-[#343434]">
                  {lastLoginTime || 'Today, Active'}
                </p>
              </div>

            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6F6A63]">Quick Actions</p>
              
              <div className="grid grid-cols-3 gap-2">
                
                {/* Action 1: Add Lead */}
                <button
                  type="button"
                  onClick={() => navigate('/#contact')}
                  className="flex flex-col items-center justify-center p-3 rounded-[14px] bg-[#4A3728] hover:bg-[#34261C] text-white text-xs font-bold shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                  <PlusCircle className="w-4 h-4 text-[#CDAA7D] mb-1" />
                  <span className="text-[11px]">Add Lead</span>
                </button>

                {/* Action 2: View Leads */}
                <button
                  type="button"
                  onClick={scrollToLeads}
                  className="flex flex-col items-center justify-center p-3 rounded-[14px] bg-[#F4EFE8] hover:bg-[#ECE4DA] text-[#4A3728] border border-[#E5DDD3] text-xs font-bold shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                  <Eye className="w-4 h-4 text-[#4A3728] mb-1" />
                  <span className="text-[11px]">View Leads</span>
                </button>

                {/* Action 3: Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex flex-col items-center justify-center p-3 rounded-[14px] bg-[#A04E45]/10 hover:bg-[#A04E45]/20 text-[#A04E45] border border-[#A04E45]/30 text-xs font-bold shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                  <LogOut className="w-4 h-4 text-[#A04E45] mb-1" />
                  <span className="text-[11px]">Logout</span>
                </button>

              </div>
            </div>

          </motion.div>

          {/* Recent Leads Widget (Latest 5 Leads - 7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="lg:col-span-7 sandstone-card p-6 border border-[#E5DDD3] shadow-sandstone flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#E5DDD3] pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#4A3728]" />
                  <h3 className="font-heading font-extrabold text-base text-[#343434]">Recent Leads</h3>
                </div>
                <span className="text-[11px] text-[#6F6A63] font-semibold">Latest 5 Captured Opportunities</span>
              </div>

              {isLoading ? (
                <div className="space-y-3 py-2">
                  <div className="h-12 rounded-[12px] bg-[#F4EFE8] animate-pulse" />
                  <div className="h-12 rounded-[12px] bg-[#F4EFE8] animate-pulse" />
                  <div className="h-12 rounded-[12px] bg-[#F4EFE8] animate-pulse" />
                </div>
              ) : recentLeads.length === 0 ? (
                <p className="text-xs text-[#6F6A63] py-6 text-center">No recent leads captured yet.</p>
              ) : (
                <div className="divide-y divide-[#E5DDD3]/60">
                  {recentLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsDrawerOpen(true);
                      }}
                      className="py-2.5 flex items-center justify-between hover:bg-[#F4EFE8]/70 px-2 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-xs text-[#343434] group-hover:text-[#4A3728]">
                            {lead.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getStatusBadgeClass(lead.status)}`}>
                            {lead.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6F6A63] truncate max-w-xs">{lead.email}</p>
                      </div>

                      <div className="flex items-center gap-2 text-right">
                        <div>
                          <span className="text-xs font-bold text-[#4A3728] block">{lead.budget}</span>
                          <span className="text-[10px] text-[#6F6A63]">{formatDate(lead.created_at)}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#6F6A63] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={scrollToLeads}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A3728] hover:underline"
              >
                <span>View Full Opportunities List ({leads.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* Search & Controls */}
        <div ref={leadListRef} className="sandstone-card p-4 border border-[#E5DDD3] shadow-sandstone flex flex-col md:flex-row items-center justify-between gap-4">
          
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
                      className="sandstone-card p-6 border border-[#E5DDD3] shadow-sandstone hover:border-[#4A3728]/40 cursor-pointer flex flex-col justify-between space-y-4 group transition-all relative"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#CDAA7D]/20 text-[#4A3728] font-bold flex items-center justify-center border border-[#CDAA7D]/40 text-xs">
                              {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6A63]">#{lead.id}</span>
                          </div>
                          
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

                      <div className="pt-3 border-t border-[#E5DDD3] flex items-center justify-between text-xs mt-2">
                        <span className="font-bold text-[#4A3728]">{lead.budget}</span>
                        <div className="text-right">
                          <div className="text-[10px] text-[#6F6A63]">Created: {formatDate(lead.created_at)}</div>
                          {lead.updated_at && lead.updated_at !== lead.created_at && (
                            <div className="text-[9px] text-[#6F6A63]/70">Updated: {formatDate(lead.updated_at)}</div>
                          )}
                        </div>
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute top-6 right-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-[#E5DDD3] p-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                            setIsDrawerOpen(true);
                          }}
                          className="p-1.5 text-[#5E7A5D] hover:bg-[#5E7A5D]/10 rounded-md transition-colors"
                          title="Edit Lead"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => requestDeleteLead(e, lead)}
                          className="p-1.5 text-[#A04E45] hover:bg-[#A04E45]/10 rounded-md transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F4EFE8] border-b border-[#E5DDD3] text-[#6F6A63] font-bold uppercase tracking-wider">
                        <th className="py-4 px-6 cursor-pointer hover:bg-[#E5DDD3]/50 transition-colors" onClick={() => handleSort('name')}>
                          <div className="flex items-center gap-2">
                            Name {getSortIcon('name')}
                          </div>
                        </th>
                        <th className="py-4 px-6">Email / Budget</th>
                        <th className="py-4 px-6">Message</th>
                        <th className="py-4 px-6 cursor-pointer hover:bg-[#E5DDD3]/50 transition-colors" onClick={() => handleSort('date')}>
                          <div className="flex items-center gap-2">
                            Date {getSortIcon('date')}
                          </div>
                        </th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
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
                          className="hover:bg-[#F4EFE8]/70 transition-colors cursor-pointer group"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#CDAA7D]/20 text-[#4A3728] font-bold flex items-center justify-center border border-[#CDAA7D]/40 text-xs flex-shrink-0">
                                {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                              </div>
                              <div className="font-heading font-bold text-sm text-[#343434] group-hover:text-[#4A3728] transition-colors">
                                {lead.name}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-[#6F6A63] mb-1">{lead.email}</div>
                            <div className="font-bold text-[#4A3728]">{lead.budget}</div>
                          </td>
                          <td className="py-4 px-6 text-[#6F6A63] max-w-[200px] truncate" title={lead.message}>
                            {lead.message}
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-[#6F6A63] text-[11px] mb-1">
                              <span className="font-semibold">Created:</span> {formatDate(lead.created_at)}
                            </div>
                            {lead.updated_at && lead.updated_at !== lead.created_at && (
                              <div className="text-[10px] text-[#6F6A63]/70">
                                <span className="font-semibold">Updated:</span> {formatDate(lead.updated_at)}
                              </div>
                            )}
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
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLead(lead);
                                  setIsDrawerOpen(true);
                                }}
                                className="p-1.5 text-[#5E7A5D] hover:bg-[#5E7A5D]/10 rounded-md transition-colors"
                                title="Edit Lead"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => requestDeleteLead(e, lead)}
                                className="p-1.5 text-[#A04E45] hover:bg-[#A04E45]/10 rounded-md transition-colors"
                                title="Delete Lead"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FrontendRoutes } from "@/lib/api/FrontendRoutes";
import { useAuth } from "@/lib/api/auth/authContext";
import * as ls from "@/lib/api/services/Loan.Service";

// Toast notification component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

type TabType = "loans" | "disbursements" | "applications" | "products";

export default function AdminLoans() {
  const { user } = useAuth();

  // Active tab
  const [activeTab, setActiveTab] = useState<TabType>("loans");

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Loans state
  const [loans, setLoans] = useState<ls.PaginatedLoans | null>(null);
  const [loansLoading, setLoansLoading] = useState(false);
  const [loanFilters, setLoanFilters] = useState<ls.LoanFilters>({ page: 1 });
  const [loanSearch, setLoanSearch] = useState("");

  // Disbursements state
  const [disbursements, setDisbursements] = useState<ls.PaginatedDisbursementQueue | null>(null);
  const [disbursementsLoading, setDisbursementsLoading] = useState(false);
  const [disbursementFilters, setDisbursementFilters] = useState<ls.DisbursementQueueFilter>({});
  const [disbursementStats, setDisbursementStats] = useState<ls.DisbursementStatistics | null>(null);
  const [selectedDisbursements, setSelectedDisbursements] = useState<Set<string>>(new Set());

  // Applications state
  const [applications, setApplications] = useState<ls.PaginatedLoanApplications | null>(null);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationFilters, setApplicationFilters] = useState<ls.LoanApplicationFilters>({ page: 1 });

  // Products state
  const [products, setProducts] = useState<ls.PaginatedLoanProducts | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productFilters, setProductFilters] = useState<ls.LoanProductFilters>({ page: 1 });

  // Modals
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<ls.Loan | null>(null);
  const [showDisbursementModal, setShowDisbursementModal] = useState(false);
  const [selectedDisbursement, setSelectedDisbursement] = useState<ls.DisbursementQueue | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ls.LoanApplication | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === "loans") {
      loadLoans();
    } else if (activeTab === "disbursements") {
      loadDisbursements();
      loadDisbursementStats();
    } else if (activeTab === "applications") {
      loadApplications();
    } else if (activeTab === "products") {
      loadProducts();
    }
  }, [activeTab, loanFilters, disbursementFilters, applicationFilters, productFilters]);

  // Loans functions
  const loadLoans = async () => {
    try {
      setLoansLoading(true);
      const data = await ls.LoanService.getLoans(loanFilters);
      setLoans(data);
    } catch (error) {
      console.error("Failed to load loans:", error);
      showToast("Failed to load loans", "error");
    } finally {
      setLoansLoading(false);
    }
  };

  const viewLoanDetails = async (loanId: string) => {
    try {
      setActionLoading(true);
      const loan = await ls.LoanService.getLoan(loanId);
      setSelectedLoan(loan);
      setShowLoanModal(true);
    } catch (error) {
      console.error("Failed to load loan details:", error);
      showToast("Failed to load loan details", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const addLoanToDisbursementQueue = async (loanId: string, method: ls.DisbursementMethodEnum = ls.DisbursementMethodEnum.WALLET) => {
    try {
      setActionLoading(true);
      await ls.DisbursementService.addToQueue({ loan_id: loanId, method });
      showToast("Loan added to disbursement queue successfully", "success");
      setShowLoanModal(false);
      loadDisbursements();
      loadDisbursementStats();
    } catch (error: any) {
      console.error("Failed to add loan to queue:", error);
      showToast(error?.response?.data?.message || "Failed to add loan to queue", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Disbursements functions
  const loadDisbursements = async () => {
    try {
      setDisbursementsLoading(true);
      const data = await ls.DisbursementService.getDisbursements(disbursementFilters);
      setDisbursements(data);
    } catch (error) {
      console.error("Failed to load disbursements:", error);
      showToast("Failed to load disbursements", "error");
    } finally {
      setDisbursementsLoading(false);
    }
  };

  const loadDisbursementStats = async () => {
    try {
      const response = await ls.DisbursementService.getStatistics();
      setDisbursementStats(response.statistics);
    } catch (error) {
      console.error("Failed to load disbursement stats:", error);
    }
  };

  const viewDisbursementDetails = async (id: string) => {
    try {
      setActionLoading(true);
      const disbursement = disbursements?.results.find(d => d.id === id);
      if (disbursement) {
        setSelectedDisbursement(disbursement);
        setShowDisbursementModal(true);
      }
    } catch (error) {
      console.error("Failed to load disbursement details:", error);
      showToast("Failed to load disbursement details", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const processDisbursement = async (id: string) => {
    if (!confirm("Are you sure you want to process this disbursement? This action cannot be undone.")) {
      return;
    }

    try {
      setActionLoading(true);
      await ls.DisbursementService.processDisbursement(id, { confirm: true });
      showToast("Disbursement processed successfully", "success");
      setShowDisbursementModal(false);
      loadDisbursements();
      loadDisbursementStats();
      loadLoans();
    } catch (error: any) {
      console.error("Failed to process disbursement:", error);
      showToast(error?.response?.data?.message || "Failed to process disbursement", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelDisbursement = async (id: string, reason: string) => {
    try {
      setActionLoading(true);
      await ls.DisbursementService.cancelDisbursement(id, { reason });
      showToast("Disbursement cancelled successfully", "success");
      setShowDisbursementModal(false);
      loadDisbursements();
      loadDisbursementStats();
    } catch (error: any) {
      console.error("Failed to cancel disbursement:", error);
      showToast(error?.response?.data?.message || "Failed to cancel disbursement", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const bulkProcessDisbursements = async () => {
    if (selectedDisbursements.size === 0) {
      showToast("Please select disbursements to process", "info");
      return;
    }

    if (!confirm(`Are you sure you want to process ${selectedDisbursements.size} disbursement(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await ls.DisbursementService.bulkProcessDisbursements({
        queue_entry_ids: Array.from(selectedDisbursements)
      });
      
      showToast(
        `Processed ${response.results.successful.length} disbursement(s). ${response.results.failed.length} failed.`,
        response.results.failed.length > 0 ? "error" : "success"
      );
      
      setSelectedDisbursements(new Set());
      loadDisbursements();
      loadDisbursementStats();
      loadLoans();
    } catch (error: any) {
      console.error("Failed to bulk process disbursements:", error);
      showToast(error?.response?.data?.message || "Failed to bulk process disbursements", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleDisbursementSelection = (id: string) => {
    const newSelection = new Set(selectedDisbursements);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedDisbursements(newSelection);
  };

  const toggleAllDisbursements = () => {
    if (!disbursements) return;
    
    const queuedDisbursements = disbursements.results.filter(
      d => d.status === ls.DisbursementQueueStatusEnum.QUEUED
    );
    
    if (selectedDisbursements.size === queuedDisbursements.length) {
      setSelectedDisbursements(new Set());
    } else {
      setSelectedDisbursements(new Set(queuedDisbursements.map(d => d.id)));
    }
  };

  // Applications functions
  const loadApplications = async () => {
    try {
      setApplicationsLoading(true);
      const data = await ls.LoanApplicationService.getLoanApplications(applicationFilters);
      setApplications(data);
    } catch (error) {
      console.error("Failed to load applications:", error);
      showToast("Failed to load applications", "error");
    } finally {
      setApplicationsLoading(false);
    }
  };

  const viewApplicationDetails = async (id: string) => {
    try {
      setActionLoading(true);
      const application = await ls.LoanApplicationService.getLoanApplication(id);
      setSelectedApplication(application);
      setShowApplicationModal(true);
    } catch (error) {
      console.error("Failed to load application details:", error);
      showToast("Failed to load application details", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const approveApplication = async (id: string) => {
    if (!confirm("Are you sure you want to approve this loan application?")) {
      return;
    }

    try {
      setActionLoading(true);
      await ls.LoanApplicationService.approveLoanApplication(id);
      showToast("Application approved successfully", "success");
      setShowApplicationModal(false);
      loadApplications();
      loadLoans();
    } catch (error: any) {
      console.error("Failed to approve application:", error);
      showToast(error?.response?.data?.message || "Failed to approve application", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const rejectApplication = async (id: string) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      setActionLoading(true);
      await ls.LoanApplicationService.rejectLoanApplication(id, { rejection_reason: reason });
      showToast("Application rejected", "success");
      setShowApplicationModal(false);
      loadApplications();
    } catch (error: any) {
      console.error("Failed to reject application:", error);
      showToast(error?.response?.data?.message || "Failed to reject application", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Products functions
  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const data = await ls.LoanProductService.getLoanProducts(productFilters);
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
      showToast("Failed to load products", "error");
    } finally {
      setProductsLoading(false);
    }
  };

  // Utility functions
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatInterestRate = (rate: string | number) => {
    const numRate = typeof rate === 'string' ? parseFloat(rate) : rate;
    return `${(numRate * 100).toFixed(2)}%`;
  };

  const getStatusColor = (status: ls.LoanStatus) => {
    switch (status) {
      case "ACTIVE": return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "PAID": return "bg-green-100 text-green-800 border border-green-200";
      case "DEFAULTED": return "bg-red-100 text-red-800 border border-red-200";
      case "UNDISBURSED": return "bg-amber-100 text-amber-800 border border-amber-200";
      case "CANCELLED": return "bg-gray-100 text-gray-800 border border-gray-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getApplicationStatusColor = (status: ls.ApplicationStatus) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "APPROVED": return "bg-green-100 text-green-800 border border-green-200";
      case "REJECTED": return "bg-red-100 text-red-800 border border-red-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getDisbursementStatusColor = (status: ls.DisbursementQueueStatusEnum) => {
    switch (status) {
      case ls.DisbursementQueueStatusEnum.QUEUED: return "bg-blue-100 text-blue-800 border border-blue-200";
      case ls.DisbursementQueueStatusEnum.PROCESSING: return "bg-purple-100 text-purple-800 border border-purple-200";
      case ls.DisbursementQueueStatusEnum.DISBURSED: return "bg-green-100 text-green-800 border border-green-200";
      case ls.DisbursementQueueStatusEnum.CANCELLED: return "bg-gray-100 text-gray-800 border border-gray-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getRepaymentStatusColor = (status: ls.RepaymentStatus) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800 border border-green-200";
      case "PENDING": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "OVERDUE": return "bg-red-100 text-red-800 border border-red-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const filteredLoans = loans?.results.filter(loan => {
    const searchLower = loanSearch.toLowerCase();
    return (
      loan.user.first_name.toLowerCase().includes(searchLower) ||
      loan.user.last_name.toLowerCase().includes(searchLower) ||
      loan.user.email.toLowerCase().includes(searchLower) ||
      loan.id.toLowerCase().includes(searchLower)
    );
  });

  // Calculate loan statistics
  const loanStats = {
    total: loans?.count || 0,
    active: loans?.results.filter(l => l.status === "ACTIVE").length || 0,
    overdue: loans?.results.filter(l => l.repayments.some(r => r.status === "OVERDUE")).length || 0,
    defaulted: loans?.results.filter(l => l.status === "DEFAULTED").length || 0,
    undisbursed: loans?.results.filter(l => l.status === "UNDISBURSED").length || 0,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Loan Management Dashboard
          </h1>
          <p className="text-gray-600">Comprehensive loan and disbursement management system</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-2">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: "loans" as TabType, label: "Loans", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { key: "disbursements" as TabType, label: "Disbursements", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
              { key: "applications" as TabType, label: "Applications", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { key: "products" as TabType, label: "Products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-teal-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loans Tab */}
        {activeTab === "loans" && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-teal-500 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Loans</p>
                    <p className="text-3xl font-bold text-gray-900">{loanStats.total}</p>
                  </div>
                  <div className="bg-teal-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-emerald-500 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active</p>
                    <p className="text-3xl font-bold text-gray-900">{loanStats.active}</p>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-500 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Undisbursed</p>
                    <p className="text-3xl font-bold text-gray-900">{loanStats.undisbursed}</p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Overdue</p>
                    <p className="text-3xl font-bold text-gray-900">{loanStats.overdue}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Defaulted</p>
                    <p className="text-3xl font-bold text-gray-900">{loanStats.defaulted}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, email, or loan ID..."
                      value={loanSearch}
                      onChange={(e) => setLoanSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Status Filter */}
                <select
                  value={loanFilters.status || ""}
                  onChange={(e) => setLoanFilters({ ...loanFilters, status: e.target.value || undefined, page: 1 })}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="UNDISBURSED">Undisbursed</option>
                  <option value="PAID">Paid</option>
                  <option value="DEFAULTED">Defaulted</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                {/* Overdue Filter */}
                <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={loanFilters.is_overdue || false}
                    onChange={(e) => setLoanFilters({ ...loanFilters, is_overdue: e.target.checked || undefined, page: 1 })}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Overdue Only</span>
                </label>
              </div>
            </div>

            {/* Loans Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loansLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
              ) : filteredLoans && filteredLoans.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Borrower</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Principal</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Payable</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Balance</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Progress</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Date</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLoans.map((loan) => (
                          <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 shrink-0">
                                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold">
                                    {loan.user.first_name[0]}{loan.user.last_name[0]}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {loan.user.first_name} {loan.user.last_name}
                                  </div>
                                  <div className="text-xs text-gray-500">{loan.user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(loan.principal_amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(loan.total_payable)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(loan.remaining_balance)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-20 bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div
                                    className="bg-linear-to-r from-teal-500 to-emerald-500 h-2.5 rounded-full transition-all"
                                    style={{ width: `${loan.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{loan.progress}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                                {loan.status_display}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(loan.end_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => viewLoanDetails(loan.id)}
                                className="text-teal-600 hover:text-teal-900 font-semibold transition-colors"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {loans && (loans.next || loans.previous) && (
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => setLoanFilters({ ...loanFilters, page: (loanFilters.page || 1) - 1 })}
                          disabled={!loans.previous}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setLoanFilters({ ...loanFilters, page: (loanFilters.page || 1) + 1 })}
                          disabled={!loans.next}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Page <span className="font-medium">{loanFilters.page || 1}</span> - Total: <span className="font-medium">{loans.count}</span> loans
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setLoanFilters({ ...loanFilters, page: (loanFilters.page || 1) - 1 })}
                            disabled={!loans.previous}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setLoanFilters({ ...loanFilters, page: (loanFilters.page || 1) + 1 })}
                            disabled={!loans.next}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No loans found</h3>
                  <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search term.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Disbursements Tab */}
        {activeTab === "disbursements" && (
          <>
            {/* Disbursement Statistics */}
            {disbursementStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold opacity-90">Total Disbursed</h3>
                    <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold mb-2">{formatCurrency(disbursementStats.total_disbursed.amount)}</p>
                  <p className="text-sm opacity-80">{disbursementStats.total_disbursed.count} disbursements</p>
                </div>

                <div className="bg-linear-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold opacity-90">Pending</h3>
                    <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold mb-2">{formatCurrency(disbursementStats.pending.amount)}</p>
                  <p className="text-sm opacity-80">{disbursementStats.pending.count} in queue</p>
                </div>

                <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold opacity-90">Today</h3>
                    <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold mb-2">{formatCurrency(disbursementStats.today.amount)}</p>
                  <p className="text-sm opacity-80">{disbursementStats.today.count} disbursements</p>
                </div>
              </div>
            )}

            {/* Filters and Bulk Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                  {/* Status Filter */}
                  <select
                    value={disbursementFilters.status || ""}
                    onChange={(e) => setDisbursementFilters({ ...disbursementFilters, status: e.target.value as ls.DisbursementQueueStatusEnum || undefined })}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Status</option>
                    <option value={ls.DisbursementQueueStatusEnum.QUEUED}>Queued</option>
                    <option value={ls.DisbursementQueueStatusEnum.PROCESSING}>Processing</option>
                    <option value={ls.DisbursementQueueStatusEnum.DISBURSED}>Disbursed</option>
                    <option value={ls.DisbursementQueueStatusEnum.CANCELLED}>Cancelled</option>
                  </select>

                  {/* Method Filter */}
                  <select
                    value={disbursementFilters.method || ""}
                    onChange={(e) => setDisbursementFilters({ ...disbursementFilters, method: e.target.value as ls.DisbursementMethodEnum || undefined })}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Methods</option>
                    <option value={ls.DisbursementMethodEnum.WALLET}>Wallet</option>
                    <option value={ls.DisbursementMethodEnum.BANK}>Bank</option>
                    <option value={ls.DisbursementMethodEnum.MANUAL}>Manual</option>
                  </select>

                  {/* Search */}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search by name, email, or notes..."
                      value={disbursementFilters.search || ""}
                      onChange={(e) => setDisbursementFilters({ ...disbursementFilters, search: e.target.value || undefined })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedDisbursements.size > 0 && (
                  <div className="flex gap-2">
                    <span className="px-4 py-2.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                      {selectedDisbursements.size} selected
                    </span>
                    <button
                      onClick={bulkProcessDisbursements}
                      disabled={actionLoading}
                      className="px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Process</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Disbursements Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {disbursementsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
              ) : disbursements && disbursements.results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Loan</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Borrower</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Added By</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {disbursements.results.map((d) => (
                        <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedDisbursements.has(d.id)}
                              onChange={() => toggleDisbursementSelection(d.id)}
                              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.loan.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{d.loan.user.first_name} {d.loan.user.last_name}</div>
                            <div className="text-xs text-gray-500">{d.loan.user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(d.amount)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{d.method_display || d.method}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDisbursementStatusColor(d.status)}`}>
                              {d.status_display}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{d.added_by?.first_name} {d.added_by?.last_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(d.created_at)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                            <button onClick={() => viewDisbursementDetails(d.id)} className="text-teal-600 hover:text-teal-900">View</button>
                            {d.status === ls.DisbursementQueueStatusEnum.QUEUED && (
                              <>
                                <button onClick={() => processDisbursement(d.id)} disabled={actionLoading} className="text-green-600 hover:text-green-800">Process</button>
                                <button onClick={() => { const reason = prompt('Reason for cancelling:'); if (reason) cancelDisbursement(d.id, reason); }} disabled={actionLoading} className="text-red-600 hover:text-red-800">Cancel</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No disbursements found</h3>
                  <p className="mt-2 text-sm text-gray-500">Try adjusting your filters.</p>
                </div>
              )}
            </div>

          </>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            {applicationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
              </div>
            ) : applications && applications.results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applicant</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applied</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.results.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{a.user.first_name} {a.user.last_name}</div>
                          <div className="text-xs text-gray-500">{a.user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{a.product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(a.amount_requested)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getApplicationStatusColor(a.status)}`}>
                            {a.status_display}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(a.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                          <button onClick={() => viewApplicationDetails(a.id)} className="text-teal-600 hover:text-teal-900">View</button>
                          {a.status === "PENDING" && (
                            <>
                              <button onClick={() => approveApplication(a.id)} className="text-green-600 hover:text-green-800">Approve</button>
                              <button onClick={() => rejectApplication(a.id)} className="text-red-600 hover:text-red-800">Reject</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No applications found</h3>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
              </div>
            ) : products && products.results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Interest</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Min / Max</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tenure Range</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.results.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatInterestRate(p.interest_rate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(p.min_amount)} - {formatCurrency(p.max_amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.min_tenure_months} - {p.max_tenure_months} months</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.risk_level_display}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Simple Modals (Loan / Disbursement / Application) */}
      {showLoanModal && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">Loan Details</h3>
              <button onClick={() => setShowLoanModal(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3">
              <div><strong>Borrower:</strong> {selectedLoan.user.first_name} {selectedLoan.user.last_name} ({selectedLoan.user.email})</div>
              <div><strong>Principal:</strong> {formatCurrency(selectedLoan.principal_amount)}</div>
              <div><strong>Total Payable:</strong> {formatCurrency(selectedLoan.total_payable)}</div>
              <div><strong>Remaining:</strong> {formatCurrency(selectedLoan.remaining_balance)}</div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => addLoanToDisbursementQueue(selectedLoan.id)} disabled={actionLoading} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Add to Queue</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDisbursementModal && selectedDisbursement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">Disbursement Details</h3>
              <button onClick={() => setShowDisbursementModal(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3">
              <div><strong>Loan:</strong> {selectedDisbursement.loan.id}</div>
              <div><strong>Amount:</strong> {formatCurrency(selectedDisbursement.amount)}</div>
              <div><strong>Method:</strong> {selectedDisbursement.method_display}</div>
              <div><strong>Notes:</strong> {selectedDisbursement.notes || '—'}</div>
              <div className="mt-4 flex gap-2">
                {selectedDisbursement.status === ls.DisbursementQueueStatusEnum.QUEUED && (
                  <>
                    <button onClick={() => processDisbursement(selectedDisbursement.id)} disabled={actionLoading} className="px-4 py-2 bg-green-600 text-white rounded-lg">Process</button>
                    <button onClick={() => { const reason = prompt('Reason for cancelling:'); if (reason) cancelDisbursement(selectedDisbursement.id, reason); }} disabled={actionLoading} className="px-4 py-2 bg-red-600 text-white rounded-lg">Cancel</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showApplicationModal && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">Application Details</h3>
              <button onClick={() => setShowApplicationModal(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3">
              <div><strong>Applicant:</strong> {selectedApplication.user.first_name} {selectedApplication.user.last_name}</div>
              <div><strong>Product:</strong> {selectedApplication.product.name}</div>
              <div><strong>Amount Requested:</strong> {formatCurrency(selectedApplication.amount_requested)}</div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => approveApplication(selectedApplication.id)} disabled={actionLoading} className="px-4 py-2 bg-green-600 text-white rounded-lg">Approve</button>
                <button onClick={() => rejectApplication(selectedApplication.id)} disabled={actionLoading} className="px-4 py-2 bg-red-600 text-white rounded-lg">Reject</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
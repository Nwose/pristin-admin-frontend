"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/api/auth/authContext";
import * as ls from "@/lib/api/services/Loan.Service";

export default function AdminLoans() {
  const { user } = useAuth();
  
  // State Management
  const [loans, setLoans] = useState<ls.PaginatedLoans | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<ls.Loan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "overdue" | "defaulted">("all");
  
  // Filters
  const [filters, setFilters] = useState<ls.LoanFilters>({
    page: 1,
  });

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    overdue: 0,
    defaulted: 0,
    totalDisbursed: "0",
    totalRepaid: "0",
  });

  // Load loans
  useEffect(() => {
    loadLoans();
  }, [filters]);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const data = await ls.LoanService.getLoans(filters);
      setLoans(data);
      calculateStats(data.results);
    } catch (error) {
      console.error("Failed to load loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (loanList: ls.Loan[]) => {
    const active = loanList.filter(l => l.status === "ACTIVE").length;
    const overdue = loanList.filter(l => 
      l.repayments.some(r => r.status === "OVERDUE")
    ).length;
    const defaulted = loanList.filter(l => l.status === "DEFAULTED").length;
    
    const totalDisbursed = loanList.reduce((sum, l) => 
      sum + parseFloat(l.principal_amount || "0"), 0
    );
    
    const totalRepaid = loanList.reduce((sum, l) => {
      const paid = parseFloat(l.principal_amount || "0") - parseFloat(l.remaining_balance || "0");
      return sum + paid;
    }, 0);

    setStats({
      total: loanList.length,
      active,
      overdue,
      defaulted,
      totalDisbursed: totalDisbursed.toFixed(2),
      totalRepaid: totalRepaid.toFixed(2),
    });
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    const newFilters: ls.LoanFilters = { page: 1 };
    
    if (tab === "active") newFilters.status = "ACTIVE";
    else if (tab === "overdue") newFilters.is_overdue = true;
    else if (tab === "defaulted") newFilters.status = "DEFAULTED";
    
    setFilters(newFilters);
  };

  const viewLoanDetails = async (loanId: string) => {
    try {
      setActionLoading(true);
      const loan = await ls.LoanService.getLoan(loanId);
      setSelectedLoan(loan);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to load loan details:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: ls.LoanStatus) => {
    switch (status) {
      case "ACTIVE": return "bg-teal-100 text-teal-800";
      case "PAID": return "bg-green-100 text-green-800";
      case "DEFAULTED": return "bg-red-100 text-red-800";
      case "UNDISBURSED": return "bg-yellow-100 text-yellow-800";
      case "CANCELLED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRepaymentStatusColor = (status: ls.RepaymentStatus) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "OVERDUE": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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

  const filteredLoans = loans?.results.filter(loan => {
    const searchLower = searchTerm.toLowerCase();
    return (
      loan.user.first_name.toLowerCase().includes(searchLower) ||
      loan.user.last_name.toLowerCase().includes(searchLower) ||
      loan.id.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Loan Management Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage and monitor all loans in the system</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-teal-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Loans</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-teal-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.overdue}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Defaulted</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.defaulted}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or loan ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Tab Filters */}
            <div className="flex gap-2 overflow-x-auto">
              {[
                { key: "all", label: "All Loans" },
                { key: "active", label: "Active" },
                { key: "overdue", label: "Overdue" },
                { key: "defaulted", label: "Defaulted" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key as typeof activeTab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          ) : filteredLoans && filteredLoans.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loan ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Borrower
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Principal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Payable
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLoans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {loan.id.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {loan.user.profile_picture ? (
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={loan.user.profile_picture}
                                  alt=""
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium">
                                  {loan.user.first_name[0]}{loan.user.last_name[0]}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {loan.user.first_name} {loan.user.last_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(loan.principal_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(loan.total_payable)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(loan.remaining_balance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-teal-600 h-2 rounded-full"
                                style={{ width: `${loan.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{loan.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                            {loan.status_display}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(loan.end_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => viewLoanDetails(loan.id)}
                            className="text-teal-600 hover:text-teal-900 transition-colors"
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
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                      disabled={!loans.previous}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                      disabled={!loans.next}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{filters.page || 1}</span> of loans
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                          disabled={!loans.previous}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                          disabled={!loans.next}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No loans found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>

      {/* Loan Details Modal */}
      {showModal && selectedLoan && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Loan Details</h3>
                    <p className="text-sm text-gray-500 mt-1">ID: {selectedLoan.id}</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Borrower Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Borrower Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        {selectedLoan.user.profile_picture ? (
                          <img
                            className="h-12 w-12 rounded-full"
                            src={selectedLoan.user.profile_picture}
                            alt=""
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium text-lg">
                            {selectedLoan.user.first_name[0]}{selectedLoan.user.last_name[0]}
                          </div>
                        )}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {selectedLoan.user.first_name} {selectedLoan.user.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{selectedLoan.user.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Loan Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Loan Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(selectedLoan.status)}`}>
                          {selectedLoan.status_display}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tenure:</span>
                        <span className="font-medium">{selectedLoan.tenure_months} months</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-medium">{selectedLoan.interest_rate}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <p className="text-xs text-teal-700 font-medium">Principal Amount</p>
                    <p className="text-lg font-bold text-teal-900 mt-1">
                      {formatCurrency(selectedLoan.principal_amount)}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium">Total Interest</p>
                    <p className="text-lg font-bold text-blue-900 mt-1">
                      {formatCurrency(selectedLoan.total_interest)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-700 font-medium">Total Payable</p>
                    <p className="text-lg font-bold text-purple-900 mt-1">
                      {formatCurrency(selectedLoan.total_payable)}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-xs text-orange-700 font-medium">Remaining Balance</p>
                    <p className="text-lg font-bold text-orange-900 mt-1">
                      {formatCurrency(selectedLoan.remaining_balance)}
                    </p>
                  </div>
                </div>

                {/* Repayment Schedule */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Repayment Schedule</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount Due</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Paid At</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedLoan.repayments.map((repayment) => (
                          <tr key={repayment.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">{formatDate(repayment.due_date)}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(repayment.amount_due)}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(repayment.amount_paid)}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRepaymentStatusColor(repayment.status)}`}>
                                {repayment.status_display}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {repayment.paid_at ? formatDate(repayment.paid_at) : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-gray-600">Start Date</p>
                      <p className="font-medium text-gray-900">{formatDate(selectedLoan.start_date)}</p>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="relative">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-teal-600 rounded-full transition-all duration-500"
                            style={{ width: `${selectedLoan.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-center mt-1 text-xs text-gray-600">{selectedLoan.progress}% Complete</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">End Date</p>
                      <p className="font-medium text-gray-900">{formatDate(selectedLoan.end_date)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                {selectedLoan.status === "UNDISBURSED" && (
                  <button
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  >
                    Disburse Loan
                  </button>
                )}
                {selectedLoan.status === "ACTIVE" && (
                  <>
                    <button
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                    >
                      Record Payment
                    </button>
                    <button
                      className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                    >
                      Send Reminder
                    </button>
                  </>
                )}
                {(selectedLoan.status === "ACTIVE" || selectedLoan.status === "UNDISBURSED") && (
                  <button
                    className="w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  >
                    Cancel Loan
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/api/auth/authContext";
import * as ls from "@/lib/api/services/Loan.Service";

export default function LoanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const loanId = params.id as string;

  const [loan, setLoan] = useState<ls.Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "repayments" | "application">("overview");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadLoanDetails();
  }, [loanId]);

  const loadLoanDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ls.LoanService.getLoan(loanId);
      setLoan(data);
    } catch (err: any) {
      setError(err.message || "Failed to load loan details");
    } finally {
      setLoading(false);
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
      month: 'long',
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

  const getStatusColor = (status: ls.LoanStatus) => {
    switch (status) {
      case "ACTIVE": return "bg-teal-100 text-teal-800 border-teal-200";
      case "PAID": return "bg-green-100 text-green-800 border-green-200";
      case "DEFAULTED": return "bg-red-100 text-red-800 border-red-200";
      case "UNDISBURSED": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELLED": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRepaymentStatusColor = (status: ls.RepaymentStatus) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800 border-green-200";
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "OVERDUE": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getApplicationStatusColor = (status: ls.ApplicationStatus) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-800 border-green-200";
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REJECTED": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getUpcomingRepayment = () => {
    if (!loan) return null;
    const upcoming = loan.repayments
      .filter(r => r.status === "PENDING" || r.status === "OVERDUE")
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];
    return upcoming;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading loan details...</p>
        </div>
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Failed to Load Loan</h2>
          <p className="mt-2 text-gray-600">{error || "Loan not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const upcomingRepayment = getUpcomingRepayment();
  const daysRemaining = calculateDaysRemaining(loan.end_date);
  const overdueRepayments = loan.repayments.filter(r => r.status === "OVERDUE").length;
  const paidRepayments = loan.repayments.filter(r => r.status === "PAID").length;
  const totalRepayments = loan.repayments.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors mb-4 group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Loans
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Loan Details</h1>
              <p className="text-gray-600 mt-1">Loan ID: {loan.id}</p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getStatusColor(loan.status)}`}>
              {loan.status_display}
            </span>
          </div>
        </div>

        {/* Alert for Overdue Payments */}
        {overdueRepayments > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {overdueRepayments} Overdue Payment{overdueRepayments > 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  This loan has overdue repayments that require immediate attention.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-teal-600 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Principal Amount</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(loan.principal_amount)}</p>
              </div>
              <div className="bg-teal-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-600 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Payable</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(loan.total_payable)}</p>
                <p className="text-xs text-gray-500 mt-1">Interest: {formatCurrency(loan.total_interest)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-600 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Remaining Balance</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(loan.remaining_balance)}</p>
                <p className="text-xs text-gray-500 mt-1">{paidRepayments}/{totalRepayments} payments made</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-600 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Interest Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{loan.interest_rate}%</p>
                <p className="text-xs text-gray-500 mt-1">{loan.tenure_months} months tenure</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Progress and Timeline Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Repayment Progress */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Repayment Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-sm font-bold text-teal-600">{loan.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-4 bg-linear-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${loan.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-2xl font-bold text-green-700">{paidRepayments}</p>
                  <p className="text-xs text-green-600 mt-1">Paid</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-2xl font-bold text-yellow-700">{totalRepayments - paidRepayments - overdueRepayments}</p>
                  <p className="text-xs text-yellow-600 mt-1">Pending</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-2xl font-bold text-red-700">{overdueRepayments}</p>
                  <p className="text-xs text-red-600 mt-1">Overdue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Payment */}
          <div className="bg-linear-to-br from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Next Payment
            </h3>
            {upcomingRepayment ? (
              <div>
                <p className="text-3xl font-bold mb-2">{formatCurrency(upcomingRepayment.amount_due)}</p>
                <p className="text-teal-100 text-sm mb-4">Due: {formatDate(upcomingRepayment.due_date)}</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${upcomingRepayment.status === "OVERDUE"
                    ? "bg-red-500 text-white"
                    : "bg-white/20 text-white"
                  }`}>
                  {upcomingRepayment.status_display}
                </div>
                {upcomingRepayment.status === "OVERDUE" && (
                  <p className="mt-3 text-sm text-red-100">⚠️ Payment is overdue</p>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-teal-100">All payments completed! 🎉</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline and Borrower Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Loan Timeline */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Timeline</h3>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 font-bold mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Start Date</p>
                  <p className="text-xs text-gray-600 mt-1">{formatDate(loan.start_date)}</p>
                </div>

                <div className="flex-1 px-4">
                  <div className="relative h-2 bg-gray-200 rounded-full">
                    <div
                      className="absolute h-2 bg-linear-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${loan.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-xs text-gray-600 mt-2">
                    {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Loan term ended'}
                  </p>
                </div>

                <div className="text-center flex-1">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${loan.status === "PAID" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                    } font-bold`}>
                    {loan.status === "PAID" ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900">End Date</p>
                  <p className="text-xs text-gray-600 mt-1">{formatDate(loan.end_date)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Borrower Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Borrower</h3>
            <div className="flex items-center mb-4">
              <div className="h-16 w-16 rounded-full bg-linear-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl border-2 border-teal-600">
                {loan.user.first_name[0]}{loan.user.last_name[0]}
              </div>
              <div className="ml-4">
                <p className="text-lg font-semibold text-gray-900">
                  {loan.user.first_name} {loan.user.last_name}
                </p>
                <p className="text-sm text-gray-500">ID: {loan.user.id.slice(0, 8)}...</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors font-medium text-sm">
              View Profile
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
          <div className="flex space-x-1 p-2">
            {[
              { key: "overview", label: "Overview", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { key: "repayments", label: "Repayment Schedule", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
              { key: "application", label: "Application Details", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.key
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {/* <div className="bg-white rounded-b-xl shadow-sm p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-lg mb-4">Loan Information</h4>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Loan ID:</span>
                    <span className="font-medium text-gray-900">{loan.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Principal Amount:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(loan.principal_amount)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-medium text-gray-900">{loan.interest_rate}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Interest:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(loan.total_interest)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Payable:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(loan.total_payable)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(loan.status)}`}>
                      {loan.status_display}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-lg mb-4">Dates & Duration</h4>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Tenure:</span>
                    <span className="font-medium text-gray-900">{loan.tenure_months} months</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium text-gray-900">{formatDate(loan.start_date)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">End Date 
        */}

      </div>
    </div>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/api/auth/authContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  LoanApplicationService,
  LoanProductService,
  LoanApplication,
  LoanApplicationFilters,
  ApplicationStatus,
  LoanProduct,
} from "@/lib/api/services/Loan.Service";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  X,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  DollarSign,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function LoanApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [viewingApplication, setViewingApplication] =
    useState<LoanApplication | null>(null);
  const [approvingApplication, setApprovingApplication] =
    useState<LoanApplication | null>(null);
  const [rejectingApplication, setRejectingApplication] =
    useState<LoanApplication | null>(null);

  // Form
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<LoanApplicationFilters>({
    page: 1,
    status: undefined,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    loadApplications();
  }, [filters]);

  const loadProducts = async () => {
    try {
      const response = await LoanProductService.getLoanProducts({
        is_active: true,
      });
      setProducts(response.results);
    } catch (err: any) {
      console.error("Failed to load products:", err);
    }
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await LoanApplicationService.getLoanApplications(
        filters
      );
      setApplications(response.results);
      setTotalCount(response.count);
      setTotalPages(Math.ceil(response.count / 10));
      setCurrentPage(filters.page || 1);

      // Calculate stats
      const pending = response.results.filter(
        (app) => app.status === "PENDING"
      ).length;
      const approved = response.results.filter(
        (app) => app.status === "APPROVED"
      ).length;
      const rejected = response.results.filter(
        (app) => app.status === "REJECTED"
      ).length;
      setStats({ pending, approved, rejected });
    } catch (err: any) {
      console.error("Failed to load applications:", err);
      toast.error(err?.message || "Failed to load loan applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveApplication = async () => {
    if (!approvingApplication) return;

    try {
      setIsProcessing(true);
      await LoanApplicationService.approveLoanApplication(
        approvingApplication.id
      );
      toast.success("Loan application approved successfully!");
      setApprovingApplication(null);
      loadApplications();
    } catch (err: any) {
      console.error("Approve error:", err);
      toast.error(err?.message || "Failed to approve application");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectApplication = async () => {
    if (!rejectingApplication) return;

    // Validate rejection reason
    if (!rejectionReason.trim()) {
      setRejectionError("Please provide a reason for rejection");
      return;
    }

    if (rejectionReason.trim().length < 10) {
      setRejectionError("Rejection reason must be at least 10 characters");
      return;
    }

    try {
      setIsProcessing(true);
      await LoanApplicationService.rejectLoanApplication(
        rejectingApplication.id,
        {
          reason: rejectionReason.trim(),
          application_id: rejectingApplication.id,
        }
      );
      toast.success("Loan application rejected");
      setRejectingApplication(null);
      setRejectionReason("");
      setRejectionError("");
      loadApplications();
    } catch (err: any) {
      console.error("Reject error:", err);

      // Handle backend errors
      if (err?.details && typeof err.details === "object") {
        const details = err.details as Record<string, any>;
        if (details.rejection_reason) {
          const errorMsg = Array.isArray(details.rejection_reason)
            ? details.rejection_reason[0]
            : details.rejection_reason;
          setRejectionError(errorMsg);
        } else {
          toast.error(err?.message || "Failed to reject application");
        }
      } else {
        toast.error(err?.message || "Failed to reject application");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleSearch = () => {
    setFilters({ ...filters, page: 1 });
    loadApplications();
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const applyFilters = () => {
    const newFilters: LoanApplicationFilters = {
      ...filters,
      page: 1,
      created_after: dateRange.start || undefined,
      created_before: dateRange.end || undefined,
    };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({ page: 1 });
    setDateRange({ start: "", end: "" });
    setSearchQuery("");
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "—";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      APPROVED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
    };

    const icons = {
      PENDING: Clock,
      APPROVED: CheckCircle,
      REJECTED: XCircle,
    };

    const Icon = icons[status];

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}
      >
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const openRejectModal = (application: LoanApplication) => {
    setRejectingApplication(application);
    setRejectionReason("");
    setRejectionError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Loan Applications
          </h1>
          <p className="mt-2 text-gray-600">
            Review and manage customer loan applications
          </p>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">
                    Pending Review
                  </p>
                  <p className="text-2xl font-bold text-yellow-900 mt-1">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Approved</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {stats.approved}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-900 mt-1">
                    {stats.rejected}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by applicant name or ID..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                showFilters
                  ? "bg-teal-50 border-teal-600 text-teal-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {(filters.status || dateRange.start || dateRange.end) && (
                <span className="bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={filters.status || ""}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          status: e.target.value || undefined,
                          page: 1,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product
                    </label>
                    <select
                      value={filters.product || ""}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          product: e.target.value || undefined,
                          page: 1,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">All Products</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, start: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, end: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Applications Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No loan applications found</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tenure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied On
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <motion.tr
                        key={application.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="shrink-0 h-10 w-10">
                              {application.user.profile_picture ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={application.user.profile_picture}
                                  alt=""
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                                  <User className="h-6 w-6 text-teal-600" />
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {application.user.first_name}{" "}
                                {application.user.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {application.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {application.product.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatAmount(application.amount_requested)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {application.tenure_months} months
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(application.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(application.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingApplication(application)}
                              className="text-gray-600 hover:text-gray-900"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {application.status === "PENDING" && (
                              <>
                                <button
                                  onClick={() =>
                                    setApprovingApplication(application)
                                  }
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => openRejectModal(application)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <strong>{(currentPage - 1) * 10 + 1}</strong> to{" "}
                  <strong>{Math.min(currentPage * 10, totalCount)}</strong> of{" "}
                  <strong>{totalCount}</strong> applications
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Details Modal */}
      <AnimatePresence>
        {viewingApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setViewingApplication(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Application Details
                </h2>
                <button
                  onClick={() => setViewingApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Banner */}
                <div
                  className={`rounded-lg p-4 ${
                    viewingApplication.status === "PENDING"
                      ? "bg-yellow-50 border border-yellow-200"
                      : viewingApplication.status === "APPROVED"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Application Status
                      </p>
                      <p className="text-lg font-bold mt-1">
                        {viewingApplication.status_display}
                      </p>
                    </div>
                    {getStatusBadge(viewingApplication.status)}
                  </div>
                </div>

                {/* Applicant Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Applicant Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      {viewingApplication.user.profile_picture ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={viewingApplication.user.profile_picture}
                          alt=""
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-teal-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {viewingApplication.user.first_name}{" "}
                          {viewingApplication.user.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          User ID: {viewingApplication.user.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Loan Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Product</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {viewingApplication.product.name}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Amount Requested</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {formatAmount(viewingApplication.amount_requested)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Tenure</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {viewingApplication.tenure_months} months
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Applied On</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {formatDate(viewingApplication.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Application Reason */}
                {viewingApplication.reason && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Reason for Application
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">
                        {viewingApplication.reason}
                      </p>
                    </div>
                  </div>
                )}

                {/* Review Information */}
                {(viewingApplication.reviewed_at ||
                  viewingApplication.rejection_reason) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Review Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {viewingApplication.reviewed_at && (
                        <div>
                          <p className="text-sm text-gray-500">Reviewed At</p>
                          <p className="text-gray-900 font-medium">
                            {formatDateTime(viewingApplication.reviewed_at)}
                          </p>
                        </div>
                      )}
                      {viewingApplication.reviewed_by && (
                        <div>
                          <p className="text-sm text-gray-500">Reviewed By</p>
                          <p className="text-gray-900 font-medium">
                            {viewingApplication.reviewed_by}
                          </p>
                        </div>
                      )}
                      {viewingApplication.rejection_reason && (
                        <div>
                          <p className="text-sm text-gray-500">
                            Rejection Reason
                          </p>
                          <p className="text-red-700 font-medium">
                            {viewingApplication.rejection_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => setViewingApplication(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Close
                </button>
                {viewingApplication.status === "PENDING" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        openRejectModal(viewingApplication);
                        setViewingApplication(null);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        setApprovingApplication(viewingApplication);
                        setViewingApplication(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approve Confirmation Modal */}
      <AnimatePresence>
        {approvingApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setApprovingApplication(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Approve Loan Application
                </h3>
              </div>
              <p className="text-gray-600 mb-2">
                Are you sure you want to approve this loan application?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-6 space-y-1 text-sm">
                <p>
                  <span className="text-gray-500">Applicant:</span>{" "}
                  <span className="font-medium">
                    {approvingApplication.user.first_name}{" "}
                    {approvingApplication.user.last_name}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Amount:</span>{" "}
                  <span className="font-medium">
                    {formatAmount(approvingApplication.amount_requested)}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Product:</span>{" "}
                  <span className="font-medium">
                    {approvingApplication.product.name}
                  </span>
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setApprovingApplication(null)}
                  disabled={isProcessing}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveApplication}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isProcessing ? "Approving..." : "Approve Application"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectingApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setRejectingApplication(null);
              setRejectionReason("");
              setRejectionError("");
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Reject Loan Application
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting this application. This
                will be visible to the applicant.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (rejectionError) setRejectionError("");
                  }}
                  rows={4}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    rejectionError ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Insufficient credit history, Income does not meet requirements..."
                />
                {rejectionError && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {rejectionError}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 10 characters required
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setRejectingApplication(null);
                    setRejectionReason("");
                    setRejectionError("");
                  }}
                  disabled={isProcessing}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectApplication}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isProcessing ? "Rejecting..." : "Reject Application"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
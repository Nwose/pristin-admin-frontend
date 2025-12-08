"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  LoanProductService,
  LoanProduct,
  LoanProductFilters,
  RepaymentFrequency,
  LoanProductRiskLevel,
  LoanProductConfig,
} from "@/lib/api/services/Loan.Service";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ProductFormData {
  name: string;
  description: string;
  interest_rate: string;
  min_amount: string;
  max_amount: string;
  min_tenure_months: string;
  max_tenure_months: string;
  repayment_frequency: RepaymentFrequency;
  risk_level: LoanProductRiskLevel;
  is_active: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  interest_rate?: string;
  min_amount?: string;
  max_amount?: string;
  min_tenure_months?: string;
  max_tenure_months?: string;
  repayment_frequency?: string;
  risk_level?: string;
  general?: string;
}

const INITIAL_FORM_DATA: ProductFormData = {
  name: "",
  description: "",
  interest_rate: "",
  min_amount: "",
  max_amount: "",
  min_tenure_months: "",
  max_tenure_months: "",
  repayment_frequency: "MONTHLY",
  risk_level: "LOW",
  is_active: true,
};

export default function LoanProductsPage() {
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<LoanProductConfig | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<LoanProduct | null>(
    null
  );
  const [viewingProduct, setViewingProduct] = useState<LoanProduct | null>(
    null
  );
  const [deletingProduct, setDeletingProduct] = useState<LoanProduct | null>(
    null
  );

  // Form & Actions
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<LoanProductFilters>({
    page: 1,
    is_active: undefined,
    search: "",
  });

  // Load config on mount
  useEffect(() => {
    loadConfig();
  }, []);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadConfig = async () => {
    try {
      const configData = await LoanProductService.getLoanProductConfig();
      setConfig(configData);
    } catch (err: any) {
      console.error("Failed to load config:", err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await LoanProductService.getLoanProducts(filters);
      setProducts(response.results);
      setTotalCount(response.count);
      setTotalPages(Math.ceil(response.count / 10)); // Assuming 10 per page
      setCurrentPage(filters.page || 1);
    } catch (err: any) {
      console.error("Failed to load products:", err);
      toast.error(err?.message || "Failed to load loan products");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Product name must be at least 3 characters";
    } else if (formData.name.trim().length > 100) {
      errors.name = "Product name must not exceed 100 characters";
    }

    // Description validation
    if (formData.description.trim().length > 500) {
      errors.description = "Description must not exceed 500 characters";
    }

    // Interest rate validation (must be between 0-100% which is 0-1 in backend)
    const interestRate = parseFloat(formData.interest_rate);
    if (!formData.interest_rate || isNaN(interestRate)) {
      errors.interest_rate = "Interest rate is required";
    } else if (interestRate < 0) {
      errors.interest_rate = "Interest rate cannot be negative";
    } else if (interestRate > 100) {
      errors.interest_rate = "Interest rate cannot exceed 100%";
    } else if (interestRate === 0) {
      errors.interest_rate = "Interest rate must be greater than 0%";
    }

    // Amount validation with config
    const minAmount = parseFloat(formData.min_amount);
    const maxAmount = parseFloat(formData.max_amount);

    if (!formData.min_amount || isNaN(minAmount)) {
      errors.min_amount = "Minimum amount is required";
    } else if (minAmount <= 0) {
      errors.min_amount = "Minimum amount must be greater than 0";
    } else if (config && minAmount < parseFloat(config.MIN_AMOUNT_LOANABLE)) {
      errors.min_amount = `Minimum amount cannot be less than ${formatAmount(
        config.MIN_AMOUNT_LOANABLE
      )}`;
    }

    if (!formData.max_amount || isNaN(maxAmount)) {
      errors.max_amount = "Maximum amount is required";
    } else if (maxAmount <= 0) {
      errors.max_amount = "Maximum amount must be greater than 0";
    } else if (config && maxAmount > parseFloat(config.MAX_AMOUNT_LOANABLE)) {
      errors.max_amount = `Maximum amount cannot exceed ${formatAmount(
        config.MAX_AMOUNT_LOANABLE
      )}`;
    } else if (!isNaN(minAmount) && maxAmount <= minAmount) {
      errors.max_amount = "Maximum amount must be greater than minimum amount";
    }

    // Tenure validation with config
    const minTenure = parseInt(formData.min_tenure_months);
    const maxTenure = parseInt(formData.max_tenure_months);

    if (!formData.min_tenure_months || isNaN(minTenure)) {
      errors.min_tenure_months = "Minimum tenure is required";
    } else if (minTenure < 1) {
      errors.min_tenure_months = "Minimum tenure must be at least 1 month";
    }

    if (!formData.max_tenure_months || isNaN(maxTenure)) {
      errors.max_tenure_months = "Maximum tenure is required";
    } else if (maxTenure < 1) {
      errors.max_tenure_months = "Maximum tenure must be at least 1 month";
    } else if (config && maxTenure > config.MAX_MONTHS_FOR_LOAN) {
      errors.max_tenure_months = `Maximum tenure cannot exceed ${config.MAX_MONTHS_FOR_LOAN} months`;
    } else if (!isNaN(minTenure) && maxTenure < minTenure) {
      errors.max_tenure_months =
        "Maximum tenure must be greater than or equal to minimum tenure";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBackendError = (err: any) => {
    const errors: FormErrors = {};

    // Check if error has details with field-specific errors
    if (err?.details && typeof err.details === "object") {
      const details = err.details as Record<string, any>;

      // Map backend field names to form field names
      Object.keys(details).forEach((key) => {
        const errorValue = details[key];
        let errorMessage = "";

        if (Array.isArray(errorValue)) {
          errorMessage = errorValue[0];
        } else if (typeof errorValue === "string") {
          errorMessage = errorValue;
        } else if (errorValue?.message) {
          errorMessage = errorValue.message;
        }

        // Map backend fields to frontend fields
        if (key === "name") errors.name = errorMessage;
        else if (key === "description") errors.description = errorMessage;
        else if (key === "interest_rate") errors.interest_rate = errorMessage;
        else if (key === "min_amount") errors.min_amount = errorMessage;
        else if (key === "max_amount") errors.max_amount = errorMessage;
        else if (key === "min_tenure_months")
          errors.min_tenure_months = errorMessage;
        else if (key === "max_tenure_months")
          errors.max_tenure_months = errorMessage;
        else if (key === "repayment_frequency")
          errors.repayment_frequency = errorMessage;
        else if (key === "risk_level") errors.risk_level = errorMessage;
        else if (key === "non_field_errors" || key === "detail") {
          errors.general = errorMessage;
        } else {
          // Any other field errors go to general
          if (!errors.general) errors.general = errorMessage;
        }
      });
    }

    // If no field-specific errors, show general message
    if (Object.keys(errors).length === 0) {
      errors.general = err?.message || "An error occurred. Please try again.";
    }

    setFormErrors(errors);

    // Only show toast for general errors, not field-specific ones
    if (errors.general) {
      toast.error(errors.general);
    }
  };

  const handleCreateProduct = async () => {
    // Clear previous errors
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      // Convert percentage to ratio (50% -> 0.5)
      const interestRateRatio = parseFloat(formData.interest_rate) / 100;

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        interest_rate: interestRateRatio.toString(),
        min_amount: formData.min_amount,
        max_amount: formData.max_amount,
        min_tenure_months: parseInt(formData.min_tenure_months),
        max_tenure_months: parseInt(formData.max_tenure_months),
        repayment_frequency: formData.repayment_frequency,
        risk_level: formData.risk_level,
        is_active: formData.is_active,
      };

      await LoanProductService.createLoanProduct(payload);
      toast.success("Loan product created successfully!");
      setShowCreateModal(false);
      setFormData(INITIAL_FORM_DATA);
      setFormErrors({});
      loadProducts();
    } catch (err: any) {
      console.error("Create error:", err);
      handleBackendError(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    // Clear previous errors
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      // Convert percentage to ratio (50% -> 0.5)
      const interestRateRatio = parseFloat(formData.interest_rate) / 100;

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        interest_rate: interestRateRatio.toString(),
        min_amount: formData.min_amount,
        max_amount: formData.max_amount,
        min_tenure_months: parseInt(formData.min_tenure_months),
        max_tenure_months: parseInt(formData.max_tenure_months),
        repayment_frequency: formData.repayment_frequency,
        risk_level: formData.risk_level,
        is_active: formData.is_active,
      };

      await LoanProductService.updateLoanProduct(editingProduct.id, payload);
      toast.success("Loan product updated successfully!");
      setEditingProduct(null);
      setFormData(INITIAL_FORM_DATA);
      setFormErrors({});
      loadProducts();
    } catch (err: any) {
      console.error("Update error:", err);
      handleBackendError(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      await LoanProductService.deleteLoanProduct(deletingProduct.id);
      toast.success("Loan product deleted successfully!");
      setDeletingProduct(null);
      loadProducts();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err?.message || "Failed to delete loan product");
    }
  };

  const handleToggleActive = async (product: LoanProduct) => {
    try {
      await LoanProductService.updateLoanProduct(product.id, {
        is_active: !product.is_active,
      });
      toast.success(
        `Product ${!product.is_active ? "activated" : "deactivated"}`
      );
      loadProducts();
    } catch (err: any) {
      console.error("Toggle error:", err);
      toast.error(err?.message || "Failed to update product status");
    }
  };

  const openEditModal = (product: LoanProduct) => {
    // Convert ratio to percentage for display (0.5 -> 50)
    const interestRatePercentage = parseFloat(product.interest_rate) * 100;

    setFormData({
      name: product.name,
      description: product.description,
      interest_rate: interestRatePercentage.toString(),
      min_amount: product.min_amount,
      max_amount: product.max_amount,
      min_tenure_months: product.min_tenure_months.toString(),
      max_tenure_months: product.max_tenure_months.toString(),
      repayment_frequency: product.repayment_frequency,
      risk_level: product.risk_level,
      is_active: product.is_active,
    });
    setFormErrors({});
    setEditingProduct(product);
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

  const formatInterestRate = (rate: string) => {
    const num = parseFloat(rate);
    if (isNaN(num)) return "—";
    // Backend stores as ratio (0.05 = 5%), display as percentage
    return `${(num * 100).toFixed(2)}%`;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setFilters({ ...filters, search, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingProduct(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Loan Products</h1>
          <p className="mt-2 text-gray-600">
            Manage loan products available to customers
          </p>
          {config && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <span className="text-blue-600 font-medium">Max Tenure:</span>{" "}
                <span className="text-blue-900 font-semibold">
                  {config.MAX_MONTHS_FOR_LOAN} months
                </span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <span className="text-green-600 font-medium">Min Amount:</span>{" "}
                <span className="text-green-900 font-semibold">
                  {formatAmount(config.MIN_AMOUNT_LOANABLE)}
                </span>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                <span className="text-purple-600 font-medium">Max Amount:</span>{" "}
                <span className="text-purple-900 font-semibold">
                  {formatAmount(config.MAX_AMOUNT_LOANABLE)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search || ""}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
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
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition font-medium"
              >
                <Plus className="h-4 w-4" />
                New Product
              </button>
            </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={
                        filters.is_active === undefined
                          ? ""
                          : filters.is_active.toString()
                      }
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          is_active:
                            e.target.value === ""
                              ? undefined
                              : e.target.value === "true",
                          page: 1,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">All</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Level
                    </label>
                    <select
                      value={filters.risk_level || ""}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          risk_level: e.target.value || undefined,
                          page: 1,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">All</option>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <select
                      value={filters.repayment_frequency || ""}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          repayment_frequency: e.target.value || undefined,
                          page: 1,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">All</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="BIWEEKLY">Bi-weekly</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">No loan products found</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interest Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount Range
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tenure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risk
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
                    {products.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.repayment_frequency}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatInterestRate(product.interest_rate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatAmount(product.min_amount)} -{" "}
                            {formatAmount(product.max_amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {product.min_tenure_months} -{" "}
                            {product.max_tenure_months} months
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.risk_level === "LOW"
                                ? "bg-green-100 text-green-800"
                                : product.risk_level === "MEDIUM"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.risk_level_display}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleActive(product)}
                            className="flex items-center gap-1"
                          >
                            {product.is_active ? (
                              <ToggleRight className="h-5 w-5 text-teal-600" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-gray-400" />
                            )}
                            <span
                              className={`text-xs font-medium ${
                                product.is_active
                                  ? "text-teal-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {product.is_active ? "Active" : "Inactive"}
                            </span>
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingProduct(product)}
                              className="text-gray-600 hover:text-gray-900"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(product)}
                              className="text-teal-600 hover:text-teal-900"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeletingProduct(product)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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
                  <strong>{totalCount}</strong> products
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

      {/* Create/Edit Modal */}
      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || editingProduct) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? "Edit Loan Product" : "Create Loan Product"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* General Error */}
                {formErrors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Error</p>
                      <p className="text-sm text-red-700 mt-1">
                        {formErrors.general}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formErrors.name) {
                          setFormErrors({ ...formErrors, name: undefined });
                        }
                      }}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g., Personal Loan"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        });
                        if (formErrors.description) {
                          setFormErrors({
                            ...formErrors,
                            description: undefined,
                          });
                        }
                      }}
                      rows={3}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        formErrors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Describe the loan product..."
                      maxLength={500}
                    />
                    <div className="flex items-center justify-between mt-1">
                      <div>
                        {formErrors.description && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {formErrors.description}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formData.description.length}/500
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interest Rate * (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.interest_rate}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          interest_rate: e.target.value,
                        });
                        if (formErrors.interest_rate) {
                          setFormErrors({
                            ...formErrors,
                            interest_rate: undefined,
                          });
                        }
                      }}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        formErrors.interest_rate
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., 5.5"
                    />
                    {formErrors.interest_rate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.interest_rate}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Enter as percentage (0-100%)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Repayment Frequency *
                    </label>
                    <select
                      value={formData.repayment_frequency}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          repayment_frequency: e.target
                            .value as RepaymentFrequency,
                        });
                        if (formErrors.repayment_frequency) {
                          setFormErrors({
                            ...formErrors,
                            repayment_frequency: undefined,
                          });
                        }
                      }}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        formErrors.repayment_frequency
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="BIWEEKLY">Bi-weekly</option>
                      <option value="NONE">None</option>
                    </select>
                    {formErrors.repayment_frequency && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.repayment_frequency}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Amount * (₦)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.min_amount}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          min_amount: e.target.value,
                        });
                        if (formErrors.min_amount) {
                          setFormErrors({
                            ...formErrors,
                            min_amount: undefined,
                          });
                        }
                      }}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        formErrors.min_amount
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="50000"
                    />
                    {formErrors.min_amount && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.min_amount}
                      </p>
                    )}
                    {config && !formErrors.min_amount && (
                      <p className="mt-1 text-xs text-gray-500">
                        Min: {formatAmount(config.MIN_AMOUNT_LOANABLE)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Amount * (₦)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.max_amount}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          max_amount: e.target.value,
                        });
                        if (formErrors.max_amount) {
                          setFormErrors({
                            ...formErrors,
                            max_amount: undefined,
                          });
                        }
                      }}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        formErrors.max_amount
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="500000"
                    />
                    {formErrors.max_amount && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.max_amount}
                      </p>
                    )}
                    {config && !formErrors.max_amount && (
                      <p className="mt-1 text-xs text-gray-500">
                        Max: {formatAmount(config.MAX_AMOUNT_LOANABLE)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Tenure * (months)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.min_tenure_months}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          min_tenure_months: e.target.value,
                        });
                        if (formErrors.min_tenure_months) {
                          setFormErrors({
                            ...formErrors,
                            min_tenure_months: undefined,
                          });
                        }
                      }}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        formErrors.min_tenure_months
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="3"
                    />
                    {formErrors.min_tenure_months && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.min_tenure_months}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Tenure * (months)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.max_tenure_months}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          max_tenure_months: e.target.value,
                        });
                        if (formErrors.max_tenure_months) {
                          setFormErrors({
                            ...formErrors,
                            max_tenure_months: undefined,
                          });
                        }
                      }}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        formErrors.max_tenure_months
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="12"
                    />
                    {formErrors.max_tenure_months && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.max_tenure_months}
                      </p>
                    )}
                    {config && !formErrors.max_tenure_months && (
                      <p className="mt-1 text-xs text-gray-500">
                        Max: {config.MAX_MONTHS_FOR_LOAN} months
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Level *
                    </label>
                    <select
                      value={formData.risk_level}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          risk_level: e.target.value as LoanProductRiskLevel,
                        });
                        if (formErrors.risk_level) {
                          setFormErrors({
                            ...formErrors,
                            risk_level: undefined,
                          });
                        }
                      }}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        formErrors.risk_level
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                    {formErrors.risk_level && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.risk_level}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_active: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Active (available to customers)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    editingProduct ? handleUpdateProduct : handleCreateProduct
                  }
                  disabled={isSaving}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSaving
                    ? "Saving..."
                    : editingProduct
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {viewingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setViewingProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Product Details
                </h2>
                <button
                  onClick={() => setViewingProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {viewingProduct.name}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {viewingProduct.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Interest Rate</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatInterestRate(viewingProduct.interest_rate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Repayment Frequency</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {viewingProduct.repayment_frequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Range</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatAmount(viewingProduct.min_amount)} -{" "}
                      {formatAmount(viewingProduct.max_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tenure Range</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {viewingProduct.min_tenure_months} -{" "}
                      {viewingProduct.max_tenure_months} months
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Risk Level</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {viewingProduct.risk_level_display}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {viewingProduct.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Created:{" "}
                    {new Date(viewingProduct.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setViewingProduct(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    openEditModal(viewingProduct);
                    setViewingProduct(null);
                  }}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  Edit Product
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeletingProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Loan Product
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <strong>{deletingProduct.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletingProduct(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/api/auth/authContext";
import { authUtils } from "@/lib/api/auth/TokenManager";
import { FrontendRoutes } from "@/lib/api/FrontendRoutes";
import {
  LoanService,
  LoanApplicationService,
  LoanProductService,
  type Loan,
  type LoanApplication,
  type LoanProduct,
  type PaginatedLoans,
  type PaginatedLoanApplications,
  type PaginatedLoanProducts,
} from "@/lib/api/services/Loan.Service";
import { toast } from "react-toastify";
import {
  Loader2,
  Wallet,
  CalendarDays,
  Percent,
  Banknote,
  ArrowLeft,
  Landmark,
  Briefcase,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  RefreshCw,
  Info,
} from "lucide-react";

/* ==================== TYPES ==================== */
interface LoanSummary {
  totalActive: number;
  totalDebt: string;
  totalPaid: string;
  activeLoans: number;
  pendingApplications: number;
  overdueCount: number;
}

interface BankDetails {
  bank_name: string;
  account_number: string;
  account_name: string;
}

interface BusinessDetails {
  business_name: string;
  business_address: string;
  business_type: string;
}

/* ==================== UTILITY FUNCTIONS ==================== */
const formatCurrency = (amount: string | number): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(isNaN(num) ? 0 : num);
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};

const formatDateTime = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "N/A";
  }
};

/* ==================== MAIN COMPONENT ==================== */
export default function LoansPage() {
  const { user } = useAuth();
  const router = useRouter();

  /* ========== STATE MANAGEMENT ========== */
  const [loans, setLoans] = useState<Loan[]>([]);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [products, setProducts] = useState<LoanProduct[]>([]);

  const [loansLoading, setLoansLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* ========== MODALS ========== */
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);

  /* ========== FORM STATE ========== */
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bank_name: "",
    account_number: "",
    account_name: "",
  });
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    business_name: "",
    business_address: "",
    business_type: "",
  });
  const [savingBank, setSavingBank] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);

  /* ========== AUTH CHECK ========== */
  useEffect(() => {
    if (!authUtils.isAuthenticated() || !user) {
      router.push(FrontendRoutes.login);
    }
  }, [user, router]);

  /* ========== DATA FETCHING ========== */
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    await Promise.all([fetchLoans(), fetchApplications(), fetchProducts()]);
  };

  const fetchLoans = async () => {
    try {
      setLoansLoading(true);
      setError(null);

      const response: PaginatedLoans = await LoanService.getLoans({
        user: user?.id,
      });

      setLoans(response.results || []);
    } catch (err: any) {
      console.error("❌ Error fetching loans:", err);
      const errorMsg = err?.message || "Failed to load loans";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoansLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true);

      const response: PaginatedLoanApplications =
        await LoanApplicationService.getLoanApplications({
          user: user?.id,
        });

      setApplications(response.results || []);
    } catch (err: any) {
      console.error("❌ Error fetching applications:", err);
      toast.error(err?.message || "Failed to load loan applications");
    } finally {
      setApplicationsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);

      const response: PaginatedLoanProducts =
        await LoanProductService.getLoanProducts({
          is_active: true,
        });

      setProducts(response.results || []);
    } catch (err: any) {
      console.error("❌ Error fetching products:", err);
      toast.error(err?.message || "Failed to load loan products");
    } finally {
      setProductsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
    toast.success("Data refreshed successfully");
  };

  /* ========== COMPUTED VALUES ========== */
  const summary: LoanSummary = useMemo(() => {
    const activeLoans = loans.filter((l) => l.status === "ACTIVE");
    const pendingApps = applications.filter((a) => a.status === "PENDING");

    const totalDebt = activeLoans.reduce(
      (sum, loan) => sum + parseFloat(loan.remaining_balance || "0"),
      0
    );

    const paidLoans = loans.filter((l) => l.status === "PAID");
    const totalPaid = paidLoans.reduce(
      (sum, loan) => sum + parseFloat(loan.total_payable || "0"),
      0
    );

    const overdueCount = loans.filter((loan) => {
      if (loan.status !== "ACTIVE") return false;
      return loan.repayments?.some((r) => r.status === "OVERDUE");
    }).length;

    return {
      totalActive: activeLoans.length,
      totalDebt: totalDebt.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      activeLoans: activeLoans.length,
      pendingApplications: pendingApps.length,
      overdueCount,
    };
  }, [loans, applications]);

  /* ========== RECENT ITEMS ========== */
  const recentActivity = useMemo(() => {
    const combined = [
      ...loans.map((l) => ({
        id: l.id,
        type: "loan" as const,
        status: l.status,
        amount: l.principal_amount,
        date: l.created_at,
        data: l,
      })),
      ...applications.map((a) => ({
        id: a.id,
        type: "application" as const,
        status: a.status,
        amount: a.amount_requested,
        date: a.created_at,
        data: a,
      })),
    ];

    return combined
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [loans, applications]);

  /* ========== STATUS HELPERS ========== */
  const getStatusConfig = (
    status: string,
    type: "loan" | "application"
  ): {
    color: string;
    bgColor: string;
    icon: React.ReactNode;
    label: string;
  } => {
    if (type === "application") {
      switch (status) {
        case "APPROVED":
          return {
            color: "text-green-700",
            bgColor: "bg-green-50",
            icon: <CheckCircle2 size={16} />,
            label: "Approved",
          };
        case "PENDING":
          return {
            color: "text-yellow-700",
            bgColor: "bg-yellow-50",
            icon: <Clock size={16} />,
            label: "Pending",
          };
        case "REJECTED":
          return {
            color: "text-red-700",
            bgColor: "bg-red-50",
            icon: <XCircle size={16} />,
            label: "Rejected",
          };
        default:
          return {
            color: "text-gray-700",
            bgColor: "bg-gray-50",
            icon: <Info size={16} />,
            label: status,
          };
      }
    }

    // Loan status
    switch (status) {
      case "ACTIVE":
        return {
          color: "text-blue-700",
          bgColor: "bg-blue-50",
          icon: <TrendingUp size={16} />,
          label: "Active",
        };
      case "PAID":
        return {
          color: "text-green-700",
          bgColor: "bg-green-50",
          icon: <CheckCircle2 size={16} />,
          label: "Paid",
        };
      case "DEFAULTED":
        return {
          color: "text-red-700",
          bgColor: "bg-red-50",
          icon: <AlertCircle size={16} />,
          label: "Defaulted",
        };
      case "CANCELLED":
        return {
          color: "text-gray-700",
          bgColor: "bg-gray-50",
          icon: <XCircle size={16} />,
          label: "Cancelled",
        };
      case "UNDISBURSED":
        return {
          color: "text-orange-700",
          bgColor: "bg-orange-50",
          icon: <Clock size={16} />,
          label: "Undisbursed",
        };
      default:
        return {
          color: "text-gray-700",
          bgColor: "bg-gray-50",
          icon: <Info size={16} />,
          label: status,
        };
    }
  };

  /* ========== SAVE HANDLERS ========== */
  const saveBankDetails = async () => {
    if (
      !bankDetails.bank_name ||
      !bankDetails.account_number ||
      !bankDetails.account_name
    ) {
      toast.error("Please fill in all bank details");
      return;
    }

    try {
      setSavingBank(true);

      // Using the makeRequest pattern from original code
      const response = await fetch("/api/v1/bank-details/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUtils.getAccessToken()}`,
        },
        body: JSON.stringify(bankDetails),
      });

      if (!response.ok) throw new Error("Failed to save bank details");

      toast.success("Bank details saved successfully!");
      setBankDetails({ bank_name: "", account_number: "", account_name: "" });
      setShowBankModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save bank details");
    } finally {
      setSavingBank(false);
    }
  };

  const saveBusinessDetails = async () => {
    if (
      !businessDetails.business_name ||
      !businessDetails.business_address ||
      !businessDetails.business_type
    ) {
      toast.error("Please fill in all business details");
      return;
    }

    try {
      setSavingBusiness(true);

      const response = await fetch("/api/v1/business-details/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUtils.getAccessToken()}`,
        },
        body: JSON.stringify(businessDetails),
      });

      if (!response.ok) throw new Error("Failed to save business details");

      toast.success("Business details saved successfully!");
      setBusinessDetails({
        business_name: "",
        business_address: "",
        business_type: "",
      });
      setShowBusinessModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save business details");
    } finally {
      setSavingBusiness(false);
    }
  };

  /* ========== LOADING STATE ========== */
  const isInitialLoading =
    loansLoading && applicationsLoading && productsLoading;

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#019893] mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Loading your loan dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* ========== RENDER ========== */
  return (
    <div className="flex flex-col gap-8 w-full pb-12">
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#001B2E]">Loan Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage your loans and applications
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#CCEAE9] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={refreshing ? "animate-spin text-[#019893]" : ""}
          />
          <span className="font-medium text-sm">
            {refreshing ? "Refreshing..." : "Refresh"}
          </span>
        </button>
      </div>

      {/* ========== ERROR BANNER ========== */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 mt-0.5" size={20} />
          <div>
            <p className="text-red-800 font-medium">Error loading data</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* ========== SUMMARY CARDS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#019893] to-[#017C77] text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Wallet size={24} className="opacity-80" />
            {summary.overdueCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {summary.overdueCount} Overdue
              </span>
            )}
          </div>
          <div className="text-2xl font-bold mb-1">
            {formatCurrency(summary.totalDebt)}
          </div>
          <div className="text-sm opacity-90">Total Outstanding Debt</div>
          <div className="mt-3 text-xs opacity-75">
            {summary.activeLoans} active loan{summary.activeLoans !== 1 && "s"}
          </div>
        </div>

        <div className="bg-white border border-[#CCEAE9] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle2 size={24} className="text-green-600" />
          </div>
          <div className="text-2xl font-bold text-[#001B2E] mb-1">
            {formatCurrency(summary.totalPaid)}
          </div>
          <div className="text-sm text-gray-600">Total Paid</div>
          <div className="mt-3 text-xs text-gray-500">
            {loans.filter((l) => l.status === "PAID").length} completed loan
            {loans.filter((l) => l.status === "PAID").length !== 1 && "s"}
          </div>
        </div>

        <div className="bg-white border border-[#CCEAE9] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Clock size={24} className="text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-[#001B2E] mb-1">
            {summary.pendingApplications}
          </div>
          <div className="text-sm text-gray-600">Pending Applications</div>
          <div className="mt-3 text-xs text-gray-500">Awaiting approval</div>
        </div>

        <div className="bg-white border border-[#CCEAE9] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp size={24} className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[#001B2E] mb-1">
            {loans.length}
          </div>
          <div className="text-sm text-gray-600">Total Loans</div>
          <div className="mt-3 text-xs text-gray-500">
            {applications.length} application
            {applications.length !== 1 && "s"} submitted
          </div>
        </div>
      </div>

      {/* ========== MAIN CONTENT GRID ========== */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* ========== LEFT COLUMN: ACTIONS + RECENT ========== */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-[#CCEAE9] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#001B2E] mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/admin/loans/request")}
                className="w-full bg-[#019893] hover:bg-[#017C77] text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Banknote size={20} />
                Request New Loan
              </button>

              <button
                onClick={() => setShowDetailsModal(true)}
                className="w-full bg-white border-2 border-[#019893] text-[#019893] hover:bg-[#E6F8F7] py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Briefcase size={20} />
                Add Business Details
              </button>

              <button
                onClick={() => router.push("/admin/loans/history")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                View Full History
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info
                  className="text-blue-600 mt-0.5 flex-shrink-0"
                  size={16}
                />
                <p className="text-xs text-blue-800">
                  Complete your business details to unlock higher loan limits
                  and faster approval.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-[#CCEAE9] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#001B2E]">
                Recent Activity
              </h3>
              <button
                onClick={() => router.push("/admin/loans/history")}
                className="text-[#019893] text-sm font-medium hover:underline"
              >
                See All
              </button>
            </div>

            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Wallet size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((item) => {
                  const statusConfig = getStatusConfig(item.status, item.type);
                  return (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        if (item.type === "loan") {
                          router.push(`/admin/loans/${item.id}`);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`p-2 rounded-full ${statusConfig.bgColor}`}
                        >
                          {statusConfig.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#001B2E] truncate">
                            {item.type === "loan" ? "Loan" : "Application"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(item.date)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-sm font-semibold text-[#019893]">
                          {formatCurrency(item.amount)}
                        </div>
                        <div
                          className={`text-xs font-medium ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ========== RIGHT COLUMN: LOAN PRODUCTS ========== */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#001B2E]">
                Available Loan Products
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Choose a product that fits your needs
              </p>
            </div>
          </div>

          {productsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-10 h-10 animate-spin text-[#019893]" />
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <Wallet
                size={48}
                className="mx-auto mb-4 text-gray-300 opacity-50"
              />
              <p className="text-gray-500 text-lg font-medium mb-2">
                No loan products available
              </p>
              <p className="text-gray-400 text-sm">
                Check back later for new offerings
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#CCEAE9] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#019893]/10 rounded-lg">
                        <Wallet className="text-[#019893]" size={22} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-[#001B2E] group-hover:text-[#019893] transition-colors">
                          {product.name}
                        </h3>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            product.risk_level === "LOW"
                              ? "bg-green-100 text-green-700"
                              : product.risk_level === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.risk_level_display}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-5 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Banknote className="text-[#019893]" size={16} />
                        <span>Loan Range</span>
                      </div>
                      <span className="font-semibold text-[#001B2E]">
                        {formatCurrency(product.min_amount)} -{" "}
                        {formatCurrency(product.max_amount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarDays className="text-[#019893]" size={16} />
                        <span>Tenure</span>
                      </div>
                      <span className="font-semibold text-[#001B2E]">
                        {product.min_tenure_months} -{" "}
                        {product.max_tenure_months} months
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Percent className="text-[#019893]" size={16} />
                        <span>Interest Rate</span>
                      </div>
                      <span className="font-semibold text-[#001B2E]">
                        {(parseFloat(product.interest_rate) * 100).toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarDays className="text-[#019893]" size={16} />
                        <span>Repayment</span>
                      </div>
                      <span className="font-semibold text-[#001B2E] capitalize">
                        {product.repayment_frequency.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      router.push(`/admin/loans/request?product=${product.id}`)
                    }
                    className="w-full bg-[#019893] hover:bg-[#017C77] text-white rounded-lg py-3 px-4 font-semibold transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                  >
                    Apply Now
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========== MODALS ========== */}
      {/* Details Selection Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-[#019893] transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <h2 className="text-center text-xl font-bold text-[#001B2E] mb-6 mt-2">
              Add Your Details
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowBankModal(true);
                }}
                className="w-full flex items-center justify-between border-2 border-[#CCEAE9] rounded-xl p-5 hover:border-[#019893] hover:bg-[#E6F8F7] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#019893]/10 text-[#019893] p-3 rounded-full group-hover:bg-[#019893] group-hover:text-white transition-colors">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-[#001B2E] font-semibold text-base">
                      Bank Account Details
                    </div>
                    <div className="text-gray-500 text-sm">
                      Add your bank information
                    </div>
                  </div>
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-[#019893] transition-colors" />
              </button>

              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowBusinessModal(true);
                }}
                className="w-full flex items-center justify-between border-2 border-[#CCEAE9] rounded-xl p-5 hover:border-[#019893] hover:bg-[#E6F8F7] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#019893]/10 text-[#019893] p-3 rounded-full group-hover:bg-[#019893] group-hover:text-white transition-colors">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-[#001B2E] font-semibold text-base">
                      Business Information
                    </div>
                    <div className="text-gray-500 text-sm">
                      Add your business details
                    </div>
                  </div>
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-[#019893] transition-colors" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Details Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowBankModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-[#019893] transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="text-center mb-6 mt-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#019893]/10 rounded-full mb-3">
                <Landmark className="w-8 h-8 text-[#019893]" />
              </div>
              <h2 className="text-xl font-bold text-[#001B2E]">
                Bank Account Details
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Required for loan disbursement
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveBankDetails();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Access Bank"
                  value={bankDetails.bank_name}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      bank_name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#019893] focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="0123456789"
                  value={bankDetails.account_number}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      account_number: e.target.value,
                    })
                  }
                  maxLength={10}
                  pattern="[0-9]*"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#019893] focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={bankDetails.account_name}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      account_name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#019893] focus:border-transparent transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={savingBank}
                className="w-full bg-[#019893] hover:bg-[#017C77] text-white py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {savingBank ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    Save Bank Details
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Business Details Modal */}
      {showBusinessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowBusinessModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-[#019893] transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="text-center mb-6 mt-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#019893]/10 rounded-full mb-3">
                <Briefcase className="w-8 h-8 text-[#019893]" />
              </div>
              <h2 className="text-xl font-bold text-[#001B2E]">
                Business Information
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Help us understand your business better
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveBusinessDetails();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., ABC Trading Ltd"
                  value={businessDetails.business_name}
                  onChange={(e) =>
                    setBusinessDetails({
                      ...businessDetails,
                      business_name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#019893] focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Full business address"
                  value={businessDetails.business_address}
                  onChange={(e) =>
                    setBusinessDetails({
                      ...businessDetails,
                      business_address: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#019893] focus:border-transparent transition resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={businessDetails.business_type}
                  onChange={(e) =>
                    setBusinessDetails({
                      ...businessDetails,
                      business_type: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#019893] focus:border-transparent transition"
                  required
                >
                  <option value="">Select business type</option>
                  <option value="sole_proprietorship">
                    Sole Proprietorship
                  </option>
                  <option value="partnership">Partnership</option>
                  <option value="limited_liability">
                    Limited Liability Company
                  </option>
                  <option value="corporation">Corporation</option>
                  <option value="cooperative">Cooperative</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={savingBusiness}
                className="w-full bg-[#019893] hover:bg-[#017C77] text-white py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {savingBusiness ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    Save Business Details
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

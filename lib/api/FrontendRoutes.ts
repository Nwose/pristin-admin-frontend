// Development Routes
export const Routes = {
  // Auth Routes  ***************************************************************************** //
  login: "/auth/login",
  register: "/auth/register",
  loginSecondFactor: "/auth/login/2ndfactor",
  verifyEmailOTP: "/auth/verify-email",
  verifyPhoneOTP: "/auth/verify-phone",
  forgotPassword: "/auth/forgot-password",

  // Dashboard Routes  ***************************************************************************** //
  dashboard: "/dashboard",

  // Investments
  investments: "/dashboard/investments",

  // Loans
  loans: "/dashboard/loans",
  loanApplications: "/dashboard/loan-applications",
  loanDetail: (id: string | number) => `/dashboard/loans/${id}`,

  // Loan Products
  loanProducts: "/dashboard/loan-products",

  // Notifications
  notifications: "/dashboard/notifications",
  notificationsSchedule: "/dashboard/notifications/schedule",

  // Users
  users: "/dashboard/users",

  // KYC
  kyc: "/dashboard/kyc",
  kycReview: "/dashboard/kyc/Review",
  kycDoc: "/dashboard/kyc/Review/kyc-doc",
  kycReviewHistory: "/dashboard/kyc/Review/Review-history",

  // Penalty
  penalty: "/dashboard/penalty",
  issuePenalty: "/dashboard/penalty/Issue-penalty",
  issueBan: "/dashboard/penalty/Issue-ban",
};

export const FrontendRoutes = Routes;

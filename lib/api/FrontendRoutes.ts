// These are routes to basically every view in app

// Development Routes
export const Routes = {
    home: "/",
    login: "/auth/login",
    register: "/auth/register",
    chats: "/tests/chats",
    loginSecondFactor: "/auth/login/2ndfactor",
    verifyEmailOTP: "/auth/verify-email",
    verifyPhoneOTP: "/auth/verify-phone",
    forgotPassword: "/auth/forgot-password",
    dashboard: "/dashboard",
    wallet: "/dashboard/wallet",
    transactionHistory: "/dashboard/wallet/transaction-history",
    investments: "/dashboard/investments",
    loans: "/dashboard/loans",
    payments: "/dashboard/payments",
    settings: "/dashboard/settings",
    finishKYC: "/dashboard/settings/finish-kyc",
}

export const FrontendRoutes = Routes;
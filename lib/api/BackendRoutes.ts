export const baseURL = "";

export const BackendRoutes = {
  /* ----------------------------- AUTH ----------------------------- */
  loginFirstFactor: `${baseURL}/login/token/1stfactor/`,
  loginSecondFactor: `${baseURL}/login/token/2stfactor/`,
  refreshToken: `${baseURL}/login/token/refresh/`,

  passwordReset: `${baseURL}/password_reset/`,
  passwordResetConfirm: `${baseURL}/password_reset/confirm/`,
  passwordResetValidateToken: `${baseURL}/password_reset/validate_token/`,

  socialAuth: (backend: "facebook" | "google-oauth2" | "twitter" ) => `${baseURL}/social/${backend}/`,

  /* ----------------------------- BANK ACCOUNT ----------------------------- */
  addBankAccount: `${baseURL}/bank_account/add_bank_account/`,
  getBanks: `${baseURL}/bank_account/get_banks/`,
  myBanks: `${baseURL}/bank_account/my_banks/`,
  removeBankAccount: `${baseURL}/bank_account/remove_bank_account/`,
  resolveNuban: `${baseURL}/bank_account/resolve_nuban/`,

  /* ----------------------------- CHATS ----------------------------- */
  chatTest: `${baseURL}/chat/just_testing/`,

  /* ----------------------------- FILES ----------------------------- */
  uploadFile: `${baseURL}/files/`,

  /* ----------------------------- NOTIFICATIONS ----------------------------- */
  notificationTest: `${baseURL}/notification/just_testing/`,

  /* ----------------------------- ORDERS ----------------------------- */
  orderTest: `${baseURL}/order/just_testing/`,

  /* ----------------------------- PAYSTACK ----------------------------- */
  paystackWebhook: `${baseURL}/paystack/webhook-respond/`,

  /* ----------------------------- PRODUCTS ----------------------------- */
  productTest: `${baseURL}/product/just_testing/`,

  /* ----------------------------- USERS ----------------------------- */
  check2faOtp: `${baseURL}/users/check_2fa_otp/`,
  checkEmailOtp: `${baseURL}/users/check_email_verification_otp/`,
  checkPhoneOtp: `${baseURL}/users/check_phone_verification_otp/`,
  checkUsername: `${baseURL}/users/check_username/`,
  deleteMe: `${baseURL}/users/delete_me/`,
  doKycCheck: `${baseURL}/kyc/do_kyc_and_create_wallet/`,
  doLivenessCheck: `${baseURL}/kyc/do_liveness_check/`,
  getCountries: `${baseURL}/users/get_countries/`,
  getStates: `${baseURL}/users/get_states/`,
  health: `${baseURL}/users/health/`,
  joinWaitlist: `${baseURL}/users/join_waitlist/`,
  me: `${baseURL}/users/me/`,
  updatePassword: `${baseURL}/users/password_reset/`,
  qrImageFor2FA: (token: string) => `${baseURL}/users/qr_image_for_2fa/${token}/`,
  register: `${baseURL}/users/register/`,
  requestQrCode: `${baseURL}/users/request_qr_code/`,
  resetForgotPassword: `${baseURL}/users/reset_forgot_password/`,
  resetRecoveryCodes: `${baseURL}/users/reset_recovery_codes/`,
  send2faOtp: `${baseURL}/users/send_2fa_otp/`,
  sendEmailOtp: `${baseURL}/users/send_email_verification_otp/`,
  sendForgotPasswordOtp: `${baseURL}/users/send_forgot_password_otp/`,
  sendPhoneOtp: `${baseURL}/users/send_phone_verification_otp/`,
  updateMe: `${baseURL}/users/update_me/`,

  /* ----------------------------- WALLETS ----------------------------- */
  fundWallet: `${baseURL}/wallets/fund/`,
  withdraw: `${baseURL}/wallets/withdraw/`,
  getUserWallets: `${baseURL}/wallets/get_user_wallets/`,

  /* ----------------------------- COMPLETE ----------------------------- */
  completeTwitter: `/complete/twitter/`,

  /* ----------------------------- LOAN AUTH ----------------------------- */
  getLoans: `${baseURL}/loan/`,
  getLoan: (id: string) => `${baseURL}/loan/${id}/`,
  getLoanApplications: `${baseURL}/loan-application/`,
  getLoanApplication: (id: string) => `${baseURL}/loan-application/${id}/`,
  approveLoanApplication: (id: string) => `${baseURL}/loan-application/${id}/approve/`,
  rejectLoanApplication: (id: string) => `${baseURL}/loan-application/${id}/reject/`,
  createLoanApplication: `${baseURL}/loan-application/`,
  getLoanProducts: `${baseURL}/loan-product/`,
  getLoanProduct: (id: string) => `${baseURL}/loan-product/${id}/`,
  createLoanProduct : `${baseURL}/loan-product/`,
  updateLoanProduct : (id: string) => `${baseURL}/loan-product/${id}/`,
  deleteLoanProduct : (id: string) => `${baseURL}/loan-product/${id}/`,
  getLoanProductConfig: `${baseURL}/loan-product/get_config/`,
  getLoanRepayments: `${baseURL}/loan-repayment/`,
  getLoanRepayment: (id: string) => `${baseURL}/loan-repayment/${id}/`,

  /* ----------------------------- LOAN DISBURSEMENT ----------------------------- */
  // Disbursement queue
  getDisbursements: "/loan-disbursement/",                // GET list
  getDisbursement: (id: string) => `/loan-disbursement/${id}/`, // GET retrieve

  addToDisbursementQueue: "/loan-disbursement/add-to-queue/",   // POST add to queue
  processDisbursement: (id: string) => `/loan-disbursement/${id}/process/`, // POST process
  cancelDisbursement: (id: string) => `/loan-disbursement/${id}/cancel/`,   // POST cancel
  bulkProcessDisbursement: "/loan-disbursement/bulk-process/", // POST bulk process
  getDisbursementStatistics: "/loan-disbursement/statistics/", // GET statistics
};

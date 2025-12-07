// import { send } from "./base";

// // -----------------------------
// // Loan Product (Admin only)
// // -----------------------------

// export async function getLoanProducts(token?: string) {
//   return await send("GET", "loan-product/", undefined, token);
// }

// export async function createLoanProduct(data: any, token: string) {
//   return await send("POST", "loan-product/", data, token);
// }

// export async function updateLoanProduct(id: string, data: any, token: string) {
//   return await send("PUT", `loan-product/${id}/`, data, token);
// }

// export async function deleteLoanProduct(id: string, token: string) {
//   return await send("DELETE", `loan-product/${id}/`, undefined, token);
// }

// // -----------------------------
// // Loan Application (User)
// // -----------------------------

// export async function getLoanApplications(token: string) {
//   return await send("GET", "loan-application/", undefined, token);
// }

// export async function createLoanApplication(data: any, token: string) {
//   return await send("POST", "loan-application/", data, token);
// }

// export async function getLoanApplicationById(id: string, token: string) {
//   return await send("GET", `loan-application/${id}/`, undefined, token);
// }

// export async function approveLoanApplication(id: string, token: string) {
//   return await send("POST", `loan-application/${id}/approve/`, {}, token);
// }

// export async function rejectLoanApplication(id: string, token: string) {
//   return await send("POST", `loan-application/${id}/reject/`, {}, token);
// }

// // -----------------------------
// // Loans (After approval)
// // -----------------------------

// export async function getLoans(token: string) {
//   return await send("GET", "loan/", undefined, token);
// }

// export async function getLoanById(id: string, token: string) {
//   return await send("GET", `loan/${id}/`, undefined, token);
// }

// // -----------------------------
// // Loan Repayments (Optional)
// // -----------------------------

// export async function getLoanRepayments(token: string) {
//   return await send("GET", "loan-repayment/", undefined, token);
// }

// export async function createLoanRepayment(data: any, token: string) {
//   return await send("POST", "loan-repayment/", data, token);
// }

import { send } from "./base";

const loanService = {
  // Create new loan product (admin only)
  createLoanProduct: (data: any, token?: string) =>
    send("POST", "/api/v1/loan-product/", data, token),

  // Fetch loan products (public/authenticated)
  getLoanProducts: (token?: string) =>
    send("GET", "/api/v1/loan-product/", undefined, token),

  // Fetch user loan applications
  getMyLoans: () => send("GET", "/api/v1/loan-application/"),

  // Create new loan application
  createLoanApplication: (data: any) =>
    send("POST", "/api/v1/loan-application/", data),

  // Fetch single loan details
  getLoanById: (id: number) => send("GET", `/api/v1/loan/${id}/`),

  // Admin: approve loan
  approveLoan: (id: number) =>
    send("POST", `/api/v1/loan-application/${id}/approve/`),

  // Admin: reject loan
  rejectLoan: (id: number) =>
    send("POST", `/api/v1/loan-application/${id}/reject/`),
};

export default loanService;

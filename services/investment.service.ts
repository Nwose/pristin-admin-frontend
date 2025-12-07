import { makeRequest } from "./base";

// ---------------------------
// USER INVESTMENT ENDPOINTS
// ---------------------------

// 1. Get investment products
export async function getInvestmentProducts() {
  return await makeRequest("/api/v1/investment_product/", "GET");
}

// 2. Get user's investments
export async function getUserInvestments() {
  return await makeRequest("/api/v1/investment/", "GET");
}

// 3. Fund new investment
export async function fundInvestment(payload: any) {
  return await makeRequest("/api/v1/investment/", "POST", payload);
}

// 4. Cancel investment (optional)
export async function cancelInvestment(id: string) {
  return await makeRequest(`/api/v1/investment/${id}/cancel/`, "POST");
}

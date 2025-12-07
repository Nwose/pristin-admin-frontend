import { makeRequest } from "./base";

export interface LoanProduct {
  id?: string;
  name: string;
  interest_rate: number;
  max_amount: number;
  tenure_months: number;
  description?: string;
  [key: string]: any; // allow flexible keys
}

// ✅ Get all loan products
export async function getLoanProducts(
  token?: string
): Promise<LoanProduct[] | { results: LoanProduct[] }> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return makeRequest("api/v1/loan-product/", "GET", undefined, headers);
}

// ✅ Create a new loan product
export async function createLoanProduct(
  data: LoanProduct,
  token?: string
): Promise<LoanProduct> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return makeRequest("api/v1/loan-product/", "POST", data, headers);
}

// ✅ Update an existing loan product
export async function updateLoanProduct(
  id: string,
  data: Partial<LoanProduct>,
  token?: string
): Promise<LoanProduct> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return makeRequest(`api/v1/loan-product/${id}/`, "PUT", data, headers);
}

// ✅ Delete a loan product
export async function deleteLoanProduct(
  id: string,
  token?: string
): Promise<{ message: string }> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return makeRequest(
    `api/v1/loan-product/${id}/`,
    "DELETE",
    undefined,
    headers
  );
}

// ✅ Get all loan products (clean list)
export async function getAllLoanProducts() {
  try {
    const response = await makeRequest("api/v1/loan-product/", "GET");
    return response?.results || (Array.isArray(response) ? response : []);
  } catch (error) {
    console.error("❌ Error fetching loan products:", error);
    throw error;
  }
}

// ✅ Get single product by ID
export async function getLoanProductById(id: string) {
  try {
    return await makeRequest(`api/v1/loan-product/${id}/`, "GET");
  } catch (error) {
    console.error(`❌ Error fetching loan product ${id}:`, error);
    throw error;
  }
}

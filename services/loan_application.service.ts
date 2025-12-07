import { makeRequest } from "./base";

export interface LoanApplication {
  id: string;
  user?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
  amount: number;
  tenure: number;
  purpose: string;
  status: "Pending" | "Approved" | "Rejected" | string;
  created_at?: string;
}

// ✅ Get all loan applications
export async function getLoanApplications(): Promise<LoanApplication[]> {
  try {
    const data = await makeRequest("api/v1/loan-application/", "GET");
    const list = Array.isArray(data) ? data : data.results || [];

    return list.map((item: any) => ({
      id: item.id,
      user: item.user,
      amount: item.amount_requested ?? item.amount ?? 0,
      tenure: item.tenure_months ?? item.tenure ?? 0,
      purpose: item.purpose ?? "N/A",
      status: item.status ?? "Pending",
      created_at: item.created_at ?? "",
    }));
  } catch (error) {
    console.error("❌ Error fetching loan applications:", error);
    throw error;
  }
}

// ✅ Get single loan application by ID
export async function getLoanApplicationById(
  id: string
): Promise<LoanApplication> {
  try {
    return await makeRequest(`api/v1/loan-application/${id}/`, "GET");
  } catch (error) {
    console.error(`❌ Error fetching loan application ${id}:`, error);
    throw error;
  }
}

// ✅ Apply for a new loan
export async function applyForLoan(payload: {
  product_id: string;
  amount_requested: number;
  tenure_months: number;
  purpose: string;
}) {
  return makeRequest("api/v1/loan-application/", "POST", payload);
}

// ✅ Get user loan history
export async function getUserLoans() {
  try {
    const data = await makeRequest("api/v1/loan/", "GET");
    const list = Array.isArray(data) ? data : data.results || [];

    return list.map((item: any) => ({
      id: item.id,
      amount: item.amount ?? 0,
      purpose: item.purpose ?? "N/A",
      status: item.status ?? "Pending",
      created_at: item.created_at ?? "",
    }));
  } catch (error) {
    console.error("❌ Error fetching user loans:", error);
    throw error;
  }
}

export interface LoanApplicationPayload {
  amount: number;
  tenure: number;
  purpose: string;
  business_id?: string; // optional if user added business details
}

// Create a loan application
export async function requestLoan(payload: LoanApplicationPayload) {
  return makeRequest("api/v1/loan-application/", "POST", payload);
}

// Get loan application details by ID
export async function getLoanApplication(id: string) {
  return makeRequest(`api/v1/loan-application/${id}/`, "GET");
}
export async function getLoans() {
  try {
    const data = await makeRequest("api/v1/loan/", "GET");
    // Ensure it always returns an array
    if (Array.isArray(data)) return data;
    if (data?.results) return data.results; // pagination support
    return [];
  } catch (err) {
    console.error("❌ Failed to fetch loans:", err);
    return [];
  }
}

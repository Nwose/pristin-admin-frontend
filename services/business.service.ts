import { makeRequest } from "./base";

// Add business details
export async function addBusinessDetails(businessData: {
  business_name: string;
  registration_number: string;
  tax_id?: string;
  address?: string;
  phone?: string;
}) {
  return makeRequest(
    "api/v1/users/add_business_details/",
    "POST",
    businessData
  );
}

// Get business details for current user
export async function getBusinessDetails() {
  return makeRequest("api/v1/users/business_details/", "GET");
}

// Update business details
export async function updateBusinessDetails(
  businessId: string,
  businessData: Partial<{
    business_name: string;
    registration_number: string;
    tax_id: string;
    address: string;
    phone: string;
  }>
) {
  return makeRequest(
    `api/v1/users/business_details/${businessId}/`,
    "PUT",
    businessData
  );
}

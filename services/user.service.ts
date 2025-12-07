import { makeRequest } from "./base";

export const UserService = {
  getUsers() {
    return makeRequest("/api/v1/users/me/", "GET");
  },

  updateUser(id: string, data: any) {
    return makeRequest(`/api/v1/users/${id}/`, "PUT", data);
  },

  patchUser(id: string, data: any) {
    return makeRequest(`/api/v1/users/${id}/`, "PATCH", data);
  },

  check2FA(data: any) {
    return makeRequest("/api/v1/users/check_2fa_otp/", "POST", data);
  },

  kycCheck(data: any) {
    return makeRequest("/api/v1/users/do_kyc_check/", "POST", data);
  },

  liveness(data: any) {
    return makeRequest("/api/v1/users/do_liveness_check/", "POST", data);
  },

  health() {
    return makeRequest("/api/v1/users/health/", "GET");
  },

  register(data: any) {
    return makeRequest("/api/v1/users/register/", "POST", data);
  },
};

// Fetch logged-in user profile
export const getCurrentUser = async () => {
  return makeRequest("/api/v1/users/me/", "GET");
};

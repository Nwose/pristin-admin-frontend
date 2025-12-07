import { makeRequest } from "@/services/base";

export const SettingsService = {
  getProfile() {
    return makeRequest("/api/v1/users/me/", "GET");
  },

  updateProfile(id: number, body: any) {
    return makeRequest(`/api/v1/users/${id}/`, "PUT", body);
  },

  changePassword(body: any) {
    return makeRequest("/api/v1/users/password_reset/", "PUT", body);
  },

  // ⭐ UPDATED — backend may reject empty body
  requestQRCode() {
    return makeRequest("/api/v1/users/request_qr_code/", "POST", {
      channel: "app",
    });
  },

  verify2FA(body: { otp: string }) {
    return makeRequest("/api/v1/users/check_2fa_otp/", "POST", body);
  },
};

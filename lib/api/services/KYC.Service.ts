import { apiClient } from "../ApiClient";
import { UserType } from "../types/auth";
import { BackendRoutes } from "../BackendRoutes";
import { useAuthStore } from "../auth/authContext";

export interface LivenessCheckIn {
// nothing for now
}

export interface VerifyCustomerIn {
    bvn: string;
    bank_code: string;
    account_number: string;
}


class KYCService {
    static async verifyCustomer(verifyCustomerIn: VerifyCustomerIn): Promise<UserType> {
        const res = await apiClient.post<UserType>(BackendRoutes.doKycCheck, verifyCustomerIn, {
            requiresAuth: true,
        });
        
        return res.data;
    }
    static async livenessCheck(livenessCheckIn: LivenessCheckIn): Promise<UserType> {
        const res = await apiClient.post<UserType>(BackendRoutes.doLivenessCheck, livenessCheckIn, {
            requiresAuth: true,
        });
        
        return res.data;
    }
}


export default KYCService;
import { apiClient } from './api';
import { PrivacyPolicyData } from '@/types/privacyPolicy';

interface PrivacyApiResponse {
  message: string;
  data: PrivacyPolicyData[];
}

export const privacyPolicyService = {
  async getPrivacyPolicy(): Promise<PrivacyPolicyData | null> {
    const response = await apiClient.get<PrivacyApiResponse>('/home/politique_confidentialite/');
    // Return the last item (most recent/complete one) or the first item
    const data = response.data;
    return data[data.length - 1] || data[0] || null;
  },
};

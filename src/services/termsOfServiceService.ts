import { apiClient } from './api';
import { TermsOfServiceData } from '@/types/termsOfService';

export const termsOfServiceService = {
  async getTermsOfService(): Promise<TermsOfServiceData | null> {
    const response = await apiClient.get<TermsOfServiceData[]>('/home/condition_dutilisation/');
    // Return the first active item or the first item in the array
    return response.find(item => item.active) || response[0] || null;
  },
};

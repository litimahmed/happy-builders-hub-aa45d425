import { apiClient } from './api';
import { Partner } from '@/types/partner';

export const partnerService = {
  async getPartners(): Promise<Partner[]> {
    const response = await apiClient.get<{ data: Partner[] }>('/home/partenaire/');
    return response.data;
  },
  
  async getPartnerById(id: string): Promise<Partner> {
    const response = await apiClient.get<{ data: Partner }>(`/home/partenaire/${id}/`);
    return response.data;
  },
};

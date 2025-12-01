import { useQuery } from '@tanstack/react-query';
import { termsOfServiceService } from '@/services/termsOfServiceService';
import { TermsOfServiceData } from '@/types/termsOfService';

export const useTermsOfService = () => {
  return useQuery<TermsOfServiceData | null>({
    queryKey: ['termsOfService'],
    queryFn: termsOfServiceService.getTermsOfService,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

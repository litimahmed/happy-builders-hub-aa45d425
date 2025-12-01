import { useQuery } from '@tanstack/react-query';
import { privacyPolicyService } from '@/services/privacyPolicyService';
import { PrivacyPolicyData } from '@/types/privacyPolicy';

export const usePrivacyPolicy = () => {
  return useQuery<PrivacyPolicyData | null>({
    queryKey: ['privacyPolicy'],
    queryFn: privacyPolicyService.getPrivacyPolicy,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

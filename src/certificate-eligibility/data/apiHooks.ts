import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  EligibilityRule,
  getCertificateEligibility,
  previewCertificateEligibility,
  updateCertificateEligibility,
} from './api';

export const certificateEligibilityQueryKeys = {
  all: (courseId: string) => ['certificateEligibility', courseId],
};

export const useCertificateEligibility = (courseId: string) => (
  useQuery({
    queryKey: certificateEligibilityQueryKeys.all(courseId),
    queryFn: () => getCertificateEligibility(courseId),
  })
);

export const useUpdateCertificateEligibility = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rule: EligibilityRule) => updateCertificateEligibility(courseId, rule),
    onSuccess: (data) => {
      queryClient.setQueryData(certificateEligibilityQueryKeys.all(courseId), data);
    },
  });
};

export const usePreviewCertificateEligibility = (courseId: string) => (
  useMutation({
    mutationFn: (rule: EligibilityRule) => previewCertificateEligibility(courseId, rule),
  })
);

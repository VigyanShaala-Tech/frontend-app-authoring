// @ts-check
import { camelCaseObject, getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;

export const getCertificateEligibilityApiUrl = (courseId: string) => (
  `${getApiBaseUrl()}/api/v1/certificate-eligibility/${courseId}/`
);

export const getCertificateEligibilityPreviewApiUrl = (courseId: string) => (
  `${getCertificateEligibilityApiUrl(courseId)}preview/`
);

export interface EligibilityRule {
  ruleEnabled: boolean;
  generationEnabled: boolean;
  attendanceWeight: number;
  assignmentWeight: number;
  quizWeight: number;
  requireStudentScore: boolean;
  minStudentScore: number;
  requireAttendance: boolean;
  minAttendance: number;
  requireAcceptanceRate: boolean;
  minAcceptanceRate: number;
  combinationLogic: 'all' | 'any';
  disabledRequirementHandling: 'skip' | 'exclude';
}

/**
 * Get the certificate eligibility rule of a course, with the preview of how it
 * classifies the sample scenarios.
 */
export async function getCertificateEligibility(courseId: string) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getCertificateEligibilityApiUrl(courseId));
  return camelCaseObject(data);
}

/** Save the certificate eligibility rule of a course. */
export async function updateCertificateEligibility(courseId: string, rule: EligibilityRule) {
  const { data } = await getAuthenticatedHttpClient()
    .put(getCertificateEligibilityApiUrl(courseId), snakeCaseObject(rule));
  return camelCaseObject(data);
}

/** Ask how an unsaved rule would classify the sample scenarios. Nothing is stored. */
export async function previewCertificateEligibility(courseId: string, rule: EligibilityRule) {
  const { data } = await getAuthenticatedHttpClient()
    .post(getCertificateEligibilityPreviewApiUrl(courseId), snakeCaseObject(rule));
  return camelCaseObject(data);
}

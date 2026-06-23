import { getConfig } from '@edx/frontend-platform';

// Deep links shown on items that map cleanly to an existing Studio settings page.
// Manual items with no obvious single destination page are omitted (no link rendered).
export const getLaunchChecklistUpdateLinks = (courseId, waffleFlags) => {
  const baseUrl = getConfig().STUDIO_BASE_URL;
  const isLegacyOutlineUrl = !waffleFlags.useNewCourseOutlinePage;
  const isLegacyGradingUrl = !waffleFlags.useNewGradingPage;
  const isLegacyCertificateUrl = !waffleFlags.useNewCertificatesPage;
  const isLegacyScheduleUrl = !waffleFlags.useNewScheduleDetailsPage;

  const outlineUrl = isLegacyOutlineUrl ? `${baseUrl}/course/${courseId}` : `/course/${courseId}`;
  const detailsUrl = isLegacyScheduleUrl ? `${baseUrl}/settings/details/${courseId}` : `/course/${courseId}/settings/details`;
  const certificatesUrl = isLegacyCertificateUrl ? `${baseUrl}/certificates/${courseId}` : `/course/${courseId}/certificates`;

  return {
    courseIdentity: detailsUrl,
    courseOverviewContent: detailsUrl,
    datesEnrollmentCertificates: certificatesUrl,
    sectionBuildOut: outlineUrl,
    liveClassSessions: outlineUrl,
    preRecordedContent: outlineUrl,
    quizzesAssignmentsGrading: isLegacyGradingUrl ? `${baseUrl}/settings/grading/${courseId}` : `/course/${courseId}/settings/grading`,
    assignmentDeadlines: outlineUrl,
    publishAllContent: outlineUrl,
    certificateEligibility: certificatesUrl,
    welcomeMessage: `/course/${courseId}/course_info`,
  };
};

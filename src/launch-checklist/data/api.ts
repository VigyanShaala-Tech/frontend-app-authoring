// @ts-check
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;

export const getLaunchChecklistApiUrl = (courseId: string) => (
  `${getApiBaseUrl()}/api/v1/checklist/launch/${courseId}/`
);

export const getLaunchChecklistItemApiUrl = (courseId: string, itemId: string) => (
  `${getApiBaseUrl()}/api/v1/checklist/launch/${courseId}/items/${itemId}/`
);

/**
 * Get the 18-item Launch Checklist status for a course.
 * @param {string} courseId
 */
export async function getLaunchChecklist(courseId: string) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getLaunchChecklistApiUrl(courseId));
  return camelCaseObject(data);
}

/**
 * Mark a manually-validated Launch Checklist item complete/incomplete.
 * @param {string} courseId
 * @param {string} itemId
 * @param {boolean} isCompleted
 */
export async function updateLaunchChecklistItem(courseId: string, itemId: string, isCompleted: boolean) {
  const { data } = await getAuthenticatedHttpClient()
    .patch(getLaunchChecklistItemApiUrl(courseId, itemId), { is_completed: isCompleted });
  return camelCaseObject(data);
}

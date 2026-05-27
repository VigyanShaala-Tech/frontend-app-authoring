/**
 * Canonical Open edX documentation URLs (docs.openedx.org).
 * Used when the CMS help_urls API still returns broken edx.readthedocs.io links.
 */
export const DOCS_OPENEDX_HELP_URLS = {
  default: 'https://docs.openedx.org/en/latest/educators/index.html',
  home: 'https://docs.openedx.org/en/latest/educators/quickstarts/build_a_course.html',
  developCourse: 'https://docs.openedx.org/en/latest/educators/references/course_content_development.html',
  outline: 'https://docs.openedx.org/en/latest/educators/concepts/open_edx_platform/about_course_outline.html',
  unit: 'https://docs.openedx.org/en/latest/educators/concepts/open_edx_platform/about_course_units.html',
  visibility: 'https://docs.openedx.org/en/latest/educators/references/controlling_content_visibility.html',
  updates: 'https://docs.openedx.org/en/latest/educators/concepts/communication/about_course_updates_handouts.html',
  pages: 'https://docs.openedx.org/en/latest/educators/how-tos/course_development/manage_custom_page.html',
  files: 'https://docs.openedx.org/en/latest/educators/how-tos/course_development/manage_course_files.html',
  textbooks: 'https://docs.openedx.org/en/latest/educators/how-tos/course_development/manage_textbooks.html',
  schedule: 'https://docs.openedx.org/en/latest/educators/references/course_development/about_page.html',
  grading: 'https://docs.openedx.org/en/latest/educators/concepts/grading/about_graded_subsections.html',
  teamCourse: 'https://docs.openedx.org/en/latest/educators/references/course_development/course_team_roles.html#guide-to-course-team-roles',
  teamLibrary: 'https://docs.openedx.org/en/latest/educators/how-tos/course_development/library_access.html',
  advanced: 'https://docs.openedx.org/en/latest/educators/navigation/advanced_features.html',
  checklist: 'https://docs.openedx.org/en/latest/educators/quickstarts/build_a_course.html#quick-start-build-a-course',
  importLibrary: 'https://docs.openedx.org/en/latest/educators/how-tos/course_development/export_import_library.html',
  importCourse: 'https://docs.openedx.org/en/latest/educators/how-tos/releasing-course/import_course.html',
  exportLibrary: 'https://docs.openedx.org/en/latest/educators/how-tos/course_development/export_import_library.html',
  exportCourse: 'https://docs.openedx.org/en/latest/educators/how-tos/releasing-course/export_course.html',
  welcome: 'https://docs.openedx.org/en/latest/educators/quickstarts/build_a_course.html#quick-start-build-a-course',
  login: 'https://docs.openedx.org/en/latest/educators/quickstarts/build_a_course.html#quick-start-build-a-course',
  register: 'https://docs.openedx.org/en/latest/educators/quickstarts/build_a_course.html#quick-start-build-a-course',
  contentLibraries: 'https://docs.openedx.org/en/latest/educators/navigation/content_creation_management.html#work-with-content-libraries',
  contentGroups: 'https://docs.openedx.org/en/latest/educators/navigation/advanced_features.html#manage-course-cohorts',
  enrollmentTracks: 'https://docs.openedx.org/en/latest/educators/how-tos/advanced_features/create_content_for_specific_enrollment_tracks.html',
  groupConfigurations: 'https://docs.openedx.org/en/latest/educators/concepts/advanced_features/about_group_configurations.html',
  container: 'https://docs.openedx.org/en/latest/educators/references/course_development/parent_child_components.html',
  video: 'https://docs.openedx.org/en/latest/educators/navigation/content_creation_management.html#manage-video-components',
  certificates: 'https://docs.openedx.org/en/latest/educators/navigation/creating_course.html#set-up-course-certificates',
  contentHighlights: 'https://docs.openedx.org/en/latest/educators/how-tos/course_development/manage_course_highlight_emails.html#set-course-section-highlights',
  imageAccessibility: 'https://docs.openedx.org/en/latest/educators/references/accessibility/accessibility_best_practices_checklist.html#use-best-practices-for-describing-images',
  socialSharing: 'https://docs.openedx.org/en/latest/educators/how-tos/course_development/social_sharing.html',
};

const BROKEN_DOCS_HOST = /edx\.readthedocs\.io/i;
const BROKEN_DOCS_VERSION = /\/en\/open-release-[^/]+\//i;
const BROKEN_DOCS_PATH = /\/how-tos\/(?:create-course-content|set-up-and-manage-a-course|content-libraries|advanced-features)\//i;
const BROKEN_LEARNER_DOCS = /\/learners\/(?:SFD_enrolling|SFD_update_acct_settings)\.html/i;

function resolveDocsUrl(tokenKey) {
  if (DOCS_OPENEDX_HELP_URLS[tokenKey]) {
    return DOCS_OPENEDX_HELP_URLS[tokenKey];
  }
  const camelKey = tokenKey.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  return DOCS_OPENEDX_HELP_URLS[camelKey] || DOCS_OPENEDX_HELP_URLS.default;
}

function shouldReplaceHelpUrl(url) {
  if (typeof url !== 'string' || !url) {
    return true;
  }
  return (
    BROKEN_DOCS_HOST.test(url)
    || BROKEN_DOCS_VERSION.test(url)
    || BROKEN_DOCS_PATH.test(url)
    || BROKEN_LEARNER_DOCS.test(url)
  );
}

/**
 * Normalize CMS help_urls API responses to working docs.openedx.org links.
 */
export function fixBrokenHelpUrls(urlsFromApi) {
  if (!urlsFromApi) {
    return urlsFromApi;
  }

  const fixed = { ...urlsFromApi };

  Object.keys(fixed).forEach((key) => {
    const canonical = resolveDocsUrl(key);
    if (canonical && shouldReplaceHelpUrl(fixed[key])) {
      fixed[key] = canonical;
    }
  });

  return fixed;
}

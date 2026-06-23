import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  headingTitle: {
    id: 'launchChecklistHeadingTitle',
    defaultMessage: 'Launch Checklist',
    description: 'Heading for the Launch Checklist section',
  },
  completionCountLabel: {
    id: 'launchChecklistCompletionCountLabel',
    defaultMessage: '{completed}/{total} completed',
    description: 'Label that describes how many launch checklist items have been completed out of a total',
  },
  completedItemLabel: {
    id: 'launchChecklistCompletedItemLabel',
    defaultMessage: 'completed',
    description: 'Label that describes a completed launch checklist item',
  },
  uncompletedItemLabel: {
    id: 'launchChecklistUncompletedItemLabel',
    defaultMessage: 'uncompleted',
    description: 'Label that describes an uncompleted launch checklist item',
  },
  updateLinkLabel: {
    id: 'launchChecklistUpdateLinkLabel',
    defaultMessage: 'Update',
    description: 'Label for a link that takes the user to a page where they can act on a launch checklist item',
  },
  automatedBadgeLabel: {
    id: 'launchChecklistAutomatedBadgeLabel',
    defaultMessage: 'Automatically verified',
    description: 'Badge shown on launch checklist items whose status the system detects automatically',
  },
  manualCheckboxLabel: {
    id: 'launchChecklistManualCheckboxLabel',
    defaultMessage: 'Mark as complete',
    description: 'Checkbox label for launch checklist items the course team must confirm manually',
  },
  courseIdentityShortDescription: {
    id: 'launchChecklistCourseIdentityShortDescription',
    defaultMessage: 'Set up course identity',
    description: 'Label for the course identity launch checklist item',
  },
  courseIdentityLongDescription: {
    id: 'launchChecklistCourseIdentityLongDescription',
    defaultMessage: 'Configure the course name, card image, course introduction video, and essential details such as language and pacing type to establish the course\'s identity on the platform.',
    description: 'Description for the course identity launch checklist item',
  },
  courseOverviewContentShortDescription: {
    id: 'launchChecklistCourseOverviewContentShortDescription',
    defaultMessage: 'Add course overview content',
    description: 'Label for the course overview content launch checklist item',
  },
  courseOverviewContentLongDescription: {
    id: 'launchChecklistCourseOverviewContentLongDescription',
    defaultMessage: 'Complete the About page with a course short description, course overview, instructor biography, and hours of effort per week so learners can make an informed enrollment decision.',
    description: 'Description for the course overview content launch checklist item',
  },
  datesEnrollmentCertificatesShortDescription: {
    id: 'launchChecklistDatesEnrollmentCertificatesShortDescription',
    defaultMessage: 'Configure course dates, enrollment, and certificates',
    description: 'Label for the dates, enrollment, and certificates launch checklist item',
  },
  datesEnrollmentCertificatesLongDescription: {
    id: 'launchChecklistDatesEnrollmentCertificatesLongDescription',
    defaultMessage: 'Set course start and end dates, open and close enrollment windows, and configure certificate settings including activation, signatories, and display name.',
    description: 'Description for the dates, enrollment, and certificates launch checklist item',
  },
  preProgramSurveyShortDescription: {
    id: 'launchChecklistPreProgramSurveyShortDescription',
    defaultMessage: 'Add a pre-program survey or intake form',
    description: 'Label for the pre-program survey launch checklist item',
  },
  preProgramSurveyLongDescription: {
    id: 'launchChecklistPreProgramSurveyLongDescription',
    defaultMessage: 'Embed or link a pre-program survey or intake form in the course introduction so learner baseline data can be collected before the program begins.',
    description: 'Description for the pre-program survey launch checklist item',
  },
  programResourcesUploadShortDescription: {
    id: 'launchChecklistProgramResourcesUploadShortDescription',
    defaultMessage: 'Upload and attach program calendar and resources',
    description: 'Label for the program resources upload launch checklist item',
  },
  programResourcesUploadLongDescription: {
    id: 'launchChecklistProgramResourcesUploadLongDescription',
    defaultMessage: 'Attach the program calendar, schedule documents, and any supporting reference materials so learners have access to all relevant resources from day one.',
    description: 'Description for the program resources upload launch checklist item',
  },
  sectionBuildOutShortDescription: {
    id: 'launchChecklistSectionBuildOutShortDescription',
    defaultMessage: 'Build course sections and weekly learning structure',
    description: 'Label for the section build-out launch checklist item',
  },
  sectionBuildOutLongDescription: {
    id: 'launchChecklistSectionBuildOutLongDescription',
    defaultMessage: 'Create sections and subsections that reflect the weekly or modular learning structure, ensuring the course outline is logical, complete, and easy to navigate.',
    description: 'Description for the section build-out launch checklist item',
  },
  liveClassSessionsShortDescription: {
    id: 'launchChecklistLiveClassSessionsShortDescription',
    defaultMessage: 'Add live class links and session details',
    description: 'Label for the live class sessions launch checklist item',
  },
  liveClassSessionsLongDescription: {
    id: 'launchChecklistLiveClassSessionsLongDescription',
    defaultMessage: 'Include live sessions within the appropriate units so learners can access them easily.',
    description: 'Description for the live class sessions launch checklist item',
  },
  preRecordedContentShortDescription: {
    id: 'launchChecklistPreRecordedContentShortDescription',
    defaultMessage: 'Upload pre-recorded videos and learning resources',
    description: 'Label for the pre-recorded content launch checklist item',
  },
  preRecordedContentLongDescription: {
    id: 'launchChecklistPreRecordedContentLongDescription',
    defaultMessage: 'Add video content, text content, PDFs, etc. to the relevant units and verify that all media loads and plays correctly.',
    description: 'Description for the pre-recorded content launch checklist item',
  },
  quizzesAssignmentsGradingShortDescription: {
    id: 'launchChecklistQuizzesAssignmentsGradingShortDescription',
    defaultMessage: 'Add quizzes, assignments, and grading settings',
    description: 'Label for the quizzes, assignments, and grading launch checklist item',
  },
  quizzesAssignmentsGradingLongDescription: {
    id: 'launchChecklistQuizzesAssignmentsGradingLongDescription',
    defaultMessage: 'Create assessments and questions, and configure grading settings including assignment types, weights, and passing scores, ensuring the grading policy adds up to 100%.',
    description: 'Description for the quizzes, assignments, and grading launch checklist item',
  },
  assignmentDeadlinesShortDescription: {
    id: 'launchChecklistAssignmentDeadlinesShortDescription',
    defaultMessage: 'Configure assignment deadlines and submission flow',
    description: 'Label for the assignment deadlines launch checklist item',
  },
  assignmentDeadlinesLongDescription: {
    id: 'launchChecklistAssignmentDeadlinesLongDescription',
    defaultMessage: 'Set due dates for all assignments and verify the end-to-end submission experience, ensuring deadlines fall within the course start and end dates.',
    description: 'Description for the assignment deadlines launch checklist item',
  },
  postProgramFeedbackShortDescription: {
    id: 'launchChecklistPostProgramFeedbackShortDescription',
    defaultMessage: 'Add a feedback form or post-program survey',
    description: 'Label for the post-program feedback launch checklist item',
  },
  postProgramFeedbackLongDescription: {
    id: 'launchChecklistPostProgramFeedbackLongDescription',
    defaultMessage: 'Include a post-program feedback form or survey in the final section of the course to collect learner reflections and satisfaction data upon completion.',
    description: 'Description for the post-program feedback launch checklist item',
  },
  navigationFlowReviewShortDescription: {
    id: 'launchChecklistNavigationFlowReviewShortDescription',
    defaultMessage: 'Verify navigation flow and content order',
    description: 'Label for the navigation flow review launch checklist item',
  },
  navigationFlowReviewLongDescription: {
    id: 'launchChecklistNavigationFlowReviewLongDescription',
    defaultMessage: 'Review the full course outline from the student perspective to confirm that sections, subsections, and units follow a logical, intuitive sequence with no gaps or misplaced content.',
    description: 'Description for the navigation flow review launch checklist item',
  },
  learnerPreviewValidationShortDescription: {
    id: 'launchChecklistLearnerPreviewValidationShortDescription',
    defaultMessage: 'Preview and validate all content in learner view',
    description: 'Label for the learner preview validation launch checklist item',
  },
  learnerPreviewValidationLongDescription: {
    id: 'launchChecklistLearnerPreviewValidationLongDescription',
    defaultMessage: 'Open the learner preview and verify that all links, PDFs, embedded forms, and videos load and function correctly before the course is published.',
    description: 'Description for the learner preview validation launch checklist item',
  },
  publishAllContentShortDescription: {
    id: 'launchChecklistPublishAllContentShortDescription',
    defaultMessage: 'Publish all sections, units, and components',
    description: 'Label for the publish all content launch checklist item',
  },
  publishAllContentLongDescription: {
    id: 'launchChecklistPublishAllContentLongDescription',
    defaultMessage: 'Ensure every section, subsection, unit, and component is explicitly published so no content remains hidden from enrolled learners after launch.',
    description: 'Description for the publish all content launch checklist item',
  },
  studentJourneyTestShortDescription: {
    id: 'launchChecklistStudentJourneyTestShortDescription',
    defaultMessage: 'Test the complete student journey',
    description: 'Label for the student journey test launch checklist item',
  },
  studentJourneyTestLongDescription: {
    id: 'launchChecklistStudentJourneyTestLongDescription',
    defaultMessage: 'Walk through the entire course as a learner, from enrollment through content consumption, assessment submission, and completion, to validate the end-to-end experience.',
    description: 'Description for the student journey test launch checklist item',
  },
  certificateEligibilityShortDescription: {
    id: 'launchChecklistCertificateEligibilityShortDescription',
    defaultMessage: 'Verify certificate eligibility and completion criteria',
    description: 'Label for the certificate eligibility launch checklist item',
  },
  certificateEligibilityLongDescription: {
    id: 'launchChecklistCertificateEligibilityLongDescription',
    defaultMessage: 'Confirm that certificate requirements, including minimum passing grade and completion conditions, are correctly configured and that the certificate is activated and displays properly.',
    description: 'Description for the certificate eligibility launch checklist item',
  },
  finalQACheckShortDescription: {
    id: 'launchChecklistFinalQACheckShortDescription',
    defaultMessage: 'Perform final QA check',
    description: 'Label for the final QA check launch checklist item',
  },
  finalQACheckLongDescription: {
    id: 'launchChecklistFinalQACheckLongDescription',
    defaultMessage: 'Conduct a thorough final review covering UI consistency, mobile responsiveness, missing or broken content, accessibility considerations, and any platform-specific display issues before go-live.',
    description: 'Description for the final QA check launch checklist item',
  },
  welcomeMessageShortDescription: {
    id: 'launchChecklistWelcomeMessageShortDescription',
    defaultMessage: 'Add a welcome message',
    description: 'Label for the welcome message launch checklist item',
  },
  welcomeMessageLongDescription: {
    id: 'launchChecklistWelcomeMessageLongDescription',
    defaultMessage: 'Personally welcome learners into your course and prepare learners for a positive course experience.',
    description: 'Description for the welcome message launch checklist item',
  },
});

export default messages;

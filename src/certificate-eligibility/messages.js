import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  sectionTitle: {
    id: 'course-authoring.certificate-eligibility.title',
    defaultMessage: 'Certificate eligibility',
    description: 'Title of the certificate eligibility section on the Grading page',
  },
  sectionDescription: {
    id: 'course-authoring.certificate-eligibility.description',
    defaultMessage: 'Decide how attendance, assignments and quizzes combine into a Student Score, and what a learner must reach to earn the certificate.',
    description: 'Description of the certificate eligibility section',
  },
  standardCertificates: {
    id: 'course-authoring.certificate-eligibility.standard-certificates',
    defaultMessage: 'This course uses the standard certificate behaviour: a certificate is generated when the learner reaches a passing grade. Turn on the rule below to use attendance, assignments and quizzes instead.',
    description: 'Notice shown while the eligibility rule is switched off for the course',
  },
  ruleEnabledLabel: {
    id: 'course-authoring.certificate-eligibility.rule-enabled.label',
    defaultMessage: 'Use this eligibility rule for certificates',
    description: 'Label of the switch that makes the course use the eligibility rule',
  },
  ruleEnabledHelp: {
    id: 'course-authoring.certificate-eligibility.rule-enabled.help',
    defaultMessage: 'When on, the rule below replaces the passing grade as the condition for a certificate. Certificates already issued are not affected.',
    description: 'Help text of the switch that makes the course use the eligibility rule',
  },
  previewRuleOff: {
    id: 'course-authoring.certificate-eligibility.preview.rule-off',
    defaultMessage: 'Rule is off',
    description: 'Preview outcome while the eligibility rule is switched off for the course',
  },
  loadError: {
    id: 'course-authoring.certificate-eligibility.load-error',
    defaultMessage: 'The certificate eligibility rule could not be loaded.',
    description: 'Error shown when the rule cannot be fetched',
  },
  generationLabel: {
    id: 'course-authoring.certificate-eligibility.generation.label',
    defaultMessage: 'Generate certificates for this course',
    description: 'Label of the switch that turns certificate generation on or off for the course',
  },
  generationHelp: {
    id: 'course-authoring.certificate-eligibility.generation.help',
    defaultMessage: 'When this is off, no certificate is generated for this course, whatever the learner has achieved.',
    description: 'Help text of the certificate generation switch',
  },
  weightsTitle: {
    id: 'course-authoring.certificate-eligibility.weights.title',
    defaultMessage: 'Student Score weightage',
    description: 'Title of the weightage inputs',
  },
  weightsFormula: {
    id: 'course-authoring.certificate-eligibility.weights.formula',
    defaultMessage: 'Student Score = (Attendance % × {attendance}%) + (Assignment Score × {assignment}%) + (Quiz Score × {quiz}%)',
    description: 'The Student Score formula with the current weightages',
  },
  weightsTotal: {
    id: 'course-authoring.certificate-eligibility.weights.total',
    defaultMessage: 'Total: {total}%',
    description: 'Sum of the three weightages',
  },
  weightsTotalError: {
    id: 'course-authoring.certificate-eligibility.weights.total-error',
    defaultMessage: 'The three weightages must add up to 100%.',
    description: 'Error shown when the weightages do not total 100',
  },
  attendanceWeight: {
    id: 'course-authoring.certificate-eligibility.weights.attendance',
    defaultMessage: 'Attendance',
    description: 'Label of the attendance weightage input',
  },
  assignmentWeight: {
    id: 'course-authoring.certificate-eligibility.weights.assignment',
    defaultMessage: 'Assignment score',
    description: 'Label of the assignment score weightage input',
  },
  quizWeight: {
    id: 'course-authoring.certificate-eligibility.weights.quiz',
    defaultMessage: 'Quiz score',
    description: 'Label of the quiz score weightage input',
  },
  requirementsTitle: {
    id: 'course-authoring.certificate-eligibility.requirements.title',
    defaultMessage: 'Qualification requirements',
    description: 'Title of the list of qualification requirements',
  },
  requirementsHelp: {
    id: 'course-authoring.certificate-eligibility.requirements.help',
    defaultMessage: 'A requirement is met when the learner is above its minimum. Turn a requirement off to leave it out of the decision; its minimum is kept.',
    description: 'Help text for the qualification requirements',
  },
  requirementsError: {
    id: 'course-authoring.certificate-eligibility.requirements.error',
    defaultMessage: 'Keep at least one requirement turned on.',
    description: 'Error shown when every requirement is turned off',
  },
  requirementStudentScore: {
    id: 'course-authoring.certificate-eligibility.requirements.student-score',
    defaultMessage: 'Student Score',
    description: 'Name of the Student Score requirement',
  },
  requirementAttendance: {
    id: 'course-authoring.certificate-eligibility.requirements.attendance',
    defaultMessage: 'Attendance %',
    description: 'Name of the attendance requirement',
  },
  requirementAcceptanceRate: {
    id: 'course-authoring.certificate-eligibility.requirements.acceptance-rate',
    defaultMessage: 'Assignment acceptance rate',
    description: 'Name of the assignment acceptance rate requirement',
  },
  minimumLabel: {
    id: 'course-authoring.certificate-eligibility.requirements.minimum',
    defaultMessage: 'Must be above (%)',
    description: 'Label of a requirement threshold input',
  },
  rangeError: {
    id: 'course-authoring.certificate-eligibility.range-error',
    defaultMessage: 'Enter a value between 0 and 100.',
    description: 'Error shown for a percentage outside 0 to 100',
  },
  logicTitle: {
    id: 'course-authoring.certificate-eligibility.logic.title',
    defaultMessage: 'How the active requirements combine',
    description: 'Title of the ALL / ANY choice',
  },
  logicAll: {
    id: 'course-authoring.certificate-eligibility.logic.all',
    defaultMessage: 'ALL active requirements must be met (AND)',
    description: 'Option: every active requirement must be met',
  },
  logicAny: {
    id: 'course-authoring.certificate-eligibility.logic.any',
    defaultMessage: 'ANY one active requirement is enough (OR)',
    description: 'Option: a single met requirement is enough',
  },
  disabledTitle: {
    id: 'course-authoring.certificate-eligibility.disabled.title',
    defaultMessage: 'When a requirement is turned off',
    description: 'Title of the choice of what turning a requirement off means',
  },
  disabledSkip: {
    id: 'course-authoring.certificate-eligibility.disabled.skip',
    defaultMessage: 'Only skip its check. Attendance and assignment score still count in the Student Score.',
    description: 'Option: a turned-off requirement is not checked but still counts in the score',
  },
  disabledExclude: {
    id: 'course-authoring.certificate-eligibility.disabled.exclude',
    defaultMessage: 'Leave it out entirely. Its part is also removed from the Student Score and the other weightages are scaled up.',
    description: 'Option: a turned-off requirement is also removed from the score',
  },
  previewTitle: {
    id: 'course-authoring.certificate-eligibility.preview.title',
    defaultMessage: 'Preview',
    description: 'Title of the preview of sample scenarios',
  },
  previewHelp: {
    id: 'course-authoring.certificate-eligibility.preview.help',
    defaultMessage: 'How the rule above, saved or not, would treat three sample learners.',
    description: 'Help text of the preview',
  },
  previewScenario: {
    id: 'course-authoring.certificate-eligibility.preview.scenario',
    defaultMessage: 'Sample learner',
    description: 'Preview column: scenario name',
  },
  previewAssignmentScore: {
    id: 'course-authoring.certificate-eligibility.preview.assignment-score',
    defaultMessage: 'Assignment score',
    description: 'Preview column: assignment score',
  },
  previewQuizScore: {
    id: 'course-authoring.certificate-eligibility.preview.quiz-score',
    defaultMessage: 'Quiz score',
    description: 'Preview column: quiz score',
  },
  previewOutcome: {
    id: 'course-authoring.certificate-eligibility.preview.outcome',
    defaultMessage: 'Outcome',
    description: 'Preview column: outcome',
  },
  previewEligible: {
    id: 'course-authoring.certificate-eligibility.preview.eligible',
    defaultMessage: 'Certificate generated',
    description: 'Preview outcome: the learner earns the certificate',
  },
  previewNotEligible: {
    id: 'course-authoring.certificate-eligibility.preview.not-eligible',
    defaultMessage: 'Not generated',
    description: 'Preview outcome: the learner does not earn the certificate',
  },
  previewGenerationOff: {
    id: 'course-authoring.certificate-eligibility.preview.generation-off',
    defaultMessage: 'Generation is off',
    description: 'Preview outcome while certificate generation is turned off for the course',
  },
  previewOutdated: {
    id: 'course-authoring.certificate-eligibility.preview.outdated',
    defaultMessage: 'Fix the highlighted fields to refresh the preview.',
    description: 'Shown when the preview cannot follow an invalid rule',
  },
  scenarioEligible: {
    id: 'course-authoring.certificate-eligibility.scenario.eligible',
    defaultMessage: 'Eligible student',
    description: 'Name of sample scenario 1',
  },
  scenarioLowAcceptance: {
    id: 'course-authoring.certificate-eligibility.scenario.low-acceptance',
    defaultMessage: 'Low assignment acceptance rate',
    description: 'Name of sample scenario 2',
  },
  scenarioLowScoreAttendance: {
    id: 'course-authoring.certificate-eligibility.scenario.low-score-attendance',
    defaultMessage: 'Low Student Score and attendance',
    description: 'Name of sample scenario 3',
  },
  saveButton: {
    id: 'course-authoring.certificate-eligibility.save',
    defaultMessage: 'Save certificate eligibility',
    description: 'Button that saves the rule',
  },
  savingButton: {
    id: 'course-authoring.certificate-eligibility.saving',
    defaultMessage: 'Saving',
    description: 'Save button label while saving',
  },
  resetButton: {
    id: 'course-authoring.certificate-eligibility.reset',
    defaultMessage: 'Discard changes',
    description: 'Button that restores the saved rule',
  },
  saveSuccess: {
    id: 'course-authoring.certificate-eligibility.save-success',
    defaultMessage: 'Certificate eligibility saved. It applies the next time a learner is evaluated.',
    description: 'Shown after the rule is saved',
  },
  saveError: {
    id: 'course-authoring.certificate-eligibility.save-error',
    defaultMessage: 'The certificate eligibility rule could not be saved. Please try again.',
    description: 'Shown when saving the rule fails',
  },
});

export default messages;

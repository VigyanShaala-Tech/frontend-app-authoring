export const WEIGHT_FIELDS = ['attendanceWeight', 'assignmentWeight', 'quizWeight'];

export const REQUIREMENTS = [
  { id: 'student_score', toggle: 'requireStudentScore', threshold: 'minStudentScore' },
  { id: 'attendance', toggle: 'requireAttendance', threshold: 'minAttendance' },
  { id: 'acceptance_rate', toggle: 'requireAcceptanceRate', threshold: 'minAcceptanceRate' },
];

const PERCENT_FIELDS = [...WEIGHT_FIELDS, ...REQUIREMENTS.map((requirement) => requirement.threshold)];

const toNumber = (value) => (value === '' || value === null || value === undefined ? NaN : Number(value));

export const isPercent = (value) => {
  const number = toNumber(value);
  return !Number.isNaN(number) && number >= 0 && number <= 100;
};

export const getWeightTotal = (rule) => (
  Math.round(WEIGHT_FIELDS.reduce((total, field) => total + (toNumber(rule[field]) || 0), 0) * 100) / 100
);

/**
 * Field-level problems that stop a rule from being saved; the same checks as the API.
 * Returns an object keyed by field name, plus `weights` and `requirements`.
 */
export const getRuleErrors = (rule) => {
  const errors = {};
  PERCENT_FIELDS.forEach((field) => {
    if (!isPercent(rule[field])) {
      errors[field] = true;
    }
  });
  if (!WEIGHT_FIELDS.some((field) => errors[field]) && getWeightTotal(rule) !== 100) {
    errors.weights = true;
  }
  if (!REQUIREMENTS.some((requirement) => rule[requirement.toggle])) {
    errors.requirements = true;
  }
  return errors;
};

/** The rule as the API expects it: percentages as numbers. */
export const toApiRule = (rule) => ({
  ...rule,
  ...Object.fromEntries(PERCENT_FIELDS.map((field) => [field, Number(rule[field])])),
});

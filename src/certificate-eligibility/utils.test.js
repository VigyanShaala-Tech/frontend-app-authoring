import { getRuleErrors, getWeightTotal, toApiRule } from './utils';

const rule = {
  ruleEnabled: true,
  generationEnabled: true,
  attendanceWeight: 40,
  assignmentWeight: 40,
  quizWeight: 20,
  requireStudentScore: true,
  minStudentScore: 75,
  requireAttendance: true,
  minAttendance: 75,
  requireAcceptanceRate: true,
  minAcceptanceRate: 75,
  combinationLogic: 'all',
  disabledRequirementHandling: 'skip',
};

describe('certificate eligibility rule checks', () => {
  it('accepts the default rule', () => {
    expect(getRuleErrors(rule)).toEqual({});
    expect(getWeightTotal(rule)).toBe(100);
  });

  it('rejects weightages that do not total 100', () => {
    expect(getRuleErrors({ ...rule, quizWeight: '30' })).toEqual({ weights: true });
  });

  it('rejects an empty or out-of-range percentage', () => {
    expect(getRuleErrors({ ...rule, minAttendance: '' }).minAttendance).toBe(true);
    expect(getRuleErrors({ ...rule, minStudentScore: 120 }).minStudentScore).toBe(true);
  });

  it('rejects a rule with every requirement turned off', () => {
    const allOff = {
      ...rule, requireStudentScore: false, requireAttendance: false, requireAcceptanceRate: false,
    };
    expect(getRuleErrors(allOff)).toEqual({ requirements: true });
  });

  it('sends typed percentages as numbers', () => {
    expect(toApiRule({ ...rule, attendanceWeight: '35.5' }).attendanceWeight).toBe(35.5);
  });
});

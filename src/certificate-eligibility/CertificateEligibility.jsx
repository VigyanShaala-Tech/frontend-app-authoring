import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert, Badge, Button, Form, StatefulButton,
} from '@openedx/paragon';

import { STATEFUL_BUTTON_STATES } from '../constants';
import SectionSubHeader from '../generic/section-sub-header';
import { LoadingSpinner } from '../generic/Loading';
import {
  useCertificateEligibility,
  usePreviewCertificateEligibility,
  useUpdateCertificateEligibility,
} from './data/apiHooks';
import messages from './messages';
import {
  getRuleErrors, getWeightTotal, REQUIREMENTS, toApiRule, WEIGHT_FIELDS,
} from './utils';

const WEIGHT_LABELS = {
  attendanceWeight: messages.attendanceWeight,
  assignmentWeight: messages.assignmentWeight,
  quizWeight: messages.quizWeight,
};

const REQUIREMENT_LABELS = {
  student_score: messages.requirementStudentScore,
  attendance: messages.requirementAttendance,
  acceptance_rate: messages.requirementAcceptanceRate,
};

const SCENARIO_LABELS = {
  eligible: messages.scenarioEligible,
  low_acceptance: messages.scenarioLowAcceptance,
  low_score_attendance: messages.scenarioLowScoreAttendance,
};

const PREVIEW_DELAY_MS = 400;

/**
 * Certificate eligibility rule of a course, shown as a section of the Grading page.
 * It loads and saves on its own, separately from the grading policy above it.
 */
const CertificateEligibility = ({ courseId }) => {
  const intl = useIntl();
  const { data, isPending: isLoading, isError } = useCertificateEligibility(courseId);
  const saveMutation = useUpdateCertificateEligibility(courseId);
  const previewMutation = usePreviewCertificateEligibility(courseId);

  const [rule, setRule] = useState(null);
  const [preview, setPreview] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  // Start from (and return to) whatever the server has.
  useEffect(() => {
    if (data?.rule) {
      setRule(data.rule);
      setPreview(data.preview || []);
    }
  }, [data]);

  const errors = useMemo(() => (rule ? getRuleErrors(rule) : {}), [rule]);
  const isValid = Object.keys(errors).length === 0;
  const isDirty = !!rule && !!data?.rule && JSON.stringify(toApiRule(rule)) !== JSON.stringify(toApiRule(data.rule));

  // Keep the preview in step with what is on screen, saved or not.
  const { mutate: requestPreview } = previewMutation;
  useEffect(() => {
    if (!rule || !isDirty || !isValid) {
      return undefined;
    }
    const timer = setTimeout(() => {
      requestPreview(toApiRule(rule), { onSuccess: (result) => setPreview(result.preview || []) });
    }, PREVIEW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [rule, isDirty, isValid, requestPreview]);

  if (isError) {
    return (
      <section className="mt-5" data-testid="certificate-eligibility">
        <SectionSubHeader title={intl.formatMessage(messages.sectionTitle)} />
        <Alert variant="danger">{intl.formatMessage(messages.loadError)}</Alert>
      </section>
    );
  }

  if (isLoading || !rule) {
    return (
      <section className="mt-5" data-testid="certificate-eligibility">
        <SectionSubHeader title={intl.formatMessage(messages.sectionTitle)} />
        <div className="row justify-content-center"><LoadingSpinner /></div>
      </section>
    );
  }

  const setField = (field, value) => {
    setShowSaved(false);
    setRule((current) => ({ ...current, [field]: value }));
  };

  const handleReset = () => {
    setRule(data.rule);
    setPreview(data.preview || []);
    saveMutation.reset();
  };

  const handleSave = () => {
    saveMutation.mutate(toApiRule(rule), { onSuccess: () => setShowSaved(true) });
  };

  const weightTotal = getWeightTotal(rule);
  const shownPreview = isDirty && !isValid ? [] : preview;

  const percentInput = (field, label, hideLabel = false) => (
    <Form.Group controlId={`certificate-eligibility-${field}`} isInvalid={!!errors[field]} className="mb-0">
      <Form.Label className={hideLabel ? 'sr-only' : undefined}>{label}</Form.Label>
      <Form.Control
        type="number"
        min={0}
        max={100}
        step="any"
        value={rule[field]}
        onChange={(event) => setField(field, event.target.value)}
        trailingElement="%"
      />
      {errors[field] && (
        <Form.Control.Feedback type="invalid">{intl.formatMessage(messages.rangeError)}</Form.Control.Feedback>
      )}
    </Form.Group>
  );

  return (
    <section className="mt-5" data-testid="certificate-eligibility">
      <SectionSubHeader
        title={intl.formatMessage(messages.sectionTitle)}
        description={intl.formatMessage(messages.sectionDescription)}
      />

      {!rule.ruleEnabled && (
        <Alert variant="info" className="mb-3">{intl.formatMessage(messages.standardCertificates)}</Alert>
      )}
      {showSaved && !isDirty && (
        <Alert variant="success" className="mb-3" dismissible onClose={() => setShowSaved(false)}>
          {intl.formatMessage(messages.saveSuccess)}
        </Alert>
      )}
      {saveMutation.isError && (
        <Alert variant="danger" className="mb-3">{intl.formatMessage(messages.saveError)}</Alert>
      )}

      <div className="bg-white border p-4 mb-3">
        <Form.Switch
          checked={rule.ruleEnabled}
          onChange={(event) => setField('ruleEnabled', event.target.checked)}
          helperText={intl.formatMessage(messages.ruleEnabledHelp)}
        >
          {intl.formatMessage(messages.ruleEnabledLabel)}
        </Form.Switch>
      </div>

      <div className="bg-white border p-4 mb-3">
        <Form.Switch
          checked={rule.generationEnabled}
          onChange={(event) => setField('generationEnabled', event.target.checked)}
          helperText={intl.formatMessage(messages.generationHelp)}
        >
          {intl.formatMessage(messages.generationLabel)}
        </Form.Switch>
      </div>

      <div className="bg-white border p-4 mb-3">
        <h3 className="h5">{intl.formatMessage(messages.weightsTitle)}</h3>
        <p className="small text-gray-700">
          {intl.formatMessage(messages.weightsFormula, {
            attendance: rule.attendanceWeight === '' ? '?' : rule.attendanceWeight,
            assignment: rule.assignmentWeight === '' ? '?' : rule.assignmentWeight,
            quiz: rule.quizWeight === '' ? '?' : rule.quizWeight,
          })}
        </p>
        <div className="row">
          {WEIGHT_FIELDS.map((field) => (
            <div className="col-12 col-md-4 mb-3" key={field}>
              {percentInput(field, intl.formatMessage(WEIGHT_LABELS[field]))}
            </div>
          ))}
        </div>
        <div className={errors.weights ? 'text-danger font-weight-bold' : 'text-gray-700'}>
          {intl.formatMessage(messages.weightsTotal, { total: weightTotal })}
          {errors.weights && ` — ${intl.formatMessage(messages.weightsTotalError)}`}
        </div>
      </div>

      <div className="bg-white border p-4 mb-3">
        <h3 className="h5">{intl.formatMessage(messages.requirementsTitle)}</h3>
        <p className="small text-gray-700">{intl.formatMessage(messages.requirementsHelp)}</p>
        {REQUIREMENTS.map((requirement) => (
          <div className="row align-items-center border-top py-3 mx-0" key={requirement.id}>
            <div className="col-12 col-md-7 px-0">
              <Form.Switch
                checked={rule[requirement.toggle]}
                onChange={(event) => setField(requirement.toggle, event.target.checked)}
              >
                {intl.formatMessage(REQUIREMENT_LABELS[requirement.id])}
              </Form.Switch>
            </div>
            <div className="col-12 col-md-5 px-0 mt-2 mt-md-0">
              {percentInput(
                requirement.threshold,
                `${intl.formatMessage(REQUIREMENT_LABELS[requirement.id])}: ${intl.formatMessage(messages.minimumLabel)}`,
                true,
              )}
              <div className="small text-gray-700 mt-1">{intl.formatMessage(messages.minimumLabel)}</div>
            </div>
          </div>
        ))}
        {errors.requirements && (
          <div className="text-danger font-weight-bold">{intl.formatMessage(messages.requirementsError)}</div>
        )}

        <Form.Group className="mt-4 mb-0">
          <Form.Label className="font-weight-bold">{intl.formatMessage(messages.logicTitle)}</Form.Label>
          <Form.RadioSet
            name="certificate-eligibility-logic"
            value={rule.combinationLogic}
            onChange={(event) => setField('combinationLogic', event.target.value)}
          >
            <Form.Radio value="all">{intl.formatMessage(messages.logicAll)}</Form.Radio>
            <Form.Radio value="any">{intl.formatMessage(messages.logicAny)}</Form.Radio>
          </Form.RadioSet>
        </Form.Group>

        <Form.Group className="mt-4 mb-0">
          <Form.Label className="font-weight-bold">{intl.formatMessage(messages.disabledTitle)}</Form.Label>
          <Form.RadioSet
            name="certificate-eligibility-disabled"
            value={rule.disabledRequirementHandling}
            onChange={(event) => setField('disabledRequirementHandling', event.target.value)}
          >
            <Form.Radio value="skip">{intl.formatMessage(messages.disabledSkip)}</Form.Radio>
            <Form.Radio value="exclude">{intl.formatMessage(messages.disabledExclude)}</Form.Radio>
          </Form.RadioSet>
        </Form.Group>
      </div>

      <div className="bg-white border p-4 mb-3" data-testid="certificate-eligibility-preview">
        <h3 className="h5">{intl.formatMessage(messages.previewTitle)}</h3>
        <p className="small text-gray-700">{intl.formatMessage(messages.previewHelp)}</p>
        {shownPreview.length === 0 ? (
          <div className="text-gray-700">{intl.formatMessage(messages.previewOutdated)}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm mb-0">
              <thead>
                <tr>
                  <th scope="col" className="pr-3">{intl.formatMessage(messages.previewScenario)}</th>
                  <th scope="col" className="pr-3">{intl.formatMessage(messages.requirementAttendance)}</th>
                  <th scope="col" className="pr-3">{intl.formatMessage(messages.previewAssignmentScore)}</th>
                  <th scope="col" className="pr-3">{intl.formatMessage(messages.previewQuizScore)}</th>
                  <th scope="col" className="pr-3">{intl.formatMessage(messages.requirementAcceptanceRate)}</th>
                  <th scope="col" className="pr-3">{intl.formatMessage(messages.requirementStudentScore)}</th>
                  <th scope="col" className="pr-3">{intl.formatMessage(messages.previewOutcome)}</th>
                </tr>
              </thead>
              <tbody>
                {shownPreview.map((scenario) => {
                  let outcome = { variant: 'danger', label: messages.previewNotEligible };
                  if (!rule.ruleEnabled) {
                    outcome = { variant: 'light', label: messages.previewRuleOff };
                  } else if (!rule.generationEnabled) {
                    outcome = { variant: 'light', label: messages.previewGenerationOff };
                  } else if (scenario.eligible) {
                    outcome = { variant: 'success', label: messages.previewEligible };
                  }
                  return (
                    <tr key={scenario.id}>
                      <th scope="row" className="font-weight-normal">
                        {SCENARIO_LABELS[scenario.id]
                          ? intl.formatMessage(SCENARIO_LABELS[scenario.id])
                          : scenario.name}
                      </th>
                      <td className="pr-3">{scenario.metrics.attendance}%</td>
                      <td className="pr-3">{scenario.metrics.assignmentScore}%</td>
                      <td className="pr-3">{scenario.metrics.quizScore}%</td>
                      <td className="pr-3">{scenario.metrics.acceptanceRate}%</td>
                      <td className="font-weight-bold pr-3">{scenario.studentScore}%</td>
                      <td><Badge variant={outcome.variant}>{intl.formatMessage(outcome.label)}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end">
        {isDirty && (
          <Button variant="tertiary" className="mr-2" onClick={handleReset} disabled={saveMutation.isPending}>
            {intl.formatMessage(messages.resetButton)}
          </Button>
        )}
        <StatefulButton
          onClick={handleSave}
          state={saveMutation.isPending ? STATEFUL_BUTTON_STATES.pending : STATEFUL_BUTTON_STATES.default}
          labels={{
            default: intl.formatMessage(messages.saveButton),
            pending: intl.formatMessage(messages.savingButton),
          }}
          disabledStates={[STATEFUL_BUTTON_STATES.pending]}
          disabled={!isValid || (!isDirty && !data.isDefault)}
        />
      </div>
    </section>
  );
};

CertificateEligibility.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default CertificateEligibility;

import React from 'react';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-textarea-autosize';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';

import { SCHEDULE_DETAILS_UI } from '../../featureFlags';
import messages from './messages';

const ExtendedCourseDetails = ({
  title,
  subtitle,
  duration,
  description,
  onChange,
}) => {
  const intl = useIntl();
  const paramsForExtendedFields = [
    {
      value: title,
      label: intl.formatMessage(messages.extendedTitleLabel),
      helpText: intl.formatMessage(messages.extendedTitleHelpText),
      ariaLabel: intl.formatMessage(messages.extendedTitleAriaLabel),
      controlName: 'title',
    },
    {
      value: subtitle,
      label: intl.formatMessage(messages.extendedSubtitleLabel),
      helpText: intl.formatMessage(messages.extendedSubtitleHelpText),
      ariaLabel: intl.formatMessage(messages.extendedSubtitleAriaLabel),
      controlName: 'subtitle',
    },
    {
      value: duration,
      label: intl.formatMessage(messages.extendedDurationLabel),
      helpText: intl.formatMessage(messages.extendedDurationHelpText),
      ariaLabel: intl.formatMessage(messages.extendedDurationAriaLabel),
      controlName: 'duration',
      maxLength: 50,
    },
    {
      value: description,
      label: intl.formatMessage(messages.extendedDescriptionLabel),
      helpText: intl.formatMessage(messages.extendedDescriptionHelpText),
      ariaLabel: intl.formatMessage(messages.extendedDescriptionAriaLabel),
      controlName: 'description',
      maxLength: 1000,
      asTextarea: true,
    },
  ];

  const visibleFields = paramsForExtendedFields.filter((param) => {
    if (SCHEDULE_DETAILS_UI.hideCourseTitle && param.controlName === 'title') {
      return false;
    }
    if (SCHEDULE_DETAILS_UI.hideCourseSubtitle && param.controlName === 'subtitle') {
      return false;
    }
    if (SCHEDULE_DETAILS_UI.hideCourseDuration && param.controlName === 'duration') {
      return false;
    }
    if (SCHEDULE_DETAILS_UI.hideCourseDescription && param.controlName === 'description') {
      return false;
    }
    return true;
  });

  return (
    <>
      {visibleFields.map((param) => (
        <Form.Group className="form-group-custom" key={param.label}>
          <Form.Label>{param.label}</Form.Label>
          <Form.Control
            as={param.asTextarea ? TextareaAutosize : 'input'}
            value={param.value}
            name={param.controlName}
            {...(param.maxLength != null ? { maxLength: param.maxLength } : {})}
            onChange={(e) => onChange(e.target.value, param.controlName)}
            aria-label={param.ariaLabel}
          />
          <Form.Control.Feedback>{param.helpText}</Form.Control.Feedback>
        </Form.Group>
      ))}
    </>
  );
};

ExtendedCourseDetails.defaultProps = {
  title: '',
  subtitle: '',
  duration: '',
  description: '',
};

ExtendedCourseDetails.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  duration: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ExtendedCourseDetails;

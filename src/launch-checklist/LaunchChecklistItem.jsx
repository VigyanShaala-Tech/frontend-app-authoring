import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { ActionRow, Badge, Button, Form, Icon } from '@openedx/paragon';
import { CheckCircle, RadioButtonUnchecked } from '@openedx/paragon/icons';

import messages from './messages';

const LaunchChecklistItem = ({
  itemId,
  isAutomated,
  isCompleted,
  updateLink,
  isToggling,
  onToggleManual,
}) => {
  const intl = useIntl();

  return (
    <ActionRow>
      <div className="mr-3" id={`icon-${itemId}`} data-testid={`icon-${itemId}`}>
        {isCompleted ? (
          <Icon
            data-testid="completed-icon"
            src={CheckCircle}
            className="text-success"
            style={{ height: '32px', width: '32px' }}
            screenReaderText={intl.formatMessage(messages.completedItemLabel)}
          />
        ) : (
          <Icon
            data-testid="uncompleted-icon"
            src={RadioButtonUnchecked}
            style={{ height: '32px', width: '32px' }}
            screenReaderText={intl.formatMessage(messages.uncompletedItemLabel)}
          />
        )}
      </div>
      <div>
        <div>
          <FormattedMessage {...messages[`${itemId}ShortDescription`]} />
          {isAutomated && (
            <Badge variant="light" className="ml-2" data-testid={`automated-badge-${itemId}`}>
              <FormattedMessage {...messages.automatedBadgeLabel} />
            </Badge>
          )}
        </div>
        <div className="small">
          <FormattedMessage {...messages[`${itemId}LongDescription`]} />
        </div>
        {!isAutomated && (
          <Form.Checkbox
            className="mt-2"
            checked={isCompleted}
            disabled={isToggling}
            onChange={(e) => onToggleManual(e.target.checked)}
            data-testid={`manual-checkbox-${itemId}`}
          >
            <FormattedMessage {...messages.manualCheckboxLabel} />
          </Form.Checkbox>
        )}
      </div>
      <ActionRow.Spacer />
      {updateLink && (
        <Link to={updateLink} data-testid="update-link">
          <Button size="sm">
            <FormattedMessage {...messages.updateLinkLabel} />
          </Button>
        </Link>
      )}
    </ActionRow>
  );
};

LaunchChecklistItem.propTypes = {
  itemId: PropTypes.string.isRequired,
  isAutomated: PropTypes.bool.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  updateLink: PropTypes.string,
  isToggling: PropTypes.bool,
  onToggleManual: PropTypes.func.isRequired,
};

LaunchChecklistItem.defaultProps = {
  updateLink: undefined,
  isToggling: false,
};

export default LaunchChecklistItem;

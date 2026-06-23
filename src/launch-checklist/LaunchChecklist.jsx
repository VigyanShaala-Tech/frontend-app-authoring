import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Container, Stack } from '@openedx/paragon';

import { LoadingSpinner } from '../generic/Loading';
import ConnectionErrorAlert from '../generic/ConnectionErrorAlert';
import { useWaffleFlags } from '../data/apiHooks';
import { useLaunchChecklist, useUpdateLaunchChecklistItem } from './data/apiHooks';
import { getLaunchChecklistUpdateLinks } from './constants';
import LaunchChecklistItem from './LaunchChecklistItem';
import messages from './messages';

const LaunchChecklist = ({ courseId }) => {
  const intl = useIntl();
  const waffleFlags = useWaffleFlags(courseId);
  const { data, isPending: isLoading, isError } = useLaunchChecklist(courseId);
  const updateItemMutation = useUpdateLaunchChecklistItem(courseId);
  const updateLinks = getLaunchChecklistUpdateLinks(courseId, waffleFlags);

  if (isError) {
    return (
      <Container>
        <h3 className="lead">{intl.formatMessage(messages.headingTitle)}</h3>
        <ConnectionErrorAlert />
      </Container>
    );
  }

  const items = data?.items || [];

  return (
    <Container>
      <h3 aria-describedby="launchChecklist-completion-count" className="lead">
        {intl.formatMessage(messages.headingTitle)}
      </h3>
      {isLoading ? (
        <div className="row justify-content-center" data-testid="launch-checklist-loading-spinner">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div id="launchChecklist-completion-count" data-testid="launch-checklist-completion-count">
            <FormattedMessage
              {...messages.completionCountLabel}
              values={{ completed: data?.completedCount ?? 0, total: data?.totalCount ?? items.length }}
            />
          </div>
          <Stack gap={3} className="mt-3">
            {items.map((item) => (
              <div
                className={`bg-white border py-3 px-4 ${item.isCompleted && 'checklist-item-complete'}`}
                id={`checklist-item-${item.id}`}
                data-testid={`checklist-item-${item.id}`}
                key={item.id}
              >
                <LaunchChecklistItem
                  itemId={item.id}
                  isAutomated={item.isAutomated}
                  isCompleted={item.isCompleted}
                  updateLink={updateLinks[item.id]}
                  isToggling={updateItemMutation.isPending}
                  onToggleManual={(isCompleted) => updateItemMutation.mutate({ itemId: item.id, isCompleted })}
                />
              </div>
            ))}
          </Stack>
        </>
      )}
    </Container>
  );
};

LaunchChecklist.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default LaunchChecklist;

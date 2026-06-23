import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Stack } from '@openedx/paragon';

import { useModel } from '../generic/model-store';
import SubHeader from '../generic/sub-header/SubHeader';
import messages from './messages';
import AriaLiveRegion from './AriaLiveRegion';
import { RequestStatus } from '../data/constants';
import ChecklistSection from './ChecklistSection';
import { fetchCourseBestPracticesQuery } from './data/thunks';
import LaunchChecklist from '../launch-checklist';
import { useLaunchChecklist } from '../launch-checklist/data/apiHooks';

const CourseChecklist = ({
  courseId,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const courseDetails = useModel('courseDetails', courseId);
  const enableQuality = getConfig().ENABLE_CHECKLIST_QUALITY === 'true';

  useEffect(() => {
    dispatch(fetchCourseBestPracticesQuery({ courseId }));
  }, [courseId]);

  const {
    loadingStatus,
    bestPracticeData,
  } = useSelector(state => state.courseChecklist);

  const { bestPracticeChecklistLoadingStatus } = loadingStatus;

  const isCourseBestPracticeChecklistLoading = bestPracticeChecklistLoadingStatus === RequestStatus.IN_PROGRESS;
  // Shares the React Query cache with <LaunchChecklist> below - no duplicate request -
  // read here only so the existing AriaLiveRegion a11y announcement keeps working.
  const { isPending: isCourseLaunchChecklistLoading } = useLaunchChecklist(courseId);

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage(messages.pageTitle, {
            headingTitle: intl.formatMessage(messages.headingTitle),
            courseName: courseDetails?.name,
            siteName: process.env.SITE_NAME,
          })}
        </title>
      </Helmet>
      <Container size="xl" className="p-4 pt-4.5">
        <SubHeader
          title={intl.formatMessage(messages.headingTitle)}
          subtitle={intl.formatMessage(messages.headingSubtitle)}
        />
        <AriaLiveRegion
          {...{
            isCourseLaunchChecklistLoading,
            isCourseBestPracticeChecklistLoading,
            enableQuality,
          }}
        />
        <Stack gap={4}>
          <LaunchChecklist courseId={courseId} />
          {enableQuality && (
            <ChecklistSection
              courseId={courseId}
              dataHeading={intl.formatMessage(messages.bestPracticesChecklistLabel)}
              data={bestPracticeData}
              idPrefix="bestPracticesChecklist"
              isLoading={isCourseBestPracticeChecklistLoading}
            />
          )}
        </Stack>
      </Container>
    </>
  );
};

CourseChecklist.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default CourseChecklist;

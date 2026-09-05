/* eslint-disable no-param-reassign */
import { camelCase, isEmpty } from 'lodash';
import { getConfig, camelCaseObject } from '@edx/frontend-platform';
import { RequestStatus } from '../../../data/constants';
import {
  VIDEO_PROCESSING_STATUSES,
  VIDEO_PROCESSING_POLL_INTERVAL_MS,
  VIDEO_PROCESSING_POLL_MAX_ATTEMPTS,
} from './constants';
import {
  addModels,
  removeModel,
  updateModel,
  updateModels,
} from '../../../generic/model-store';
import {
  addThumbnail,
  addVideo,
  deleteVideo,
  fetchVideoList,
  finalizeVideoUpload,
  getVideos,
  uploadVideo,
  getDownload,
  deleteTranscript,
  downloadTranscript,
  uploadTranscript,
  getVideoUsagePaths,
  deleteTranscriptPreferences,
  sendVideoUploadStatus,
  setTranscriptCredentials,
  setTranscriptPreferences,
  getAllUsagePaths,
} from './api';
import {
  setVideoIds,
  setPageSettings,
  updateLoadingStatus,
  deleteVideoSuccess,
  updateErrors,
  clearErrors,
  updateEditStatus,
  updateTranscriptCredentialsSuccess,
  updateTranscriptPreferenceSuccess,
  failAddVideo,
} from './slice';
import { ServerError } from './errors';
import { updateFileValues } from './utils';

let controllers = [];

const updateVideoUploadStatus = async (courseId, edxVideoId, message, status) => {
  await sendVideoUploadStatus(courseId, edxVideoId, message, status);
};

export function cancelAllUploads(courseId, uploadData) {
  return async (dispatch) => {
    if (controllers) {
      controllers.forEach(control => {
        control.abort();
      });
      Object.entries(uploadData).forEach(([key, value]) => {
        if (value.status === RequestStatus.IN_PROGRESS) {
          updateVideoUploadStatus(
            courseId,
            key,
            'Upload failed',
            'upload_failed',
          );
          dispatch(
            updateErrors({
              error: 'add',
              message: `Cancelled upload for ${value.name}.`,
            }),
          );
        }
      });
      dispatch(updateEditStatus({ editType: 'add', status: RequestStatus.FAILED }));
    }
    controllers = [];
  };
}

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

// Added by Developer: there is no real transcoding pipeline / webhook telling Studio when a video is
// done finalizing (see finalize_video_upload_task in edx-platform), so the frontend polls the
// video list until each of `videoIds` leaves VIDEO_PROCESSING_STATUSES, patching its status and
// duration in place. This is what turns "Uploaded" into "Ready" automatically, without the user
// needing to refresh the page.
export function pollVideoProcessingStatus(courseId, videoIds) {
  return async (dispatch) => {
    let pendingIds = videoIds.filter(Boolean);
    let attempts = 0;

    while (pendingIds.length > 0 && attempts < VIDEO_PROCESSING_POLL_MAX_ATTEMPTS) {
      attempts += 1;
      // eslint-disable-next-line no-await-in-loop
      await wait(VIDEO_PROCESSING_POLL_INTERVAL_MS);

      let videos;
      try {
        // eslint-disable-next-line no-await-in-loop
        ({ videos } = await fetchVideoList(courseId));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to poll video processing status for course ${courseId}.`, error);
        break;
      }

      const stillPending = [];
      const updates = [];
      pendingIds.forEach((edxVideoId) => {
        const video = videos.find((candidate) => candidate.edxVideoId === edxVideoId);
        // Keep polling if the video briefly disappeared from the list (e.g. mid-write) or is
        // still in a processing status; stop once it reaches any terminal (success/failure) one.
        if (!video || VIDEO_PROCESSING_STATUSES.includes(video.status)) {
          stillPending.push(edxVideoId);
        } else {
          updates.push({ id: video.edxVideoId, status: video.status, duration: video.duration });
        }
      });

      if (updates.length > 0) {
        dispatch(updateModels({ modelType: 'videos', models: updates }));
      }
      pendingIds = stillPending;
    }
  };
}

export function fetchVideos(courseId) {
  return async (dispatch) => {
    dispatch(
      updateLoadingStatus({ courseId, status: RequestStatus.IN_PROGRESS }),
    );
    try {
      const { previousUploads, ...data } = await getVideos(courseId);
      dispatch(setPageSettings({ ...data }));
      // Previous uploads are the current videos associated with a course.
      // If previous uploads are empty there is no need to add an empty model
      // or loop through and empty list so automatically set loading to successful
      if (isEmpty(previousUploads)) {
        dispatch(
          updateLoadingStatus({ courseId, status: RequestStatus.SUCCESSFUL }),
        );
      } else {
        const parsedVideos = updateFileValues(previousUploads);
        const videoIds = parsedVideos.map((video) => video.id);
        dispatch(addModels({ modelType: 'videos', models: parsedVideos }));
        dispatch(setVideoIds({ videoIds }));
        dispatch(
          updateLoadingStatus({ courseId, status: RequestStatus.PARTIAL }),
        );
        const allUsageLocations = await getAllUsagePaths({
          courseId,
          videoIds,
        });
        dispatch(
          updateModels({ modelType: 'videos', models: allUsageLocations }),
        );
        dispatch(
          updateLoadingStatus({ courseId, status: RequestStatus.SUCCESSFUL }),
        );
        // Added by Developer: resume watching any videos that were still finalizing when the page loaded
        // (e.g. the user uploaded, then navigated away and back before it finished).
        const processingVideoIds = parsedVideos
          .filter((video) => VIDEO_PROCESSING_STATUSES.includes(video.status))
          .map((video) => video.id);
        if (processingVideoIds.length > 0) {
          dispatch(pollVideoProcessingStatus(courseId, processingVideoIds));
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        dispatch(updateLoadingStatus({ status: RequestStatus.DENIED }));
      } else {
        dispatch(
          updateErrors({ error: 'loading', message: 'Failed to load videos' }),
        );
        dispatch(
          updateLoadingStatus({ courseId, status: RequestStatus.FAILED }),
        );
      }
    }
  };
}

export function resetErrors({ errorType }) {
  return (dispatch) => {
    dispatch(clearErrors({ error: errorType }));
  };
}

export function updateVideoOrder(courseId, videoIds) {
  return async (dispatch) => {
    dispatch(
      updateLoadingStatus({ courseId, status: RequestStatus.IN_PROGRESS }),
    );
    dispatch(setVideoIds({ videoIds }));
    dispatch(
      updateLoadingStatus({ courseId, status: RequestStatus.SUCCESSFUL }),
    );
  };
}

export function deleteVideoFile(courseId, id) {
  return async (dispatch) => {
    dispatch(
      updateEditStatus({
        editType: 'delete',
        status: RequestStatus.IN_PROGRESS,
      }),
    );
    try {
      await deleteVideo(courseId, id);
      dispatch(deleteVideoSuccess({ videoId: id }));
      dispatch(removeModel({ modelType: 'videos', id }));
      dispatch(
        updateEditStatus({
          editType: 'delete',
          status: RequestStatus.SUCCESSFUL,
        }),
      );
    } catch (error) {
      dispatch(
        updateErrors({
          error: 'delete',
          message: `Failed to delete file id ${id}.`,
        }),
      );
      dispatch(
        updateEditStatus({ editType: 'delete', status: RequestStatus.FAILED }),
      );
    }
  };
}

export function markVideoUploadsInProgressAsFailed({ uploadingIdsRef, courseId }) {
  return (dispatch) => {
    Object.keys(uploadingIdsRef.current.uploadData).forEach((edxVideoId) => {
      try {
        updateVideoUploadStatus(
          courseId,
          edxVideoId || '',
          'Upload failed',
          'upload_failed',
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to send "Failed" upload status for ${edxVideoId} onbeforeunload`);
      }
      dispatch(updateEditStatus({ editType: 'add', status: '' }));
    });
  };
}

const addVideoToEdxVal = async (courseId, file, dispatch) => {
  const currentController = new AbortController();
  controllers.push(currentController);
  try {
    const createUrlResponse = await addVideo(courseId, file, currentController);
    // eslint-disable-next-line
    console.log(`Post Response: ${JSON.stringify(createUrlResponse)}`);
    if (createUrlResponse.status < 200 || createUrlResponse.status >= 300) {
      dispatch(failAddVideo({ fileName: file.name }));
    }
    const [{ uploadUrl, edxVideoId, metadata }] = camelCaseObject(
      createUrlResponse.data,
    ).files;
    return {
      uploadUrl, edxVideoId, metadata,
    };
  } catch (error) {
    dispatch(failAddVideo({ fileName: file.name }));
    return {};
  }
};

const uploadToBucket = async ({
  courseId,
  uploadUrl,
  file,
  uploadingIdsRef,
  edxVideoId,
  dispatch,
  metadata,
}) => {
  const currentController = new AbortController();
  controllers.push(currentController);
  const currentVideoData = uploadingIdsRef.current.uploadData[edxVideoId];

  try {
    const putToServerResponse = await uploadVideo(
      uploadUrl,
      file,
      uploadingIdsRef,
      edxVideoId,
      currentController,
      metadata,
    );
    if (
      putToServerResponse.status < 200
      || putToServerResponse.status >= 300
    ) {
      throw new ServerError(
        'Server responded with an error status',
        putToServerResponse.status,
      );
    } else {
      uploadingIdsRef.current.uploadData[edxVideoId] = {
        ...currentVideoData,
        status: RequestStatus.SUCCESSFUL,
      };
      // Added by Developer: await this -- the video's VAL status only flips from "upload" (displayed
      // as "Uploading", which the table treats as a failure) to "upload_completed" once this
      // resolves. Firing it without waiting raced the fetchVideoList() call in addVideoFile()
      // below and regularly lost, so freshly uploaded videos showed up as "Failed" until the
      // user manually refreshed the page.
      await updateVideoUploadStatus(
        courseId,
        edxVideoId,
        'Upload completed',
        'upload_completed',
      );
      // Added by Developer: no external transcoding pipeline is watching the bucket,
      // so kick off backend finalization (duration/encoding/status) ourselves.
      // Fire-and-forget: it's an async backend task: the list will just show
      // this video as still processing until it completes.
      finalizeVideoUpload(courseId, edxVideoId).catch(() => {
        // eslint-disable-next-line no-console
        console.error(`Failed to finalize video upload for ${edxVideoId}`);
      });
    }
    return false;
  } catch (error) {
    if (error.response && error.response.status === 413) {
      const message = error.response.data.error;
      dispatch(updateErrors({ error: 'add', message }));
    } else {
      dispatch(
        updateErrors({
          error: 'add',
          message: `Failed to upload ${file.name}.`,
        }),
      );
      uploadingIdsRef.current.uploadData[edxVideoId] = {
        ...currentVideoData,
        status: RequestStatus.FAILED,
      };
    }
    updateVideoUploadStatus(
      courseId,
      edxVideoId || '',
      'Upload failed',
      'upload_failed',
    );
    return true;
  }
};

export const newUploadData = ({
  status,
  edxVideoId,
  currentData,
  key,
  originalValue,
}) => {
  const newData = currentData;
  if (edxVideoId && edxVideoId !== key) {
    newData[edxVideoId] = { ...originalValue, status };
    delete newData[key];
    return newData;
  }

  newData[key] = { ...originalValue, status };
  return newData;
};

export function addVideoFile(
  courseId,
  files,
  videoIds,
  uploadingIdsRef,
) {
  return async (dispatch) => {
    dispatch(
      updateEditStatus({ editType: 'add', status: RequestStatus.IN_PROGRESS }),
    );
    let hasFailure = false;
    await Promise.all(files.map(async (file, idx) => {
      const name = file?.name || `Video ${idx + 1}`;
      const progress = 0;

      uploadingIdsRef.current.uploadData = newUploadData({
        status: RequestStatus.PENDING,
        currentData: uploadingIdsRef.current.uploadData,
        originalValue: { name, progress },
        key: `video_${idx}`,
      });

      const {
        edxVideoId, uploadUrl, metadata,
      } = await addVideoToEdxVal(courseId, file, dispatch);

      if (uploadUrl && edxVideoId) {
        uploadingIdsRef.current.uploadData = newUploadData({
          status: RequestStatus.IN_PROGRESS,
          currentData: uploadingIdsRef.current.uploadData,
          originalValue: { name, progress },
          key: `video_${idx}`,
          edxVideoId,
        });
        hasFailure = await uploadToBucket({
          courseId, uploadUrl, file, uploadingIdsRef, edxVideoId, dispatch, metadata,
        });
      } else {
        hasFailure = true;
        uploadingIdsRef.current.uploadData[idx] = {
          status: RequestStatus.FAILED,
          name,
          progress,
        };
      }
    }));

    try {
      const { videos } = await fetchVideoList(courseId);
      const newVideos = videos.filter(
        (video) => !videoIds.includes(video.edxVideoId),
      );
      const newVideoIds = newVideos.map((video) => video.edxVideoId);
      const parsedVideos = updateFileValues(newVideos, true);
      dispatch(addModels({ modelType: 'videos', models: parsedVideos }));
      dispatch(setVideoIds({ videoIds: newVideoIds.concat(videoIds) }));
      // Added by Developer: watch the videos we just uploaded until the backend finishes finalizing them
      // (see pollVideoProcessingStatus), so the table flips from "Uploaded" to "Ready" on its own.
      const processingVideoIds = newVideos
        .filter((video) => VIDEO_PROCESSING_STATUSES.includes(video.status))
        .map((video) => video.edxVideoId);
      if (processingVideoIds.length > 0) {
        dispatch(pollVideoProcessingStatus(courseId, processingVideoIds));
      }
    } catch (error) {
      dispatch(
        updateEditStatus({ editType: 'add', status: RequestStatus.FAILED }),
      );
      // eslint-disable-next-line
      console.error(`fetchVideoList failed with message: ${error.message}`);
      hasFailure = true;
      dispatch(
        updateErrors({ error: 'add', message: 'Failed to load videos' }),
      );
    }

    if (hasFailure) {
      dispatch(updateEditStatus({ editType: 'add', status: RequestStatus.FAILED }));
    } else {
      dispatch(updateEditStatus({ editType: 'add', status: RequestStatus.SUCCESSFUL }));
    }

    uploadingIdsRef.current = {
      uploadData: {},
      uploadCount: 0,
    };
  };
}

export function addVideoThumbnail({ file, videoId, courseId }) {
  return async (dispatch) => {
    dispatch(
      updateEditStatus({
        editType: 'thumbnail',
        status: RequestStatus.IN_PROGRESS,
      }),
    );
    dispatch(resetErrors({ errorType: 'thumbnail' }));
    try {
      const { imageUrl } = await addThumbnail({ courseId, videoId, file });
      let thumbnail = imageUrl;
      if (thumbnail.startsWith('/')) {
        thumbnail = `${getConfig().STUDIO_BASE_URL}${imageUrl}`;
      }
      dispatch(
        updateModel({
          modelType: 'videos',
          model: {
            id: videoId,
            thumbnail,
          },
        }),
      );
      dispatch(
        updateEditStatus({
          editType: 'thumbnail',
          status: RequestStatus.SUCCESSFUL,
        }),
      );
    } catch (error) {
      if (error.response?.data?.error) {
        const message = error.response.data.error;
        dispatch(updateErrors({ error: 'thumbnail', message }));
      } else {
        dispatch(
          updateErrors({
            error: 'thumbnail',
            message: `Failed to add thumbnail for video id ${videoId}.`,
          }),
        );
      }
      dispatch(
        updateEditStatus({
          editType: 'thumbnail',
          status: RequestStatus.FAILED,
        }),
      );
    }
  };
}

export function deleteVideoTranscript({
  language,
  videoId,
  transcripts,
  apiUrl,
}) {
  return async (dispatch) => {
    dispatch(
      updateEditStatus({
        editType: 'transcript',
        status: RequestStatus.IN_PROGRESS,
      }),
    );

    try {
      await deleteTranscript({
        videoId,
        language,
        apiUrl,
      });
      const updatedTranscripts = transcripts.filter(
        (transcript) => transcript !== language,
      );
      const transcriptStatus = updatedTranscripts?.length > 0 ? 'transcribed' : 'notTranscribed';

      dispatch(
        updateModel({
          modelType: 'videos',
          model: {
            id: videoId,
            transcripts: updatedTranscripts,
            transcriptStatus,
          },
        }),
      );

      dispatch(
        updateEditStatus({
          editType: 'transcript',
          status: RequestStatus.SUCCESSFUL,
        }),
      );
    } catch (error) {
      dispatch(
        updateErrors({
          error: 'transcript',
          message: `Failed to delete ${language} transcript.`,
        }),
      );
      dispatch(
        updateEditStatus({
          editType: 'transcript',
          status: RequestStatus.FAILED,
        }),
      );
    }
  };
}

export function downloadVideoTranscript({
  language,
  videoId,
  filename,
  apiUrl,
}) {
  return async (dispatch) => {
    dispatch(
      updateEditStatus({
        editType: 'transcript',
        status: RequestStatus.IN_PROGRESS,
      }),
    );

    try {
      await downloadTranscript({
        videoId,
        language,
        apiUrl,
        filename,
      });
      dispatch(
        updateEditStatus({
          editType: 'transcript',
          status: RequestStatus.SUCCESSFUL,
        }),
      );
    } catch (error) {
      dispatch(
        updateErrors({
          error: 'transcript',
          message: `Failed to download ${filename}.`,
        }),
      );
      dispatch(
        updateEditStatus({
          editType: 'transcript',
          status: RequestStatus.FAILED,
        }),
      );
    }
  };
}

export function uploadVideoTranscript({
  language,
  newLanguage,
  videoId,
  file,
  apiUrl,
  transcripts,
}) {
  return async (dispatch) => {
    dispatch(
      updateEditStatus({
        editType: 'transcript',
        status: RequestStatus.IN_PROGRESS,
      }),
    );
    const isReplacement = !isEmpty(language);

    try {
      await uploadTranscript({
        videoId,
        language,
        apiUrl,
        file,
        newLanguage,
      });
      let updatedTranscripts = transcripts;
      if (isReplacement) {
        const removeTranscript = transcripts.filter(
          (transcript) => transcript !== language,
        );
        updatedTranscripts = [...removeTranscript, newLanguage];
      } else {
        updatedTranscripts = [...transcripts, newLanguage];
      }

      const transcriptStatus = updatedTranscripts?.length > 0 ? 'transcribed' : 'notTranscribed';

      dispatch(
        updateModel({
          modelType: 'videos',
          model: {
            id: videoId,
            transcripts: updatedTranscripts,
            transcriptStatus,
          },
        }),
      );

      dispatch(
        updateEditStatus({
          editType: 'transcript',
          status: RequestStatus.SUCCESSFUL,
        }),
      );
    } catch (error) {
      if (error.response?.data?.error) {
        const message = error.response.data.error;
        dispatch(updateErrors({ error: 'transcript', message }));
      } else {
        const message = isReplacement
          ? `Failed to replace ${language} with ${newLanguage}.`
          : `Failed to add ${newLanguage}.`;
        dispatch(updateErrors({ error: 'transcript', message }));
      }
      dispatch(
        updateEditStatus({
          editType: 'transcript',
          status: RequestStatus.FAILED,
        }),
      );
    }
  };
}

export function getUsagePaths({ video, courseId }) {
  return async (dispatch) => {
    dispatch(
      updateEditStatus({
        editType: 'usageMetrics',
        status: RequestStatus.IN_PROGRESS,
      }),
    );

    try {
      const { usageLocations } = await getVideoUsagePaths({
        videoId: video.id,
        courseId,
      });
      const activeStatus = usageLocations?.length > 0 ? 'active' : 'inactive';

      dispatch(
        updateModel({
          modelType: 'videos',
          model: {
            id: video.id,
            usageLocations,
            activeStatus,
          },
        }),
      );
      dispatch(
        updateEditStatus({
          editType: 'usageMetrics',
          status: RequestStatus.SUCCESSFUL,
        }),
      );
    } catch (error) {
      dispatch(
        updateErrors({
          error: 'usageMetrics',
          message: `Failed to get usage metrics for ${video.displayName}.`,
        }),
      );
      dispatch(
        updateEditStatus({
          editType: 'usageMetrics',
          status: RequestStatus.FAILED,
        }),
      );
    }
  };
}

export function fetchVideoDownload({ selectedRows, courseId }) {
  return async (dispatch) => {
    dispatch(
      updateEditStatus({
        editType: 'download',
        status: RequestStatus.IN_PROGRESS,
      }),
    );
    try {
      const errors = await getDownload(selectedRows, courseId);
      dispatch(
        updateEditStatus({
          editType: 'download',
          status: RequestStatus.SUCCESSFUL,
        }),
      );
      if (!isEmpty(errors)) {
        errors.forEach((error) => {
          dispatch(updateErrors({ error: 'download', message: error }));
        });
        dispatch(
          updateEditStatus({
            editType: 'download',
            status: RequestStatus.FAILED,
          }),
        );
      }
    } catch (error) {
      dispatch(
        updateErrors({
          error: 'download',
          message: 'Failed to download zip file of videos.',
        }),
      );
      dispatch(
        updateEditStatus({
          editType: 'download',
          status: RequestStatus.FAILED,
        }),
      );
    }
  };
}

export function clearAutomatedTranscript({ courseId }) {
  return async (dispatch) => {
    dispatch(
      updateEditStatus({
        editType: 'transcript',
        status: RequestStatus.IN_PROGRESS,
      }),
    );

    try {
      await deleteTranscriptPreferences(courseId);
      dispatch(updateTranscriptPreferenceSuccess({ modified: new Date() }));
      dispatch(
        updateEditStatus({
          editType: 'transcript',
          status: RequestStatus.SUCCESSFUL,
        }),
      );
    } catch (error) {
      dispatch(
        updateErrors({
          error: 'transcript',
          message: 'Failed to update order transcripts settings.',
        }),
      );
      dispatch(
        updateEditStatus({
          editType: 'transcript',
          status: RequestStatus.FAILED,
        }),
      );
    }
  };
}

export function updateTranscriptCredentials({ courseId, data }) {
  return async (dispatch) => {
    dispatch(
      updateEditStatus({
        editType: 'transcript',
        status: RequestStatus.IN_PROGRESS,
      }),
    );

    try {
      await setTranscriptCredentials(courseId, data);
      dispatch(
        updateTranscriptCredentialsSuccess({
          provider: camelCase(data.provider),
        }),
      );
      dispatch(
        updateEditStatus({
          editType: 'transcript',
          status: RequestStatus.SUCCESSFUL,
        }),
      );
    } catch (error) {
      dispatch(
        updateErrors({
          error: 'transcript',
          message: `Failed to update ${data.provider} credentials.`,
        }),
      );
      dispatch(
        updateEditStatus({
          editType: 'transcript',
          status: RequestStatus.FAILED,
        }),
      );
    }
  };
}

export function updateTranscriptPreference({ courseId, data }) {
  return async (dispatch) => {
    dispatch(
      updateEditStatus({
        editType: 'transcript',
        status: RequestStatus.IN_PROGRESS,
      }),
    );

    try {
      const preferences = await setTranscriptPreferences(courseId, data);
      dispatch(updateTranscriptPreferenceSuccess(preferences));
      dispatch(
        updateEditStatus({
          editType: 'transcript',
          status: RequestStatus.SUCCESSFUL,
        }),
      );
    } catch (error) {
      if (error.response?.data?.error) {
        const message = error.response.data.error;
        dispatch(updateErrors({ error: 'transcript', message }));
      } else {
        dispatch(
          updateErrors({
            error: 'transcript',
            message: `Failed to update ${data.provider} transcripts settings.`,
          }),
        );
      }
      dispatch(
        updateEditStatus({
          editType: 'transcript',
          status: RequestStatus.FAILED,
        }),
      );
    }
  };
}

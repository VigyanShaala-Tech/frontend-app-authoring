export const MAX_FILE_SIZE_MB = 2000000;
export const MIN_FILE_SIZE_KB = 2000;
export const MAX_WIDTH = 1280;
export const MAX_HEIGHT = 720;
export const MIN_WIDTH = 640;
export const MIN_HEIGHT = 360;
export const ASPECT_RATIO = 16 / 9;
export const ASPECT_RATIO_ERROR_MARGIN = 0.1;
export const TRANSCRIPT_FAILURE_STATUSES = ['Transcript Failed', 'Partial Failure'];
export const VIDEO_PROCESSING_STATUSES = ['In Progress', 'Uploaded']; // Don't add "Uploading" here. Otherwise interrupted uploads will be considered as processing.
export const VIDEO_SUCCESS_STATUSES = ['Ready', 'Imported'];
export const VIDEO_FAILURE_STATUSES = ['Failed', 'Partial Failure', 'Uploading']; // 'Uploading' is added here to handle interrupted uploads.

// Added by Developer: this install has no external video pipeline pushing status updates back to Studio,
// so newly uploaded videos are finalized asynchronously on the backend (see finalize_video_upload_task
// in edx-platform). The frontend polls until each video leaves VIDEO_PROCESSING_STATUSES so the table
// updates itself to "Ready" without the user having to refresh the page.
export const VIDEO_PROCESSING_POLL_INTERVAL_MS = 5000;
export const VIDEO_PROCESSING_POLL_MAX_ATTEMPTS = 60; // ~5 minutes per video before we give up polling

import type { MediaItem } from '@/lib/media';

/**
 * Uploads via XMLHttpRequest (not fetch/Server Action) specifically because
 * only XHR exposes real upload-progress events in every browser.
 */
export function uploadFileWithProgress(
  file: File,
  onProgress: (percent: number) => void,
): Promise<MediaItem> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/admin/api/media/upload');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      let body: { item?: MediaItem; error?: string } = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        // fall through to the generic error below
      }
      if (xhr.status >= 200 && xhr.status < 300 && body.item) {
        resolve(body.item);
      } else {
        reject(new Error(body.error ?? 'Upload failed.'));
      }
    };

    xhr.onerror = () => reject(new Error('Upload failed.'));

    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  });
}

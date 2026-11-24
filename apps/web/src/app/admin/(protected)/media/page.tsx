import { MediaGrid } from '@/components/media-grid';
import { MediaLibraryHeader } from '@/components/media-library-header';
import { listMedia } from '@/lib/media';

export default async function AdminMediaPage() {
  const media = await listMedia();

  return (
    <div>
      <MediaLibraryHeader fileCount={media.length} />

      <div className="mt-8">
        <MediaGrid items={media} />
      </div>
    </div>
  );
}

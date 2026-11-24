import { randomUUID } from 'node:crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

const BUCKET = 'media';

export interface MediaItem {
  id: string;
  title: string;
  alt: string;
  caption: string;
  url: string;
  storagePath: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
}

interface MediaRow {
  id: string;
  title: string;
  alt: string;
  caption: string;
  url: string;
  storage_path: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
}

function toMediaItem(row: MediaRow): MediaItem {
  return {
    id: row.id,
    title: row.title,
    alt: row.alt,
    caption: row.caption,
    url: row.url,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    createdAt: row.created_at,
  };
}

function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
}

export async function createMediaFromUpload(file: File): Promise<MediaItem> {
  const db = supabaseAdmin();
  const path = `${randomUUID()}-${safeFileName(file.name)}`;

  const { error: uploadError } = await db.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || undefined });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = db.storage.from(BUCKET).getPublicUrl(path);

  const { data, error: insertError } = await db
    .from('media')
    .insert({
      title: file.name,
      url: publicUrlData.publicUrl,
      storage_path: path,
      mime_type: file.type || null,
      size_bytes: file.size,
    })
    .select('id, title, alt, caption, url, storage_path, mime_type, size_bytes, created_at')
    .single();
  if (insertError || !data) throw insertError ?? new Error('Insert returned no row.');

  return toMediaItem(data);
}

export async function listMedia(): Promise<MediaItem[]> {
  const { data, error } = await supabaseAdmin()
    .from('media')
    .select('id, title, alt, caption, url, storage_path, mime_type, size_bytes, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toMediaItem);
}

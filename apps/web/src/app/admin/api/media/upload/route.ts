import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session';
import { createMediaFromUpload } from '@/lib/media';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
// Restrict to raster image types; exclude image/svg+xml to prevent stored XSS.
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

export async function POST(request: Request) {
  // Defense-in-depth: verify admin session directly in the route handler as well as middleware
  const secret = process.env.SESSION_SECRET;
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!secret || !verifySessionToken(token, secret)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Choose a file to upload.' }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'File must be 10 MB or smaller.' }, { status: 413 });
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Unsupported file type. Upload JPEG, PNG, WebP, AVIF, or GIF.' },
      { status: 415 },
    );
  }

  try {
    const item = await createMediaFromUpload(file);
    revalidatePath('/admin/media');
    return NextResponse.json({ item });
  } catch (error) {
    console.error('[media] upload failed:', error);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}

let lockCount = 0;

/** Reference-counted body scroll lock, so nested overlays (e.g. the site menu
 * opened from within the location gate) don't unlock scroll out from under
 * an overlay that's still open. */
export function lockBodyScroll(): void {
  if (lockCount === 0) {
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
}

export function unlockBodyScroll(): void {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = '';
  }
}

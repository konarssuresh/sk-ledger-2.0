let lockCount = 0;
let savedOverflow = "";

/**
 * Prevents document body scrolling while an overlay is open.
 * Reference-counted so nested overlays (e.g. sheet + dialog handoff) restore correctly.
 * @returns {() => void} release — call on overlay unmount
 */
export function acquireBodyScrollLock() {
  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount += 1;

  let released = false;
  return function releaseBodyScrollLock() {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.body.style.overflow = savedOverflow;
    }
  };
}

/** @internal — test-only reset */
export function resetBodyScrollLockForTests() {
  lockCount = 0;
  savedOverflow = "";
}

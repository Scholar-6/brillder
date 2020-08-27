export function checkVisibility(isReview: boolean | undefined, isPreview: boolean = false) {
  if (isPreview === true || isReview) {
    return true;
  }
  return false;
}

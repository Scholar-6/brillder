export function checkVisibility(attempt: any, isPreview: boolean = false) {
  if (isPreview === true || attempt.correct === false) {
    return true;
  }
  return false;
}

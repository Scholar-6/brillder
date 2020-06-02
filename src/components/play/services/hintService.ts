export function checkVisibility(attempt: any, isPreview: boolean = false) {
  if (isPreview === true || attempt) {
    return true;
  }
  return false;
}

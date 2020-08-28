export const enterPressed = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  if (e.keyCode === 13) {
    return true;
  }
  return false;
}

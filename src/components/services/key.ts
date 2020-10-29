export const enterPressed = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  if (e.keyCode === 13) {
    return true;
  }
  return false;
}

export const leftKeyPressed = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  if (e.keyCode === 37) {
    return true;
  }
  return false;
}

export const rightKeyPressed = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  if (e.keyCode === 39) {
    return true;
  }
  return false;
}

export const upKeyPressed = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  if (e.keyCode === 38) {
    return true;
  }
  return false;
}

export const downKeyPressed = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  if (e.keyCode === 40) {
    return true;
  }
  return false;
}

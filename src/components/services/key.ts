const checkKeyCode = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, keyCode: number) => {
  if (e.keyCode === keyCode) {
    return true;
  }
  return false;
}

export const enterPressed = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  return checkKeyCode(e, 13);
}

export const leftKeyPressed = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  return checkKeyCode(e, 37);
}

export const rightKeyPressed = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  return checkKeyCode(e, 39);
}

export const upKeyPressed = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  return checkKeyCode(e, 38);
}

export const downKeyPressed = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  return checkKeyCode(e, 40);
}

export const spaceKeyPressed = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  return checkKeyCode(e, 32);
}

// mobile
export const hideKeyboard = (current: any) => {
  if (current) {
    current.setAttribute("readonly", "readonly"); // Force keyboard to hide on input field.
    current.setAttribute("disabled", "true"); // Force keyboard to hide on textarea field.
    setTimeout(function () {
      current.blur(); //actually close the keyboard
      // Remove readonly attribute after keyboard is hidden.
      current.removeAttribute("readonly");
      current.removeAttribute("disabled");
    }, 100);
  }
}
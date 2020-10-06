export const getValidationClassName = (isCorrect: boolean) => {
  if (isCorrect) {
    return " correct";
  } else {
    return " wrong";
  }
}

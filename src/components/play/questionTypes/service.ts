export const getValidationClassName = (isCorrect: boolean | null) => {
  if (isCorrect) {
    return " correct";
  } else if (isCorrect === false) {
    return " wrong";
  } else {
    return '';
  }
}

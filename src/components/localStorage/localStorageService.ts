const BuildQuestionNumber = "BuildQuestionNumber";

export function SetBuildQuestionNumber(questionIndex: number) {
  localStorage.setItem(BuildQuestionNumber, questionIndex.toString());
}

export function GetBuildQuestionNumber() {
  let stringNumber = localStorage.getItem(BuildQuestionNumber)
  let questionNumber = stringNumber ? parseInt(stringNumber) : 0;
  return questionNumber;
}

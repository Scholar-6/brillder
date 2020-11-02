import queryString from 'query-string';

export const getPlayPath = (isPreview: boolean | undefined, brickId: number) => {
  let mainPath = '/play'
  if (isPreview) {
    mainPath = '/play-preview';
  }
  return `${mainPath}/brick/${brickId}`;
}

export const getAssignQueryString = (location: any) => {
  const values = queryString.parse(location.search);
  if (values.assignmentId) {
    return '?assignmentId=' + values.assignmentId;
  }
  return '';
}

export const scrollToStep = (step: number) => {
  try {
    document.getElementsByClassName("step")[step].scrollIntoView();
  } catch {}
}

export default {
  getPlayPath,
  getAssignQueryString,
}
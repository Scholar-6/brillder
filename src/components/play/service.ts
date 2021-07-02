export const getPlayPath = (isPreview: boolean | undefined, brickId: number) => {
  let mainPath = '/play'
  if (isPreview) {
    mainPath = '/play-preview';
  }
  return `${mainPath}/brick/${brickId}`;
}

export const scrollToStep = (step: number) => {
  try {
    document.getElementsByClassName("step")[step].scrollIntoView();
  } catch {}
}

export default {
  getPlayPath,
}

export function setLocalBrick(data: any) {
  localStorage.setItem('proposal', JSON.stringify(data));
}

export function getLocalBrick() {
  try {
    const brickString = localStorage.getItem('proposal') as string;
    return JSON.parse(brickString);
  } catch {}
  return null;
}

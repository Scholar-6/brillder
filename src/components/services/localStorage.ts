export function setItem (name: string, value: any) {
  localStorage.setItem(name, value);
}

export function getItem (name) {
  localStorage.getItem(name);
}

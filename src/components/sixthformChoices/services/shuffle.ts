export function shuffle(a: any[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    if (a[i].correctIndex === i + 1) {
      continue;
    }
    if (a[j].correctIndex === j + 1) {
      continue;
    }
    
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function parseDataToArray(value: string): Array<string> {
  try {
    const res = value.replace(/<\/p>/gi, (s: string) => {
      return s + '\n';
    });
    return res.match(/<(.+)>.*?<\/(.+)>/g) || [];
  } catch {
    return [];
  }
}

export function isMathJax(el: string) {
  return el.indexOf('<math xmlns="http://www.w3.org/1998/Math/MathML">') >= 0;
}

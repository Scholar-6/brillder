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

export function parseSynthesisDataToArray(value: string): Array<string> {
  try {
    return value.match(/<(.+)>.*?<\/(.+)>/g) || [];
  } catch {
    return [];
  }
}

function isMathType(el: string) {
  return el.indexOf('<math xmlns="http://www.w3.org/1998/Math/MathML">') >= 0;
}

function isChemType(el: string) {
  return el.indexOf('<math class="wrs_chemistry" xmlns="http://www.w3.org/1998/Math/MathML">') >= 0;
}

export function isMathJax(el: string) {
  if (isMathType(el)) {
    return true;
  } else if (isChemType(el)) {
    return true;
  }
  return false;
}

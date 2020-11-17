export function parseDataToArray(value: string): Array<string> {
  try {
    // youtube preparations
    let res = value.replace(/<\/p>/gi, (s: string) => {
      return s + '\n';
    });
    // #2086 youtube preparations
    res = res.replace(/<\/iframe>/gi, (s: string) => {
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

export function isLatex(el: string) {
  return el.indexOf('<span class="latex">') >= 0;
}

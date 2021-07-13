export function parseDataToArray(value: string): Array<string> {
  try {
    // return splitByTags(value);
    const el = document.createElement("div");
    el.insertAdjacentHTML("beforeend", value);
    return Array.from(el.children).map(e => e.outerHTML);
  } catch {
    return [];
  }
}

export function parseSynthesisDataToArray(value: string): Array<string> {
  try {
    return parseDataToArray(value);
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
  return /<span (.*)class="latex"(.*)>/.test(el);
}

const splitByTags = (value: string) => {
  // youtube preparations
  let res = value.replace(/<\/p>/gi, (s: string) => {
    return s + '\n';
  });
  // #2086 youtube preparations
  res = res.replace(/<\/iframe>/gi, (s: string) => {
    return s + '\n';
  });

  return res.match(/<(.+)>.*?<\/(.+)>/g) || [];
}

export function parseDataToArrayQuote(value: string): string[] {
  try {
    // slit by quotes
    value = value.replace(/<\/blockquote>/gi, (s: string) => {
      return s + '\n';
    });
    const reg = new RegExp('<blockquote>(.*)</blockquote>', 'g')
    let quoteParts = value.match(reg);
    let res: string[] = [];
    if (quoteParts) {
      let rest = value;
      for (let quote of quoteParts) {
        const splited = rest.split(quote);
        res.push(...splitByTags(splited[0]));
        res.push(quote);
        // if more that one coincidence join the rest to save the loop
        rest = splited.slice(1).join();
      }
      // add last one
      res.push(...splitByTags(rest));
    } else {
      res = splitByTags(value);
    }
    return res;
  } catch {
    return [];
  }
}

export function parseDataToArray(value: string): Array<string> {
  try {
    return splitByTags(value);
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

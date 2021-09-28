import React from 'react';

interface SpacesProps {
  index: number;
  value: string;
  className?: string;
}

const HtmlWithSpaces:React.FC<SpacesProps> = ({ index, className, value }) => {
  var output = "";
  let isTag = false;
  for (var i = 0, len = value.length; i < len; ++i) {
    const s = value[i];

    if (s === '<') {
      isTag = true;
    }

    if (s === '>') {
      isTag = false;
    }

    if (!isTag && s === ' ') {
      output += '<span class="custom-space-character"></span>'
    } else {
      output += s;
    }
  }
  return <div key={index} className={className} dangerouslySetInnerHTML={{ __html: output }} />
}

export default HtmlWithSpaces;
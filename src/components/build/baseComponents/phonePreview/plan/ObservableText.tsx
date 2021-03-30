import React, { useEffect, useState } from 'react';
import { toRenderJSON } from 'services/SharedTypeService';
import * as Y from "yjs";
import _ from "lodash";
import YoutubeAndMathQuote from 'components/play/baseComponents/YoutubeAndMathQuote';

interface Props {
  text: Y.Text;
  math?: boolean;
}

const ObservableText: React.FC<Props> = ({ text, math }) => {
  const [value, setValue] = useState(text.toString());

  // when mounted observe if text changed and set new text
  useEffect(() => {
    text.observe(_.throttle((evt: Y.YTextEvent) => {
      const newText = toRenderJSON(text);
      if (newText.length !== value.length) {
        setValue(newText)
      }
    }, 200)
    );
  }, []);

  if (math) {
    return <YoutubeAndMathQuote value={value}/>;
  }

  return <div dangerouslySetInnerHTML={{__html: value}} />;
}

export default ObservableText;

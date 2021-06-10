import QuillEditorHighlighter from "components/baseComponents/quill/QuillEditorHighlighter";
import React from "react";

import { PlayMode } from "../model";

import YoutubeAndMathInHtml from "./YoutubeAndMathQuote";

interface SelectableProps {
  value: string;
  mode?: PlayMode;
  isSynthesis?: boolean;
  onHighlight(value: string): void;
}

const HighlightQuoteHtml: React.FC<SelectableProps> = (props) => {
  const { mode } = props;
  if ((mode === PlayMode.Highlighting || mode === PlayMode.UnHighlighting) && props.onHighlight) {
    return <QuillEditorHighlighter
      data={props.value}
    />
    // render highlighter
  }
  return <YoutubeAndMathInHtml isSynthesisParser={props.isSynthesis} value={props.value} />;
};

export default HighlightQuoteHtml;

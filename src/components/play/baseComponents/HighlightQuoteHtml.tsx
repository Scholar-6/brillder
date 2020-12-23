import React from "react";

import { PlayMode } from "../model";

import DocumentHighlight from "components/baseComponents/ckeditor/DocumentHighlighting";
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
    return <DocumentHighlight onChange={props.onHighlight} mode={mode} data={props.value} />;
  }
  return <YoutubeAndMathInHtml isSynthesisParser={props.isSynthesis} value={props.value} />;
};

export default HighlightQuoteHtml;

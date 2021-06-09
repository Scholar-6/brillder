import React from "react";

import { PlayMode } from "../model";

import YoutubeAndMathInHtml from "./YoutubeAndMath";

interface SelectableProps {
  value: string;
  mode?: PlayMode;
  isSynthesis?: boolean;
  onHighlight(value: string): void;
}

const HighlightHtml: React.FC<SelectableProps> = (props) => {
  const { mode } = props;
  if ((mode === PlayMode.Highlighting || mode === PlayMode.UnHighlighting) && props.onHighlight) {
    // render highlihger
  }
  return <YoutubeAndMathInHtml isSynthesisParser={props.isSynthesis} value={props.value} />;
};

export default HighlightHtml;

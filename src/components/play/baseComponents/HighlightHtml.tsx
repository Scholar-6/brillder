import React from "react";

import { PlayMode } from "../model";

import DocumentHighlight from "components/baseComponents/ckeditor/DocumentHighlighting";
import YoutubeAndMathInHtml from "./YoutubeAndMath";

interface SelectableProps {
  value: string;
  mode?: PlayMode;
  onHighlight(value: string): void;
}

const HighlightHtml: React.FC<SelectableProps> = (props) => {
  const { mode } = props;
  if ((mode === PlayMode.Highlighting || mode === PlayMode.UnHighlighting) && props.onHighlight) {
    return <DocumentHighlight onChange={props.onHighlight} mode={mode} data={props.value} />;
  }
  return <YoutubeAndMathInHtml value={props.value} />;
};

export default HighlightHtml;

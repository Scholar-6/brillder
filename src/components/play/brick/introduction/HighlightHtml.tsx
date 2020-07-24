import React from "react";

import { PlayMode } from "../PlayBrickRouting";

import DocumentHighlight from "components/baseComponents/ckeditor/DocumentHighlighting";
import YoutubeAndMathInHtml from "../baseComponents/MathInHtml";

interface SelectableProps {
  value: string;
  mode?: PlayMode;
  onHighlight?(value: string): void;
}

const HighlightHtml: React.FC<SelectableProps> = (props) => {
  if (props.mode === PlayMode.Highlighting && props.onHighlight) {
    return (
      <DocumentHighlight onChange={props.onHighlight} data={props.value} />
    );
  }
  return <YoutubeAndMathInHtml value={props.value} />;
};

export default HighlightHtml;

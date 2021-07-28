import React from "react";

import { PlayMode } from "../model";

import YoutubeAndMathInHtml from "./YoutubeAndMathQuote";

import "./HighlightHtml.scss";

interface SelectableProps {
  value: string;
  mode?: PlayMode;
  isSynthesis?: boolean;
  onHighlight(value: string): void;
}

const HighlightHtml: React.FC<SelectableProps> = (props) => {
  const [textBox, setTextBox] = React.useState<HTMLDivElement>();
  const shouldHighlight = props.mode === PlayMode.Highlighting && props.onHighlight;
  const shouldUnHighlight = props.mode === PlayMode.UnHighlighting && props.onHighlight;

  const onMouseUp = React.useCallback(() => {
    if(!textBox) return;
    const selection = window.getSelection();
    if(selection && !selection.isCollapsed) {
      const range = selection?.getRangeAt(0);
      textBox.contentEditable = "true";
      if (range) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      if(shouldHighlight) {
        if (!document.execCommand("HiliteColor", false, "var(--highlight-yellow)")) {
          document.execCommand("BackColor", false, "var(--highlight-yellow)");
        }
      } else if (shouldUnHighlight) {
        document.execCommand("RemoveFormat", false);
      }
      textBox.contentEditable = "false";
      props.onHighlight(textBox?.innerHTML);
    }
  }, [shouldUnHighlight, shouldHighlight]);

  const textRef = React.useCallback((div: HTMLDivElement) => {
    if(textBox) {
      textBox.removeEventListener("mouseup", onMouseUp);
    }
    if(div) {
      div.addEventListener("mouseup", onMouseUp);
      setTextBox(div);
    }
  }, [setTextBox, onMouseUp]);

  return (
    <div className={`highlight-html${shouldHighlight ? " highlight-on" : ""}`}>
      <YoutubeAndMathInHtml ref={textRef} isSynthesisParser={props.isSynthesis} value={props.value} />
    </div>
  );
};

export default HighlightHtml;

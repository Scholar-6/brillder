import React from "react";

import { PlayMode } from "../model";

//@ts-ignore
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";

import YoutubeAndMathInHtml from "./YoutubeAndMathQuote";

import "./HighlightHtml.scss";

console.log(rangy);
rangy.init();
const classApplier = rangy.createClassApplier("hi");

interface SelectableProps {
  value: string;
  mode?: PlayMode;
  isSynthesis?: boolean;
  onHighlight(value: string): void;
}

const HighlightHtml: React.FC<SelectableProps> = (props) => {
  const [textBox, setTextBox] = React.useState<HTMLDivElement>();
  const shouldHighlight = props.mode === PlayMode.Highlighting && props.onHighlight;

  // 29/07/21 - document.execCommand is deprecated
  // const onMouseUp = React.useCallback(() => {
  //   if(!textBox) return;
  //   const selection = window.getSelection();
  //   if(selection && !selection.isCollapsed && selection.anchorNode && selection.focusNode) {
  //     textBox.contentEditable = "true";
  //     if(shouldHighlight) {
  //       const position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
  //       let backwards = false;
  //       if ((!position && selection.anchorOffset > selection.focusOffset) || position === Node.DOCUMENT_POSITION_PRECEDING) {
  //         backwards = true;
  //       }
  //       console.log(selection.anchorOffset, selection.focusOffset);
  //       if(!backwards) {
  //         if (!document.execCommand("HiliteColor", false, "var(--highlight-yellow)")) {
  //           document.execCommand("BackColor", false, "var(--highlight-yellow)");
  //         }
  //       } else {
  //         document.execCommand("RemoveFormat", false, "foreColor");
  //       }
  //     }
  //     textBox.contentEditable = "false";
  //     props.onHighlight(textBox?.innerHTML);
  //     selection.removeAllRanges();
  //   }
  // }, [shouldHighlight]);

  const onMouseUp = React.useCallback(() => {
    if(!textBox) return;
    const selection = window.getSelection();
    if(selection && !selection.isCollapsed && selection.anchorNode && selection.focusNode) {
      textBox.contentEditable = "true";
      if(shouldHighlight) {
        const position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
        let backwards = false;
        if ((!position && selection.anchorOffset > selection.focusOffset) || position === Node.DOCUMENT_POSITION_PRECEDING) {
          backwards = true;
        }
        console.log(selection.anchorOffset, selection.focusOffset);
        if(!backwards) {
          classApplier.applyToSelection();
        } else {
          classApplier.undoToSelection();
        }
      }
      textBox.contentEditable = "false";
      props.onHighlight(textBox?.innerHTML);
      selection.removeAllRanges();
    }
  }, [shouldHighlight]);

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

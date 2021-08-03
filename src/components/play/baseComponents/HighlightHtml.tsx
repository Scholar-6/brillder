import React from "react";

import { PlayMode } from "../model";

//@ts-ignore
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";

import YoutubeAndMathInHtml from "./YoutubeAndMathQuote";

import "./HighlightHtml.scss";
import { Annotation } from "model/attempt";
import { useLocation } from "react-router-dom";

let annotateCreateEvent: (el: HTMLElement) => void = () => {
  console.log('asdfasdf');
};
const onAnnotateCreate = (el: HTMLElement) => annotateCreateEvent(el);

console.log(rangy);
rangy.init();
const classApplier = rangy.createClassApplier("hi");
const annotator = rangy.createClassApplier("annotation", {
  elementTagName: "a",
  onElementCreate: onAnnotateCreate,
})

interface SelectableProps {
  value: string;
  mode?: PlayMode;
  isSynthesis?: boolean;
  onHighlight(value: string): void;
}

export interface HighlightRef {
  createAnnotation(annotation: Annotation): void;
}

const HighlightHtml = React.forwardRef<HighlightRef, SelectableProps>((props, ref) => {
  const [textBox, setTextBox] = React.useState<HTMLDivElement>();
  const shouldHighlight = props.mode === PlayMode.Highlighting && props.onHighlight;

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

  const createAnnotation = (annotation: Annotation) => {
    if(!textBox) return;
    annotateCreateEvent = (el: HTMLElement) => {
      el.dataset.id = annotation.id.toString();
      (el as HTMLAnchorElement).href = "#" + annotation.id.toString();
    };

    const selection = window.getSelection();
    if(selection && !selection.isCollapsed &&
      selection.anchorNode && textBox.contains(selection.anchorNode) &&
      selection.focusNode && textBox.contains(selection.focusNode)
    ) {
      annotator.applyToSelection();
      props.onHighlight(textBox?.innerHTML);
      selection.removeAllRanges();
    }
  }

  const textRef = React.useCallback((div: HTMLDivElement) => {
    if(textBox) {
      textBox.removeEventListener("mouseup", onMouseUp);
    }
    if(div) {
      div.addEventListener("mouseup", onMouseUp);
      setTextBox(div);
    }
  }, [setTextBox, onMouseUp]);

  const location = useLocation();
  React.useEffect(() => {
    const id = location.hash.substr(1);
    if(!id) return;
    const links = textBox?.querySelectorAll(`.annotation`) as NodeListOf<HTMLAnchorElement>;
    links?.forEach(link => {
      if(link.dataset.id === id) {
        link.classList.add("focused");
      } else {
        link.classList.remove("focused");
      }
    });
  }, [location.hash]);

  React.useImperativeHandle(ref, () => ({
    createAnnotation(annotation: Annotation) { createAnnotation(annotation) }
  }));

  return (
    <div className={`highlight-html${shouldHighlight ? " highlight-on" : ""}`}>
      <YoutubeAndMathInHtml ref={textRef} isSynthesisParser={props.isSynthesis} value={props.value} />
    </div>
  );
});

export default HighlightHtml;

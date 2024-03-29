import React from "react";

import { PlayMode } from "../model";

//@ts-ignore
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";

import "./HighlightHtml.scss";
import { Annotation } from "model/attempt";
import { useLocation } from "react-router-dom";
import YoutubeMathDesmos from "./YoutubeMathDesmos";
import { User } from "model/user";
import SpriteIcon from "components/baseComponents/SpriteIcon";

let annotateCreateEvent: (el: HTMLElement) => void = () => {
};
const onAnnotateCreate = (el: HTMLElement) => annotateCreateEvent(el);

rangy.init();
const classApplier = rangy.createClassApplier("hi");
const annotator = rangy.createClassApplier("annotation", {
  elementTagName: "a",
  onElementCreate: onAnnotateCreate,
  elementProperties: {
    onclick: function () {
      annotator.getHighlightForElement(this);
      return false;
    }
  }
})

interface SelectableProps {
  value: string;
  user?: User;
  mode?: PlayMode;
  isSynthesis?: boolean;
  showCommentBtn?: boolean;
  onHighlight(value: string): void;
}

export interface HighlightRef {
  createAnnotation(annotation: Annotation): string;
  deleteAnnotation(annotation: Annotation): void;
}

const HighlightHtml = React.forwardRef<HighlightRef, SelectableProps>((props, ref) => {
  const [btnShown, setCommentButton] = React.useState({
    shown: false,
    top: 0
  });
  const parentRef = React.useRef<any>(null);
  const [textBox, setTextBox] = React.useState<HTMLDivElement>();
  const shouldHighlight = props.mode === PlayMode.Highlighting && props.onHighlight;

  const onMouseUp = React.useCallback(() => {
    if (!textBox) return;
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && selection.anchorNode && selection.focusNode) {
      textBox.contentEditable = "true";
      if (shouldHighlight) {
        const position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
        let backwards = false;
        if ((!position && selection.anchorOffset > selection.focusOffset) || position === Node.DOCUMENT_POSITION_PRECEDING) {
          backwards = true;
        }
        if (!backwards) {
          classApplier.applyToSelection();
        } else {
          classApplier.undoToSelection();
        }
      }
      textBox.contentEditable = "false";
      props.onHighlight(textBox?.innerHTML);
      selection.removeAllRanges();
    }
    /*eslint-disable-next-line*/
  }, [shouldHighlight]);

  const createAnnotation = (annotation: Annotation) => {
    if (!textBox) return '';
    annotateCreateEvent = (el: HTMLElement) => {
      el.dataset.id = annotation.id.toString();
      (el as HTMLAnchorElement).href = "#" + annotation.id.toString();
    };

    const selection = window.getSelection();
    if (selection && !selection.isCollapsed &&
      selection.anchorNode && textBox.contains(selection.anchorNode) &&
      selection.focusNode && textBox.contains(selection.focusNode)
    ) {
      annotator.applyToSelection();
      var text = textBox?.innerHTML;
      selection.removeAllRanges();
      return text;
    }
    return '';
  }

  const deleteAnnotation = (annotation: Annotation) => {
    if (!textBox) return;

    const els = textBox.querySelectorAll(`.annotation[data-id="${annotation.id}"]`);

    els.forEach(el => {
      const range = rangy.createRange();
      range.selectNodeContents(el);
      const contents = range.extractContents();
      el.parentElement?.insertBefore(contents, el);
      el.remove();
    });

    //props.onHighlight(textBox?.innerHTML);
  }

  const textRef = React.useCallback((div: HTMLDivElement) => {
    if (textBox) {
      textBox.removeEventListener("mouseup", onMouseUp);
    }
    if (div) {
      div.addEventListener("mouseup", onMouseUp);
      setTextBox(div);
    }
    /*eslint-disable-next-line*/
  }, [setTextBox, onMouseUp]);

  const location = useLocation();
  React.useEffect(() => {
    const id = location.hash.substr(1);
    if (!id) return;
    const links = textBox?.querySelectorAll(`.annotation`) as NodeListOf<HTMLAnchorElement>;
    links?.forEach(link => {
      if (link.dataset.id === id) {
        link.classList.add("focused");
      } else {
        link.classList.remove("focused");
      }
    });
    /*eslint-disable-next-line*/
  }, [location.hash]);

  React.useImperativeHandle(ref, () => ({
    createAnnotation(annotation: Annotation) { return createAnnotation(annotation) },
    deleteAnnotation(annotation: Annotation) { deleteAnnotation(annotation) },
  }));

  return (
    <div className="relative" ref={parentRef} onBlur={() => {
      setCommentButton({
        shown: false,
        top: 0
      })
    }}>
      {props.showCommentBtn && btnShown.shown && <div className="comment-button-e323" style={{ top: btnShown.top }} onClick={() => {
        if (textBox) {
          props.onHighlight(textBox.innerHTML);
        }
      }}>
        <div className="relative">
          <SpriteIcon name="message-square" />
          <SpriteIcon className="plus-icon" name="plus-line-custom" />
        </div>
      </div>}
      <div className={`highlight-html${shouldHighlight ? " highlight-on" : ""}`} onClick={(e) => {
        if (textBox) {
          var wW = window.innerWidth;
          var vW = wW / 100;

          let offsetTop = 0;
          if (parentRef) {
            offsetTop = parentRef.current.getBoundingClientRect().y;
          }

          setCommentButton({
            shown: true,
            top: e.clientY - offsetTop - (2 * vW)
          });
        }
      }}>
        <YoutubeMathDesmos ref={textRef} isSynthesisParser={props.isSynthesis} value={props.value} />
      </div>
    </div>
  );
});

export default HighlightHtml;

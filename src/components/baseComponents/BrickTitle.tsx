import React from "react";

//@ts-ignore
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-textrange";

rangy.init();
const classApplier = rangy.createClassApplier("search-highlight");

interface BrickTitleProps {
  title: string;
  className?: string;
  searchString?: string;
}

const BrickTitle:React.FC<BrickTitleProps> = ({title, className = "brick-inline", searchString}) => {
  const [textRef, setTextRef] = React.useState<HTMLSpanElement>();
  const requestRef = React.useRef<number>();
  
  const updateHighlighting = React.useCallback(() => {
    if(!searchString || !textRef) return;
    if(textRef.innerText === "") {
      // This is required to wait for the text of the title to be visible, since it starts off hidden and animates.
      // A bit hacky, but Rangy only finds text that's *visible* on the page (innerText) rather than all text (textContent).
      // So we have to wait for the animation to start playing and *then* sort out highlighting.
      requestRef.current = requestAnimationFrame(updateHighlighting);
    }

    const parentRange = rangy.createRange();
    parentRange.selectNode(textRef);
    const range = rangy.createRange();
    range.findText(searchString, {
      withinRange: parentRange,
    });
    classApplier.applyToRange(range);
  }, [textRef, title, searchString]);

  React.useLayoutEffect(() => {
    requestRef.current = requestAnimationFrame(updateHighlighting);
    return () => {
      requestRef.current && cancelAnimationFrame(requestRef.current);
    }
  }, [updateHighlighting]);

  const textRefCallback = React.useCallback((el: HTMLElement) => {
    setTextRef(el);
  }, [])

  return <span ref={textRefCallback} className={className} dangerouslySetInnerHTML={{__html: title}} />
}

export default BrickTitle;

import React from "react";

//@ts-ignore
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-textrange";

rangy.init();
const classApplier = rangy.createClassApplier("search-highlight");

interface BrickTitleProps {
  title: string;
  searchString?: string;
}

const BrickTitle:React.FC<BrickTitleProps> = ({title, searchString}) => {
  const textRef = React.useCallback((el: HTMLElement) => {
    if(!searchString || !el) return;

    const parentRange = rangy.createRange();
    parentRange.selectNode(el);
    const range = rangy.createRange();
    range.findText(searchString, {
      withinRange: parentRange,
    });
    classApplier.applyToRange(range);
  }, [searchString])

  return <span ref={textRef} className="brick-inline" dangerouslySetInnerHTML={{__html: title}} />
}

export default BrickTitle;

import React from "react";

interface BrickTitleProps {
  title: string;
}

const BrickTitle:React.FC<BrickTitleProps> = ({title}) =>
  <span className="brick-inline" dangerouslySetInnerHTML={{__html: title}} />

export default BrickTitle;

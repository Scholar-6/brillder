import React from "react";

import { Brick } from "model/brick";
import SearchText from "./SearchText";
import { getDateString } from "components/services/brickService";

interface ShortDescriptionProps {
  searchString: string;
  brick: Brick;
}

const AuthorSearchRow: React.FC<ShortDescriptionProps> = ({
  brick,
  searchString,
}) => {
  const res = [];
  if (brick.author) {
    const { author } = brick;
    if (author.firstName) {
      res.push(
        <SearchText key={0} searchString={searchString} text={author.firstName} />
      );
      res.push(' ');
    }
    if (author.lastName) {
      res.push(
        <SearchText key={1} searchString={searchString} text={author.lastName} />
      );
    }
    res.push('•');
  }
  if (brick.created) {
    res.push(<span key={2}>{getDateString(brick.created)}</span>);
  }
  res.push('•');
  res.push(<span key={3}>{brick.brickLength} mins</span>);
  return <span key={4}>{res}</span>;
};

export default AuthorSearchRow;

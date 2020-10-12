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
      res.push(<span key={1}> </span>);
    }
    if (author.lastName) {
      res.push(
        <SearchText key={2} searchString={searchString} text={author.lastName} />
      );
    }
    res.push(<span key={3}> | </span>);
  }
  if (brick.created) {
    res.push(<span key={4}>{getDateString(brick.created)}</span>);
  }
  res.push(<span key={5}> | </span>);
  res.push(<span key={6}>{brick.brickLength} mins</span>);
  return <span key={7}>{res}</span>;
};

export default AuthorSearchRow;

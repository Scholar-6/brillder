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
        <SearchText searchString={searchString} text={author.firstName} />
      );
      res.push(<span> </span>);
    }
    if (author.lastName) {
      res.push(
        <SearchText searchString={searchString} text={author.lastName} />
      );
    }
    res.push(<span> | </span>);
  }
  if (brick.created) {
    res.push(<span>{getDateString(brick.created)}</span>);
  }
  res.push(<span> | </span>);
  res.push(<span>{brick.brickLength} mins</span>);
  return <span>{res}</span>;
};

export default AuthorSearchRow;

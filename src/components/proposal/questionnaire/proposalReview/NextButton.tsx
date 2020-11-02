import React from "react";
import { BookState } from "./ProposalReview";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface ButtonProps {
  bookState: BookState;
  next(): void;
  save(): void;
}

const NextButton: React.FC<ButtonProps> = props => {
  return (
    <div>
      {props.bookState === BookState.TitlesPage
        ? <div className="next-button arrow-button" onClick={props.next} />
        : props.bookState === BookState.PrepPage &&
          <div className="next-button text-with-button" onClick={props.save}>
            Build Questions!
            <SpriteIcon name="trowel-home" />
          </div>
      }
    </div>
  );
}

export default NextButton;

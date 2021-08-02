import React from "react";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Brick } from "model/brick";
import CopyBrickDialog from "./dialogs/CopyBrickDialog";
import { copyBrick } from "services/axios/brick";
import { Question } from "model/question";

export interface ButtonProps {
  history: any;
  questions: Question[];
  brick: Brick;
}

const CopyBrickButton: React.FC<ButtonProps> = props => {
  const [hovered, setHover] = React.useState(false);
  const [open, setOpen] = React.useState(false);


  return (
    <div className="build-publish-button-container">
      <div className={`custom-hover-container ${hovered ? 'hovered' : ''}`}></div>
      <div className="build-publish-button active" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={async () => {
          let res = await copyBrick(props.brick, props.questions);
          if (res) {
            setOpen(true);
          }
        }}
      >
        <SpriteIcon name="copy" />
        {hovered && <div className="custom-tooltip">Copy</div>}
      </div>
      <CopyBrickDialog isOpen={open} close={() => setOpen(false)} />
    </div>
  );
};

export default CopyBrickButton;

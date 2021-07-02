import React from 'react';
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface Props {
  mode: boolean | undefined;
  setMode(value: boolean | undefined): void;
}

const ReviewEye: React.FC<Props> = ({ mode, setMode }) => {
  return (
    mode === true
      ? <SpriteIcon name="eye-on" className="text-theme-dark-blue eye active" onClick={e => {
        e.stopPropagation();
        setMode(undefined);
      }} />
      : <SpriteIcon name="eye-off" className="text-dark-gray eye active" onClick={e => {
        e.stopPropagation();
        setMode(true);
      }} />
  );
}

export default ReviewEye;

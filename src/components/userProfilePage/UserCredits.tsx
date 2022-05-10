import React from 'react';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  className?: string;
  credits?: number;
}

const UserCredits:React.FC<Props> = (props) => {
  const {credits} = props;

  return (
    <div className={props.className}>
      {credits && credits > 0 ? <SpriteIcon name="circle-lines" /> : <SpriteIcon name="circle-lines-blue" />}
      <span>{credits}</span>
    </div>
  );
}


export default UserCredits;

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

enum ChoiceEnum {
  Never = 1,
  Sometimes,
  ALot
}

interface Props {
}

const PhoneBottomMenu: React.FC<Props> = (props) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  return (
    <div className={`sixthform-bottom-menu ${expanded ? 'expanded' : ''}`}>
      <div className="flex-center">
        <div className="label-r323 bold">Your subject rankings</div>
        <SpriteIcon name="double-arrows-r342" className={expanded ? 'expanded' : ''} onClick={() => setExpanded(!expanded)} />
      </div>
      {expanded && <div></div>}
    </div>
  );
}


export default PhoneBottomMenu;

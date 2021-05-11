import React from 'react';

import { fileUrl } from 'components/services/uploadFile';
import { connect } from "react-redux";
import actions from 'redux/actions/play';

interface AnswerProps {
  fileName: string;
  blur(): void;
}

const HoveredPhoneImageContent: React.FC<AnswerProps> = ({ fileName, blur }) => {
  const [lastClick, setLastClick] = React.useState(0);

  const onDoubleClick = () => {
    blur();
  }

  return (
    <div className="center-fixed-image" onClick={e => {
      if (lastClick && e.timeStamp - lastClick < 250) {
        setLastClick(0);
        onDoubleClick();
      } else {
        setLastClick(e.timeStamp);
      }          
    }}>
      <img alt="" src={fileUrl(fileName)} />
    </div>
  );
}

const mapDispatch = (dispatch: any) => ({
  blur: () => dispatch(actions.setImageBlur()),
});

export default connect(null, mapDispatch)(HoveredPhoneImageContent);

import React from "react";
import { useHistory } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { IconButton } from "material-ui";

import './previousButton.scss';

function PreviousButton({ to }: any) {
  const history = useHistory()

  const prev = () => {
    history.push(to);
  }

  return (
    <div className="tutorial-prev-container">
      <IconButton className="tutorial-prev-button" onClick={prev} aria-label="next">
        <ArrowForwardIosIcon className="tutorial-prev-icon rotate-180" />
      </IconButton>
    </div>
  );
}

export default PreviousButton

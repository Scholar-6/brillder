import React from "react";
import { useHistory } from 'react-router-dom';

import './previousButton.scss';
import { Grid } from "@material-ui/core";

interface PrevButtonProps {
  to: string
  isActive: boolean
  onHover(): void
  onOut(): void
}

const PreviousButton:React.FC<PrevButtonProps> = ({
  to, isActive, onHover, onOut
}) => {
  const history = useHistory()

  const prev = () => history.push(to);

  return (
    <Grid container justify="center" className="tutorial-prev-container">
      <img
        alt=""
        onMouseEnter={onHover}
        onMouseLeave={onOut}
        src={isActive ? "/feathericons/chevron-up-orange.png" : "/feathericons/chevron-up-gray.png"}
        onClick={prev}
      />
    </Grid>
  );
}

export default PreviousButton

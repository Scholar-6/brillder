import React, { useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem";

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface Props { }

const FullScreenButton: React.FC<Props> = () => {
  const [state, setState] = React.useState(false);

  useEffect(() => {
    document.onfullscreenchange = function () { 
      setState(!state);
    };
  /*eslint-disable-next-line*/
  }, []);

  const fullscreen = document.fullscreenElement;
  let label = 'Enter Full Screen';
  let name = 'maximize-2';
  if (fullscreen) {
    name = "minimize-2";
    label = 'Exit Full Screen';
  }

  const toggleScreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
      }
    }
  }

  return (
    <MenuItem className="view-profile menu-item disabled" onClick={toggleScreen}>
      <span className="menu-text">{label}</span>
      <div className="btn btn-transparent svgOnHover">
        <SpriteIcon name={name} className="active text-white" />
      </div>
    </MenuItem>
  );
};

export default FullScreenButton;

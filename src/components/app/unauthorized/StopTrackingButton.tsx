import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';
import './StopTrackingButton.scss';

interface StudentRouteProps {
  shown: boolean;
  onClick(): void;
}

const StopTrackingButton: React.FC<StudentRouteProps> = (props) => {
  if (!props.shown) {
    return <div />;
  }

  const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    props.onClick();
  }

  return <div className="stop-cookie-tracking" onClick={deleteAllCookies}>
    <SpriteIcon name="settings" />
  </div>
}


export default StopTrackingButton;

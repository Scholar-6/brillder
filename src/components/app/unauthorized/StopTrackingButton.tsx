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
  return <button className="stop-cookie-tracking" onClick={props.onClick}>Stop Tracking</button>
}


export default StopTrackingButton;


import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { BrickStatus } from 'model/brick';
import React from 'react';

import './StatusCircle.scss';

interface Props {
  isCore: boolean | undefined;
  status: BrickStatus;
}

const StatusCircle: React.FC<Props> = ({isCore, status}) => {
  if (isCore) {
    const getColor = (loopStatus: BrickStatus) => {
      let color = '';
      if (loopStatus === BrickStatus.Draft) {
        color = 'text-theme-orange';
      } else if (loopStatus === BrickStatus.Build) {
        color = 'text-yellow';
      } else if (loopStatus === BrickStatus.Review) {
        color = 'text-white border-green';
      } else if (loopStatus === BrickStatus.Publish) {
        color = 'text-theme-green';
      }
      return color;
    }

    const getToolipText = (loopStatus: BrickStatus) => {
      let text = '';
      if (loopStatus === BrickStatus.Draft) {
        text = 'This is a draft brick';
      } else if (loopStatus === BrickStatus.Build) {
        text = 'This brick is with an editor';
      } else if (loopStatus === BrickStatus.Review) {
        text = 'This brick is pending publication';
      } else if (loopStatus === BrickStatus.Publish) {
        text = 'This brick has been published';
      }
      return text;
    }

    const renderCircle = (staticStatus: BrickStatus) => {
      let className = getColor(staticStatus) + ' build-status-circle';
      if (staticStatus === status) {
        className += ' active';
      }

      return (
        <div className="b-c-container">
          <SpriteIcon name="circle-filled" className={className} />
          <div className="css-custom-tooltip">{getToolipText(staticStatus)} </div>
        </div>
      );
    }

    return (
      <div className="build-status-circle-container">
        {renderCircle(BrickStatus.Draft)}
        {renderCircle(BrickStatus.Build)}
        {renderCircle(BrickStatus.Review)}
        {renderCircle(BrickStatus.Publish)}
      </div>
    );
  }
  return <div />;
}

export default StatusCircle;

import React, { Fragment } from 'react'
import MediaQuery from 'react-responsive';

import './dragBox.scss';
import { QuestionComponentTypeEnum } from 'model/question';


const HoverBox = ({ marginTop, label }: any) => {
  return (
    <Fragment>
      <MediaQuery minDeviceWidth={1280}>
        <div className="drag-box-hover" style={{ marginTop }}>{label}</div>
      </MediaQuery>
      <MediaQuery maxDeviceWidth={1280}>
        <div className="drag-box-hover" style={{ marginTop }}>{label}</div>
      </MediaQuery>
    </Fragment>
  );
}

export interface BoxProps {
  locked: boolean;
  name?: string;
  value: QuestionComponentTypeEnum;
  isImage?: boolean;
  label?: string;
  src?: string;
  fontSize?: string;
  letterSpacing?: string;
  marginTop?: any;
  marginLeft?: any;
  hoverMarginTop?: any;
  fontFamily?: string;
  className?: string;
  onClick?(): void;
}

const DragBox: React.FC<BoxProps> = ({
  name, isImage, src, label, hoverMarginTop, className, onClick, value
}) => {
  const renderContent = () => {
    if (isImage) {
      return <div>
        <img alt="" className={className} style={{ width: '35%' }} src={src} />
        <HoverBox label={label} marginTop={hoverMarginTop} />
      </div>
    }
    return (
      <div className={className}>
        <div className="drag-box-name">{name}</div>
        <HoverBox label={label} marginTop={hoverMarginTop} />
      </div>
    );
  }

  return (
    <div onClick={onClick} data-value={value} className="drag-box-item unselectable">
      {renderContent()}
    </div>
  )
}

export default DragBox

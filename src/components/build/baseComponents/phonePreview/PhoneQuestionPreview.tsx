
import React from 'react';
import {  Hidden } from '@material-ui/core';

import './PhonePreview.scss';
import QuestionPlay from "components/play/brick/questionPlay/QuestionPlay";


export interface PhonePreviewProps {
  question: any
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ question }) => {
  return (
    <Hidden only={['xs', 'sm']}>
      <div className="phone-preview">
        <div className="phone">
          <div className="speaker"></div>
          <div className="camera"></div>
          <div className="sensor"></div>
          <div className="volume volume1"></div>
          <div className="volume volume2"></div>
          <div className="volume volume3"></div>
          <div className="home"></div>
          <div className="screen">
            <div className="custom-component mobile-question-component" style={{background: "white"}}>
              <QuestionPlay question={question} isLastOne={false} answers={[]} next={() => {}}/>
            </div>
          </div>
        </div>
      </div>
    </Hidden>
  );
}

export default PhonePreview;


import React from 'react';
import {  Hidden, Grid } from '@material-ui/core';

import './PhoneQuestionPreview.scss';
import QuestionPlay from "components/play/questionPlay/QuestionPlay";
import { isHintEmpty } from 'components/build/questionService/ValidateQuestionService';


export interface PhonePreviewProps {
  question: any
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ question }) => {
  const renderInnerComponent = () => {
    if (!question.firstComponent?.value && isHintEmpty(question.hint)) {
      return <div>empty</div>;
    }
    return <QuestionPlay question={question} isPhonePreview={true} answers={[]} />;
  }
  return (
    <Hidden only={['xs', 'sm']}>
      <div className="phone-question-preview-box">
        <Grid container alignContent="center" justify="center" style={{height: '100%'}}>
          <div className="phone-question-preview">
            <div className="phone">
              <div className="phone-border">
                <div className="volume volume1"></div>
                <div className="volume volume2"></div>
                <div className="volume volume3"></div>
                <div className="sleep"></div>
                <div className="screen">
                  <div className="custom-component mobile-question-component" style={{background: "white"}}>
                    {renderInnerComponent()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </div>
    </Hidden>
  );
}

export default PhonePreview;

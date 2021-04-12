import React from 'react'
import { Grid } from '@material-ui/core';
import { ReactSortable } from "react-sortablejs";

import './questionPanelWorkArea.scss';
import { QuestionTypeEnum, QuestionComponentTypeEnum } from 'model/question';
import DragBox from './drag/dragBox';
import QuestionTypePreview from '../baseComponents/QuestionTypePreview';


export interface QuestionProps {
  setNextQuestion(): void;
  setPrevFromPhone(): void;
}

const EmptyWorkkArea: React.FC<QuestionProps> = (props) => {
  const locked = true;
  const [componentTypes, setComponentType] = React.useState([
    { id: 1, type: QuestionComponentTypeEnum.Text },
    { id: 2, type: QuestionComponentTypeEnum.Quote },
    { id: 3, type: QuestionComponentTypeEnum.Image },
    { id: 4, type: QuestionComponentTypeEnum.Sound },
    { id: 4, type: QuestionComponentTypeEnum.Graph }
  ]);

  return (
      <div className="build-question-page unselectable active" style={{ width: '100%', height: '94%' }}>
        <div className="top-scroll-area">
          <div className="top-button-container" />
        </div>
        <Grid container direction="row" className="build-question-column">
          <Grid container item xs={4} sm={3} md={3} alignItems="center" className="parent-left-sidebar">
            <div className="left-sidebar">
              <ReactSortable
                list={componentTypes}
                disabled={true}
                group={{ name: "cloning-group-name", pull: "clone" }}
                setList={() => {}} sort={false}
              >
                <DragBox
                  locked={locked}
                  name="T"
                  label="TEXT"
                  className="text-box"
                  hoverMarginTop="-0.85vw"
                  value={QuestionComponentTypeEnum.Text}
                />
                <DragBox
                  locked={locked}
                  name="“ ”"
                  label="QUOTE"
                  hoverMarginTop="-1.5vw"
                  value={QuestionComponentTypeEnum.Quote}
                />
                <DragBox
                  locked={locked}
                  name="jpg"
                  label="IMAGE"
                  value={QuestionComponentTypeEnum.Image}
                />
                <DragBox
                  locked={locked}
                  isImage={true} src="/images/soundicon.png"
                  label="SOUND"
                  className="drag-box-name"
                  value={QuestionComponentTypeEnum.Sound}
                />
                <DragBox
                  locked={locked}
                  name="f(x)"
                  label="GRAPH"
                  className="graph-box"
                  value={QuestionComponentTypeEnum.Graph}
                />
              </ReactSortable>
            </div>
          </Grid>
          <Grid container item xs={5} sm={6} md={6} className="question-components-list" />
          <Grid container item xs={3} sm={3} md={3} direction="column" className="right-sidebar" alignItems="flex-end" />
        </Grid>
        <div className="bottom-scroll-area">
          <div className="bottom-button-container" />
        </div>
        <div className="fixed-build-phone">
          <QuestionTypePreview
            hoverQuestion={QuestionTypeEnum.None}
            nextQuestion={props.setNextQuestion}
            prevQuestion={props.setPrevFromPhone}
          />
        </div>
      </div>
  );
}

export default EmptyWorkkArea;

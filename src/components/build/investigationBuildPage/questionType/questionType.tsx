import React from 'react'
import { Grid } from '@material-ui/core';

import './questionType.scss';
import { QuestionTypeEnum } from 'model/question';
import TypeButton from './TypeButton'


export interface QuestionTypeProps {
  questionType: QuestionTypeEnum,
  activeQuestionType: QuestionTypeEnum,
  synthesis: string,
  history: any,
  brickId: number,
  questionId: number,
  setQuestionType(type: QuestionTypeEnum): void
  setActiveQuestionType(type: QuestionTypeEnum): void
  setHoverQuestion(type: QuestionTypeEnum): void
}

const QuestionTypePage: React.FC<QuestionTypeProps> = ({
  questionType, history, brickId, questionId, synthesis, activeQuestionType,
  setQuestionType, setHoverQuestion, setActiveQuestionType
}: QuestionTypeProps) => {
  if (questionType !== QuestionTypeEnum.None) {
    history.push(`/build/brick/${brickId}/build/investigation/question-component/${questionId}`);
  }

  const type = activeQuestionType;

  const setCurrentType = (type: QuestionTypeEnum) => {
    setActiveQuestionType(type);
  }

  const onHover = (type: QuestionTypeEnum) => {
    setHoverQuestion(type);
  }

  const removeHover = () => {
    setHoverQuestion(QuestionTypeEnum.None);
  }

  const renderSynthesisButton = () => {
    return (
      <Grid className="round-button-center-container" container direction="row" justify="center">
        <Grid
          className="round-button-center"
          onClick={() => {
            history.push(`/build/brick/${brickId}/build/investigation/synthesis`)
          }}
          container direction="row" justify="flex-start"
        >
          <div className="synthesis-icon"></div>
          <span className="synthesis-text">
            {
              synthesis ? 'EDIT SYNTHESIS' : 'ADD SYNTHESIS'
            }
          </span>
        </Grid>
      </Grid>
    );
  }

  return (
    <div className="question-type">
      <div className="inner-question-type">
        <div className="label-question-type">Select Answer Type</div>
        <Grid container direction="row">
          <Grid item xs={4}>
            <TypeButton
              activeType={type}
              questionType={QuestionTypeEnum.ShortAnswer}
              setType={setCurrentType}
              labels={["S H O R T", "A N S W E R"]}
              isActive={false}
              onMouseEnter={onHover}
              onMouseLeave={removeHover}
            />
          </Grid>
          <Grid item xs={4}>
            <TypeButton
              activeType={type}
              questionType={QuestionTypeEnum.ChooseOne}
              setType={setCurrentType}
              labels={["C H O O S E", "O N E"]}
              isActive={false}
              onMouseEnter={onHover}
              onMouseLeave={removeHover}
            />
          </Grid>
          <Grid item xs={4}>
            <TypeButton
              activeType={type}
              questionType={QuestionTypeEnum.ChooseSeveral}
              setType={setCurrentType}
              labels={["C H O O S E", "S E V E R A L"]}
              isActive={false}
              onMouseEnter={onHover}
              onMouseLeave={removeHover}
            />
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item xs={6}>
            <TypeButton
              activeType={type}
              questionType={QuestionTypeEnum.VerticalShuffle}
              setType={setCurrentType}
              labels={["V E R T I C A L", "S H U F F L E"]}
              isActive={false}
              onMouseEnter={onHover}
              onMouseLeave={removeHover}
            />
          </Grid>
          <Grid item xs={6}>
            <TypeButton
              activeType={type}
              questionType={QuestionTypeEnum.HorizontalShuffle}
              setType={setCurrentType}
              labels={["H O R I Z O N T A L", "S H U F F L E"]}
              isActive={false}
              onMouseEnter={onHover}
              onMouseLeave={removeHover}
            />
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item xs={4}>
            <TypeButton
              activeType={type}
              questionType={QuestionTypeEnum.PairMatch}
              setType={setCurrentType}
              labels={["P A I R", "M A T C H"]}
              isActive={false}
              onMouseEnter={onHover}
              onMouseLeave={removeHover}
            />
          </Grid>
          <Grid item xs={4}>
            <TypeButton
              activeType={type}
              questionType={QuestionTypeEnum.Sort}
              setType={setCurrentType}
              labels={["S O R T"]}
              isActive={false}
              onMouseEnter={onHover}
              onMouseLeave={removeHover}
            />
          </Grid>
          <Grid item xs={4}>
            <TypeButton
              activeType={type}
              questionType={QuestionTypeEnum.MissingWord}
              setType={setCurrentType}
              labels={["M I S S I N G", "W O R D"]}
              isActive={false}
              onMouseEnter={onHover}
              onMouseLeave={removeHover}
            />
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item xs={6}>
            <TypeButton
              activeType={type}
              questionType={QuestionTypeEnum.WordHighlighting}
              setType={setCurrentType}
              labels={["W O R D", "H I G H L I G H T I N G"]}
              isActive={false}
              onMouseEnter={onHover}
              onMouseLeave={removeHover}
            />
          </Grid>
          <Grid item xs={6}>
            <TypeButton
              activeType={type}
              questionType={QuestionTypeEnum.LineHighlighting}
              setType={setCurrentType}
              labels={["L I N E", "H I G H L I G H T I N G"]}
              isActive={false}
              onMouseEnter={onHover}
              onMouseLeave={removeHover}
            />
          </Grid>
        </Grid>
      </div>
      {renderSynthesisButton()}
      <Grid className="submit-button-container" container alignContent="center">
        {
          activeQuestionType ? (
            <div>
              <div className="submit-button" onClick={() => setQuestionType(type)}></div>
            </div>
          ) : ""
        }
      </Grid>
    </div>
  );
}

export default QuestionTypePage

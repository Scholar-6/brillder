import React from 'react'
import { Grid } from '@material-ui/core';

import './type.scss';
import { QuestionTypeEnum } from 'model/question';
import TypeButton from './TypeButton'


export interface QuestionTypeProps {
  questionType: QuestionTypeEnum,
  activeQuestionType: QuestionTypeEnum,
  history: any,
  brickId: number,
  questionId: number,
  setQuestionType(type: QuestionTypeEnum): void
  setActiveQuestionType(type: QuestionTypeEnum): void
  setHoverQuestion(type: QuestionTypeEnum): void
}

const QuestionTypePage: React.FC<QuestionTypeProps> = ({
  questionType, history, brickId, questionId, activeQuestionType,
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
              labels={["SHORT", "ANSWER"]}
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
              labels={["CHOOSE", "ONE"]}
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
              labels={["CHOOSE", "SEVERAL"]}
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
              labels={["VERTICAL", "SHUFFLE"]}
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
              labels={["HORIZONTAL", "SHUFFLE"]}
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
              labels={["PAIR", "MATCH"]}
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
              labels={["CATEGORISE"]}
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
              labels={["MISSING", "WORD"]}
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
              labels={["WORD", "HIGHLIGHTING"]}
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
              labels={["LINE", "HIGHLIGHTING"]}
              isActive={false}
              onMouseEnter={onHover}
              onMouseLeave={removeHover}
            />
          </Grid>
        </Grid>
      </div>
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

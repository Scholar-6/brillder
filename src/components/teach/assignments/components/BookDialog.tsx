import { FormControlLabel, Radio } from '@material-ui/core';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { justParseQuestion } from 'components/build/questionService/QuestionService';
import QuestionPlay from 'components/play/questionPlay/QuestionPlay';
import React, { useEffect } from 'react';
import { getAttempts } from 'services/axios/attempt';

import './BookDialog.scss';
import { BookData } from './ExpandedAssignment';

interface Props {
  bookData: BookData;
  onClose(): void;
}

const BookDialog: React.FC<Props> = ({ bookData, onClose }) => {
  const [activeStep, setStep] = React.useState(0);
  const [isReview, setReview] = React.useState(true);

  const [attempt, setAttempt] = React.useState(null as any);

  const getAttempt = async () => {
    if (bookData.assignment) {
      let attempts = await getAttempts(bookData.assignment?.brick.id, bookData.student.id);
      if (attempts) {
        setAttempt(attempts[0]);
      }
    }
  }

  /*eslint-disable-next-line*/
  useEffect(() => { getAttempt() }, []);

  const { student, assignment } = bookData;

  const renderHeader = () => {
    const renderStep = (a: any, index: number) => {
      return (
        <div className={`step ${activeStep === index && 'active'}`} onClick={() => setStep(index)}>
          <span>{index + 1}</span>
          {activeStep === index && <div className="fixed-stepper-triangle" />}
        </div>
      );
    }

    return (
      <div className="header">
        <div className="title"><span className="bold">{student.firstName} {student.lastName} | {assignment?.classroom?.subject?.name},</span> {' '} <span dangerouslySetInnerHTML={{ __html: assignment?.brick.title || '' }} /></div>
        <div className="stepper">
          {student.studentStatus.attempts[0].answers.map(renderStep)}
        </div>
        <SpriteIcon name="cancel-custom" className="close-button" onClick={onClose} />
      </div>
    );
  }


  if (!attempt) {
    return <div />
  }

  const question = justParseQuestion(attempt.brick.questions[activeStep]);

  let parsedAnswers = null;

  let answers: any[] = [];
  if (isReview) {
    answers = attempt.answers;
  } else {
    answers = attempt.liveAnswers;
  }

  try {
    parsedAnswers = JSON.parse(JSON.parse(answers[activeStep].answer));
  } catch { }


  if (!parsedAnswers || !question) {
    return <div />
  }

  let attempt2 = Object.assign({}, attempt) as any;
  attempt2.answer = parsedAnswers;
  if (answers && answers[activeStep]) {
    attempt2.correct = answers[activeStep].correct;
  }

  return (
    <div className="book-dialog">
      <div className="dialog-book-background" />
      <div className="book-box">
        {renderHeader()}
        <div className="book-body">
          <QuestionPlay
            question={question}
            attempt={attempt2}
            isReview={isReview}
            isBookPreview={true}
            answers={parsedAnswers}
          />
        </div>
        <div className="footer">
          <FormControlLabel
            checked={isReview === false}
            control={<Radio onClick={() => setReview(false)} />}
            label="Investigation" />
          <FormControlLabel
            checked={isReview === true}
            control={<Radio onClick={() => setReview(true)} />}
            label="Review" />
          <div className={`back-btn bold ${activeStep === 0 && 'disabled'}`} onClick={() => activeStep > 0 && setStep(activeStep - 1)}>Back</div>
          <div className="next-btn bold" onClick={() => activeStep < (student.studentStatus.attempts[0].answers.length - 1) && setStep(activeStep + 1)}>Next <SpriteIcon name="arrow-right" /></div>
        </div>
      </div>
    </div>
  );
}

export default BookDialog;

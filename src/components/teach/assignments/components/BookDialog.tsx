import React, { useEffect } from 'react';
import { FormControlLabel, Radio } from '@material-ui/core';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { justParseQuestion } from 'components/build/questionService/QuestionService';
import QuestionPlay from 'components/play/questionPlay/QuestionPlay';
import { AttemptStats } from 'model/stats';
import { getAttempts } from 'services/axios/attempt';

import './BookDialog.scss';
import { BookData } from './ExpandedAssignment';

interface Props {
  bookData: BookData;
  nextStudent(): void;
  prevStudent(): void;
  onClose(): void;
}

const BookDialog: React.FC<Props> = ({ bookData, onClose, ...props }) => {
  const [activeStep, setStep] = React.useState(0);
  const [isReview, setReview] = React.useState(true);

  const [attempt, setAttempt] = React.useState(null as any);

  const getBestAttempt = (attempts: AttemptStats[]) => {
    let attempt = attempts[0];
    for (let a of attempts) {
      if (a.percentScore > attempt.percentScore) {
        attempt = a;
      }
    }
    return attempt;
  }

  const getBestStudentAttempt = () => {
    if (student.studentStatus) {
      return getBestAttempt(student.studentStatus.attempts);
    }
    return getBestAttempt(student.studentResult.attempts);
  }

  const getAttempt = async () => {
    if (bookData.assignment) {
      const attempts = await getAttempts(bookData.assignment?.brick.id, bookData.student.id);
      if (attempts) {
        setAttempt(attempts[0]);
      }
    }
  }

  /*eslint-disable-next-line*/
  useEffect(() => { getAttempt() }, [bookData]);

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
        <div className="absolute-user-stepper">
          <div className="arrow-box">
            <SpriteIcon name="arrow-up" onClick={props.prevStudent} />
          </div>
          <div className="user-icon-box">
            <SpriteIcon name="user" />
          </div>
          <div className="arrow-box">
            <SpriteIcon name="arrow-down" onClick={props.nextStudent} />
          </div>
        </div>
        <div className="title"><span className="bold">{student.firstName} {student.lastName} | {assignment?.classroom?.subject?.name},</span> {' '} <span dangerouslySetInnerHTML={{ __html: assignment?.brick.title || '' }} /></div>
        <div className="stepper">
          {getBestStudentAttempt().answers.map(renderStep)}
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

  const renderTitle = (attempt: any) => {
    let correct = false;

    const marks = getMarks();

    if (isReview) {
      correct = attempt.answers[activeStep].correct;
    } else {
      correct = attempt.liveAnswers[activeStep].correct;
    }

    let text = "Incorrect - try again!";
    if (correct) {
      text = "Correct!";
    } else if (marks > 0) {
      text = "Not quite - try again!";
    }
    if (correct) {
      return (
        <div className="ge-phone-title">
          <div className="ge-phone-circle b-green">
            <SpriteIcon name="check-icon" />
          </div>
          <div>{text}</div>
        </div>
      );
    }
    return (
      <div className="ge-phone-title">
        <div
          className={`ge-phone-circle ${attempt.marks > 0 ? "b-yellow" : "b-red"
            }`}
        >
          <SpriteIcon name="cancel-custom" />
        </div>
        <div>{text}</div>
      </div>
    );
  };

  const getMarks = () => {
    let marks = 0;
    if (isReview) {
      marks = attempt.answers[activeStep].marks;
    } else {
      marks = attempt.liveAnswers[activeStep].marks;
    }
    return marks;
  }

  const renderMarks = (attempt: any) => {
    const marks = getMarks();
    const maxMarks = attempt.answers[activeStep].maxMarks;

    return (
      <div className="marks-container">
        <div>Marks</div>
        <div>
          {marks}/{maxMarks}
        </div>
      </div>
    );
  };

  return (
    <div className="book-dialog">
      <div className="dialog-book-background" />
      <div className="book-box">
        {renderHeader()}
        <div className="book-body">
          <div className="question-title">
            {renderTitle(attempt2)}
            {renderMarks(attempt2)}
          </div>
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
          <div className={`back-btn bold ${activeStep === 0 && 'disabled'}`} onClick={() => activeStep > 0 && setStep(activeStep - 1)}>
            <SpriteIcon name="arrow-left" /> Back
          </div>
          <div className="next-btn bold" onClick={() => activeStep < (getBestStudentAttempt().answers.length - 1) && setStep(activeStep + 1)}>
            Next <SpriteIcon name="arrow-right" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDialog;

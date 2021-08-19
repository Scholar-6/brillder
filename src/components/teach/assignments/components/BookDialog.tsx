import { FormControlLabel, Radio } from '@material-ui/core';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

import './BookDialog.scss';
import { BookData } from './ExpandedAssignment';

interface Props {
  bookData: BookData;
  onClose(): void;
}

const BookDialog: React.FC<Props> = ({ bookData, onClose }) => {
  const [activeStep, setStep] = React.useState(0);
  const [isReview, setReview] = React.useState(false);

  if (bookData.open) {
    const renderHeader = () => {
      const { student, assignment } = bookData;
      console.log(bookData.student, bookData.assignment);

      const renderStep = (answer: any, index: number) => {
        return (
          <div className={`step ${activeStep === index && 'active'}`} onClick={() => setStep(index)}>
            <span>{index + 1}</span>
            <div className="underline"><div /></div>
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
    return (
      <div className="book-dialog">
        <div className="dialog-book-background" />
        <div className="book-box">
          {renderHeader()}
          <div className="book-body">Book dialog</div>
          <div className="footer">
            <FormControlLabel
              checked={isReview === false}
              control={<Radio onClick={() => setReview(false)} />}
              label="Investigation" />
            <FormControlLabel
              checked={isReview === true}
              control={<Radio onClick={() => setReview(true)} />}
              label="Review" />
            <div className={`back-btn bold ${activeStep === 0 && 'disabled'}`}>Back</div>
            <div className="next-btn bold">Next <SpriteIcon name="arrow-right" /></div>
          </div>
        </div>
      </div>
    );
  }
  return <div />;
}

export default BookDialog;

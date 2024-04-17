import React from "react";

import CheckBoxV2 from "../CheckBox";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BackButtonSix from "../BackButtonSix";
import { Dialog, Grid } from "@material-ui/core";
import NextButtonSix from "../NextButtonSix";
import { isPhone } from "services/phone";
import CheckBoxPhone from "../CheckBoxPhone";

export enum ReadingChoiceV2 {
  Fiction = 1,
  Science,
  Sport,
  Music,
  Travel,
  Nature,
  History,
  Biography,
  Art,
  Power,
  Religion,
  Other
}

interface ReadingV1Props {
  readingChoicesV2: ReadingChoiceV2[];
  onChange(values: ReadingChoiceV2[]): void;
  moveBack(): void;
  moveNext(): void;
}

const ReadingV2: React.FC<ReadingV1Props> = (props) => {
  const [expanded, setExpanded] = React.useState(false);
  const [overflowOpen, setOverflow] = React.useState(false);

  const renderReadingChoiceV2 = (label: string, currentChoice: ReadingChoiceV2) => {
    const choiceR1 = props.readingChoicesV2.find(c => c === currentChoice);
    return (
      <CheckBoxV2
        currentChoice={currentChoice}
        choice={choiceR1 as any}
        label={label}
        setChoice={choice => {
          let choices = props.readingChoicesV2;
          let index = choices.findIndex(c => c === choice);
          if (index >= 0) {
            choices.splice(index, 1);
          } else {
            if (choices.length <= 3) {
              choices.push(choice);
            } else {
              setOverflow(true);
            }
          }
          props.onChange(choices);
        }}
      />
    );
  }

  const renderReadingChoiceV2Phone = (label: string, currentChoice: ReadingChoiceV2) => {
    const choiceR1 = props.readingChoicesV2.find(c => c === currentChoice);
    return (
      <CheckBoxPhone
        currentChoice={currentChoice}
        choice={choiceR1 as any}
        label={label}
        setChoice={choice => {
          let choices = props.readingChoicesV2;
          let index = choices.findIndex(c => c === choice);
          if (index >= 0) {
            choices.splice(index, 1);
          } else {
            if (choices.length <= 3) {
              choices.push(choice);
            } else {
              setOverflow(true);
            }
          }
          props.onChange(choices);
        }}
      />
    );
  }

  if (isPhone()) {
    return (
      <div className="question question-6 question-reading question-reading-v2">
        <div className="relative">
          <img src="/images/choicesTool/phone/ReadingV2.png" className="third-step-img third-step-img-r4"></img>
        </div>
        <div className="bold font-24 question-text">
          Reading
        </div>
        <div className="font-16 margin-left-4">
          What sort of reading do you<br />
          enjoy most? Select up to <span className="bold">four</span>.
        </div>
        <div className="boxes-container checkbox-container-r64 start font-16">
          {renderReadingChoiceV2Phone("Fiction", ReadingChoiceV2.Fiction)}
          {renderReadingChoiceV2Phone("Science & Technology", ReadingChoiceV2.Science)}
          {renderReadingChoiceV2Phone("Sport & Coaching", ReadingChoiceV2.Sport)}
          {renderReadingChoiceV2Phone("Music & Poetry", ReadingChoiceV2.Music)}
          {renderReadingChoiceV2Phone("Travel, Geography and Other Cultures", ReadingChoiceV2.Travel)}
          {renderReadingChoiceV2Phone("Nature & Environment", ReadingChoiceV2.Nature)}
          {renderReadingChoiceV2Phone("History", ReadingChoiceV2.History)}
          {renderReadingChoiceV2Phone("Biography / Autobiographies", ReadingChoiceV2.Biography)}
          {renderReadingChoiceV2Phone("Art, Design and Architecture", ReadingChoiceV2.Art)}
          {renderReadingChoiceV2Phone("Power, Money, Government & Politics", ReadingChoiceV2.Power)}
          {renderReadingChoiceV2Phone("Religion, Philosophy & Self Improvement", ReadingChoiceV2.Religion)}
          {renderReadingChoiceV2Phone("Other", ReadingChoiceV2.Other)}
        </div>
        {overflowOpen && <Dialog className='too-many-dialog' open={true} onClose={() => setOverflow(false)}>
          Oops! You’ve tried to pick too many.
          <div className="btn" onClick={() => setOverflow(false)}>Close</div>
        </Dialog>}
        <div className="hover-area font-14">
          <SpriteIcon name="help-circle-r1" className="info-icon" onClick={() => setExpanded(!expanded)} />
          {expanded &&
          <div className="hover-content regular">
            <div className="triangle-popup" />
            Reading habits can be an indication of what types of subjects you’ll<br />
            enjoy studying. Some very able students don’t read much, but a deep-<br />
            rooted love of reading is a good indicator of academic aptitude.
          </div>}
        </div>
        <BackButtonSix onClick={() => props.moveBack()} />
        <NextButtonSix label="Continue" onClick={props.moveNext} />
      </div>
    );
  }

  return (
    <div className="question question-6">
      <img src="/images/choicesTool/SecondStepReadingV2.png" className="third-step-img third-step-img-r4"></img>
      <div className="bold font-32 question-text">
        <div>
          Reading
        </div>
        <div className="hover-area font-14">
          <SpriteIcon name="help-circle-r1" className="info-icon" />
          <div className="hover-content regular">
            <div className="triangle-popup" />
            Reading habits can be an indication of what types of subjects you’ll<br />
            enjoy studying. Some very able students don’t read much, but a deep-<br />
            rooted love of reading is a good indicator of academic aptitude.
          </div>
        </div>
      </div>
      <div className="font-16">
        What sort of reading do you enjoy most? Select up to <span className="bold">four</span>.
      </div>
      <Grid container direction="row">
        <Grid item xs={6}>
          <div className="boxes-container checkbox-container-r64 start font-16">
            {renderReadingChoiceV2("Fiction", ReadingChoiceV2.Fiction)}
            {renderReadingChoiceV2("Science & Technology", ReadingChoiceV2.Science)}
            {renderReadingChoiceV2("Sport & Coaching", ReadingChoiceV2.Sport)}
            {renderReadingChoiceV2("Music & Poetry", ReadingChoiceV2.Music)}
            {renderReadingChoiceV2("Travel, Geography and Other Cultures", ReadingChoiceV2.Travel)}
            {renderReadingChoiceV2("Nature & Environment", ReadingChoiceV2.Nature)}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="boxes-container checkbox-container-r64 end font-16">
            {renderReadingChoiceV2("History", ReadingChoiceV2.History)}
            {renderReadingChoiceV2("Biography / Autobiographies", ReadingChoiceV2.Biography)}
            {renderReadingChoiceV2("Art, Design and Architecture", ReadingChoiceV2.Art)}
            {renderReadingChoiceV2("Power, Money, Government & Politics", ReadingChoiceV2.Power)}
            {renderReadingChoiceV2("Religion, Philosophy & Self Improvement", ReadingChoiceV2.Religion)}
            {renderReadingChoiceV2("Other", ReadingChoiceV2.Other)}
          </div>
        </Grid>
      </Grid>
      {overflowOpen && <Dialog className='too-many-dialog' open={true} onClose={() => setOverflow(false)}>
        Oops! You’ve tried to pick too many.
        <div className="btn" onClick={() => setOverflow(false)}>Close</div>
      </Dialog>}
      <BackButtonSix onClick={() => props.moveBack()} />
      <NextButtonSix label="Continue" onClick={props.moveNext} />
    </div>
  );
}

export default ReadingV2;

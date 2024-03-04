import React from "react";

import CheckBoxV2 from "./CheckBox";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BackButtonSix from "./BackButtonSix";
import { Dialog, Grid } from "@material-ui/core";

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
  return (
    <div className="question question-6">
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
        Which of the following statements best describes your attitude to reading?
      </div>

      <Grid container direction="row">
        <Grid item xs={6}>
          <div className="boxes-container start font-16">
            {renderReadingChoiceV2("Fiction", ReadingChoiceV2.Fiction)}
            {renderReadingChoiceV2("Science & Technology", ReadingChoiceV2.Science)}
            {renderReadingChoiceV2("Sport & Coaching", ReadingChoiceV2.Sport)}
            {renderReadingChoiceV2("Music & Poetry", ReadingChoiceV2.Music)}
            {renderReadingChoiceV2("Travel, Geography and Other Cultures", ReadingChoiceV2.Travel)}
            {renderReadingChoiceV2("Nature & Environment", ReadingChoiceV2.Nature)}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="boxes-container end font-16">
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
      <button className="absolute-contunue-btn font-24" onClick={() => props.moveNext()}>Continue</button>
    </div>
  );
}

export default ReadingV2;

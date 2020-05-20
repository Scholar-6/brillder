import React, { useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';

import './shortAnswerBuild.scss'
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';


interface ShortAnswerItem {
  value: string;
}

interface ShrortAnswerData {
  list: ShortAnswerItem[];
}

export interface ShortAnswerBuildProps {
  data: ShrortAnswerData;
  locked: boolean;
  validationRequired: boolean;
  save(): void;
  updateComponent(component:any):void;
}

const ShortAnswerBuildComponent: React.FC<ShortAnswerBuildProps> = ({
  locked, data, save, ...props
}) => {
  const [height, setHeight] = React.useState('0%');

  useEffect(() => calculateHeight());

  if (!data.list) {
    data.list = [{value: ""}];
  }

  const [state, setState] = React.useState(data);
  const [limitOverflow, setLimitOverflow] = React.useState(false);

  useEffect(() => {setState(data) }, [data]);

  const calculateHeight = () => {
    let showButton = true;
    for (let answer of state.list) {
      if (answer.value === "") {
        showButton = false;
      }
    }
    showButton === true ? setHeight('auto') : setHeight('0%');
  }

  const update = () => {
    setState(Object.assign({}, state));
    props.updateComponent(state);
  }

  const changed = (shortAnswer: any, event: any) => {
    if (locked) { return; }
    var res = event.target.value.split(' ');
    if (res.length <= 3) {
      shortAnswer.value = event.target.value;
      setLimitOverflow(false);
      update();
    } else {
      setLimitOverflow(true);
    }
  }

  const addShortAnswer = () => {
    if (locked) { return; }
    state.list.push({ value: ""});
    update();
    save();
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    state.list.splice(index, 1);
    update();
    save();
  }

  const renderShortAnswer = (shortAnswer: any, key: number) => {
    return (
      <div className="short-answer-box" key={key}>
        {
          (state.list.length > 1) ? <DeleteIcon className="right-top-icon" onClick={() => removeFromList(key)} /> : ""
        }
        <input
          disabled={locked}
          value={shortAnswer.value}
          className={props.validationRequired && !shortAnswer.value ? "invalid" : ""}
          onBlur={() => save()}
          onChange={(event) => changed(shortAnswer, event)}
          placeholder="Enter Short Answer..."
        />
      </div>
    );
  }

  return (
    <div className="short-answer-build unique-component">
      {
        state.list.map((shortAnswer:any, i:number) => renderShortAnswer(shortAnswer, i))
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addShortAnswer}
        height={height}
        label="+ &nbsp;&nbsp; S &nbsp; H &nbsp; O &nbsp; R &nbsp; T &nbsp; &nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R" />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={limitOverflow}
        onClose={() => setLimitOverflow(false)}
        action={
          <React.Fragment>
            <div>
              <span className="exclamation-mark">!</span>
              Great minds don't think exactly alike: the learner may know the right answer but use slightly different language, so there is a limit of three words for short answers.
            </div>
          </React.Fragment>
        }
      />
    </div>
  )
}

export default ShortAnswerBuildComponent

import React from "react";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";
import { FormControlLabel, Checkbox } from "@material-ui/core";

import './SendToPublisherDialog.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import SendToPublisherDialog2 from "./SendToPublisher2Dialog";

interface DialogProps {
  isOpen: boolean;
  isPublishing?: boolean; // true if user click to publish
  close(): void;
  submit(): void;
}

const SendToPublisherDialog: React.FC<DialogProps> = (props) => {
  const [checked1, setChecked1] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const [checked3, setChecked3] = React.useState(false);
  const [checked4, setChecked4] = React.useState(false);

  const [invalid, setInvalid] = React.useState(false);

  const [submiting, setSubmiting] = React.useState(false);

  const isValid = () => {
    if (checked1 && checked2 && checked3 && checked4) {
      return true;
    }
    return false;
  }

  const submit = async () => {
    if (!submiting) {
      setSubmiting(true);
      await props.submit();
      setSubmiting(false);
    }
  }

  return (
    <BaseDialogWrapper open={props.isOpen} className="send-publish-dialog" close={props.close} submit={() => { }}>
      <div className="dialog-header">
        <div className="title">Before submitting this brick for publication, please confirm the following:</div>
        <FormControlLabel
          checked={checked1}
          control={<Checkbox onClick={() => setChecked1(!checked1)} />}
          label="The images used are of a reasonable quality and have neither stretched nor pixelated. They are available for use without commercial restrictions."
        />
        <FormControlLabel
          checked={checked2}
          control={<Checkbox onClick={() => setChecked2(!checked2)} />}
          label="The Prep material for this brick should not take significantly longer or shorter to consider than the recommended guideline (5, 10, and 15 minutes for 20, 40, and 60 minute bricks respectively)."
        />
        <FormControlLabel
          checked={checked3}
          control={<Checkbox onClick={() => setChecked3(!checked3)} />}
          label="The Synthesis for this brick should not take significantly longer or shorter to read than the recommended guideline (4, 8, and 16 minutes @ 150-200 words/min. for 20, 40, and 60 minute bricks respectively)."
        />
        <FormControlLabel
          checked={checked4}
          control={<Checkbox onClick={() => setChecked4(!checked4)} />}
          label="I have clicked through the mobile previews on the right of the screen while building, and have pressed the green button in the top right to play preview a version of this brick on a desktop. In both cases, I have either flagged technical issues where they have arisen, or made fixes to improve the play experience myself."
        />
      </div>
      <div className="dialog-footer">
        <div>
          <div>
            <button className="btn btn-md bg-theme-orange yes-button" onClick={props.close}>
              <span>It's not ready yet!</span>
            </button>
            <div className={`btn flex-button btn-md no-button ${isValid() ? 'bg-green text-white' : 'bg-gray'}`} onClick={() => {
              isValid() ? submit() : setInvalid(true);
            }}>
              <div>{props.isPublishing ? 'Publish' : 'Send to Publisher'}</div>
              <div className="flex-center">
                {submiting ? <SpriteIcon name="f-loader" className="spinning" /> : <SpriteIcon name="send" />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SendToPublisherDialog2 isOpen={invalid} close={() => setInvalid(false)} />
    </BaseDialogWrapper>
  );
}

export default SendToPublisherDialog;

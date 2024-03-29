import React from 'react';
import { Dialog } from '@material-ui/core';
import { adminAddCredits } from 'services/axios/admin';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  isOpen: boolean;
  userId: number;
  onClose(credits?: number): void;
}

const AddingCreditsDialog: React.FC<Props> = props => {
  const [credits, setCredits] = React.useState(1);

  const assignCredits = async () => {
    let res = await adminAddCredits({ credits, userIds: [props.userId] });
    if (res) {
      props.onClose(credits);
    } else {
      // error
    }
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={() => props.onClose()}
      className="dialog-box adding-credits-dialog"
    >
      <div className="close-button svgOnHover" onClick={() => props.onClose()}>
        <SpriteIcon name="cancel-thick" className="active" />
      </div>
      <div className="dialog-header">
        <div>Add credits</div>
      </div>
      <div className="input-block">
        <input
          type="number" name="credits"
          value={credits}
          onChange={(e) => {
            setCredits(parseInt(e.target.value));
          }}
        />
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-green yes-button"
          onClick={() => assignCredits()}>
          <span>Add Credits</span>
        </button>
      </div>
    </Dialog>
  );
};

export default AddingCreditsDialog;

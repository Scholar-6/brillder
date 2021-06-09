import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { TextField } from "@material-ui/core";
import map from "components/map";

interface UnauthorizedProps {
  emailInvalid: boolean | null; // null - before submit
  isOpen: boolean;
  history: any;
  login(email: string): void;
  again(): void;
  close(): void;
}

const UnauthorizedUserDialogV2: React.FC<UnauthorizedProps> = (props) => {
  const [email, setEmail] = React.useState("");

  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue set-user-email-dialog">
      <div className="dialog-header">
        <div className="bold">Great that you've clicked a Brick. To play this amazing, authored resource for free can we have your email?</div>
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        props.login(email);
      }}>
        <TextField
          variant="standard"
          placeholder="Enter a valid email"
          type="email"
          className={`dialog-input ${props.emailInvalid ? 'm-input-theme-orange' : ''}`}
          value={email}
          onChange={evt => setEmail(evt.target.value)}
        />
        <div className="small-text-link" onClick={() => props.history.push(map.Login)}>Already a member? Sign in here.</div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-gray no-button" onClick={props.again}>
            <span className="bold">Not yet</span>
          </button>
          <button type="submit" className="btn btn-md bg-theme-orange yes-button">
            <span className="bold">Sure</span>
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default UnauthorizedUserDialogV2;

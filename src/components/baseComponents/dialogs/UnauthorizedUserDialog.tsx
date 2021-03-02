import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { TextField } from "@material-ui/core";

interface UnauthorizedProps {
  isOpen: boolean;
  login(email: string): void;
  again(): void;
  close(): void;
}

const UnauthorizedUserDialog: React.FC<UnauthorizedProps> = (props) => {
  const [email, setEmail] = React.useState("");
  const [emailInvalid, setInvalid] = React.useState(false);

  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue set-user-email-dialog">
      <div className="dialog-header">
        <div className="bold">Before you can review your answers and learn how to improve your score, you need to create an account.</div>
        <div className="bold">Creating an account is free, no obligations.</div>
      </div>
      <form onSubmit={(e) => {
        console.log(55);
        e.preventDefault();
        if (email && email.length > 0) {
          props.login(email);
        } else {
          setInvalid(true);
        }
      }}>
        <TextField
          variant="standard"
          placeholder="Enter your email to create an account"
          type="email"
          className={`dialog-input ${emailInvalid ? 'input-theme-orange' : ''}`}
          value={email}
          onChange={evt => setEmail(evt.target.value)}
        />
        <div className="dialog-footer">
          <button type="submit" className="btn btn-md bg-theme-orange yes-button">
            <span className="bold">Create Account</span>
          </button>
          <button className="btn btn-md bg-gray no-button" onClick={props.again}>
            <span className="bold">Try another brick</span>
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default UnauthorizedUserDialog;

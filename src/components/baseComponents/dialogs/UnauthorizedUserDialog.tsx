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

  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue">
      <div className="dialog-header">
        <div className="bold">Before you can review your answers and learn how to improve your score, you need to create an account.</div>
        <div className="bold">Creating an account is free, no obligations.</div>
      </div>
      <TextField
        variant="standard"
        placeholder="Enter your email to create an account"
        type="email"
        className="dialog-input"
        value={email}
        onChange={evt => setEmail(evt.target.value)}
      />
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={() => props.login(email)}>
          <span className="bold">Create Account</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={props.again}>
          <span className="bold">Try another brick</span>
        </button>
      </div>
    </Dialog>
  );
};

export default UnauthorizedUserDialog;

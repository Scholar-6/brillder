import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { TextField } from "@material-ui/core";
import map from "components/map";
import SpriteIcon from "../SpriteIcon";
import playRoutes from 'components/play/routes';
import { SetLoginRedirectUrl } from "localStorage/login";

interface UnauthorizedProps {
  brickId: number;
  emailInvalid: boolean | null; // null - before submit
  isOpen: boolean;
  history: any;
  login(email: string): void;
  again(): void;
  close(): void;
}

const UnauthorizedUserDialog: React.FC<UnauthorizedProps> = (props) => {
  const [email, setEmail] = React.useState("");

  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue set-user-email-dialog">
      <div className="dialog-header">
        <div className="bold">Before you can review your answers and learn how to improve your score, you need to create an account.</div>
        <div className="bold">Creating an account is free, no obligations.</div>
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        props.login(email);
      }}>
        <TextField
          variant="standard"
          placeholder="Enter your email to create an account"
          type="email"
          className={`dialog-input ${props.emailInvalid ? 'm-input-theme-orange' : ''}`}
          value={email}
          onChange={evt => setEmail(evt.target.value)}
        />
        <div className="small-text-link" onClick={() => {
          SetLoginRedirectUrl(playRoutes.playTimeReview(props.brickId));
          props.history.push(map.Login);
        }}>Already a member? Sign in here<SpriteIcon name="arrow-right" /></div>
        <div className="dialog-footer big-footer">
          <button type="submit" className="btn btn-md bg-theme-orange yes-button">
            <span className="bold">Create Account</span>
          </button>
          <button className="btn btn-md bg-gray no-button" onClick={props.again}>
            <span className="bold">Try more bricks</span>
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default UnauthorizedUserDialog;

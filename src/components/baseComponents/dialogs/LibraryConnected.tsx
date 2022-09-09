import React from "react";
import Dialog from "@material-ui/core/Dialog";
import SpriteIcon from "../SpriteIcon";

interface SuccessDialogProps {
  isOpen: boolean;
  label?: string;
  className?: string;
  close(): void;
}

const LibraryConnectDialog: React.FC<SuccessDialogProps> = props => {
  const [clicked, setClicked] = React.useState(false);


  return (
    <Dialog
      open={props.isOpen}
      onClick={props.close}
      onClose={props.close}
      className="dialog-box link-copied-dialog text-dialog library-connected-popup"
    >
      <div className="dialog-header">
        <div className="title bold">
          Thank you, your credentials have been verified
        </div>
        <div className="regular">
          As a new user, please register an email and password to your account.
        </div>
        <div className="library-e-r-label italic">
          <span onClick={() => {
            setClicked(!clicked);
          }}>
            How will this information be used? <SpriteIcon className={clicked ? "rotated" : ""} name="arrow-right"/>
          </span>
          <div className={`expand-area ${clicked ? "" : "hidden"}`}>
            Registering an email address ensures you can still track your achievement should your library membership change,
            for example were you to move from your current area. Brillder does not send general publicity messages,
            and we will only contact you in specific circumstances, such as in case of an issue with your account.
            If you need to contact us, this also helps us verify who you are. Your email address will be securely stored,
            and will never be shared with a third party. Our full terms and conditions will be shown shortly,
            or else see <a href="https://app.brillder.com/terms">Terms</a>  at the foot of this page.
          </div>
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-theme-green yes-button"
            onClick={props.close}>
            <span>OK</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default LibraryConnectDialog;

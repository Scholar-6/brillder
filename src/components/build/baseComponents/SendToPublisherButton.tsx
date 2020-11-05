import React from "react";
import { connect } from "react-redux";

import brickActions from 'redux/actions/brickActions';
import { ReduxCombinedState } from "redux/reducers";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import SendToPublisherDialog from "./dialogs/SendToPublisherDialog";
import SendPublisherSuccessDialog from "components/playPreview/finalStep/SendPublisherSuccess";

export interface ButtonProps {
  disabled: boolean;
  brickId: number;
  onFinish(): void;

  // redux
  sendedToPublisher: boolean;
  publisherConfirmed: boolean;

  sendToPublisherConfirmed(): Promise<void>;
  sendToPublisher(brickId: number): Promise<void>;
}

const SendToPublisherButton: React.FC<ButtonProps> = props => {
  const [isOpen, setState] = React.useState(false);

  let className = 'send-to-publisher-button';
  if (props.disabled) {
    className += ' disabled';
  }

  return (
    <div>
      <div className={className} onClick={() => {
        if (!props.disabled) {
          setState(true);
        }
      }}>
        <SpriteIcon name="send" />
      </div>
      <SendToPublisherDialog isOpen={isOpen} close={() => setState(false)} submit={async () => {
        await props.sendToPublisher(props.brickId);
        setState(false);
      }} />
      <SendPublisherSuccessDialog
        isOpen={props.sendedToPublisher && props.publisherConfirmed === false}
        close={() => {
          props.sendToPublisherConfirmed();
          props.onFinish();
        }}
      />
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  sendedToPublisher: state.sendPublisher.success,
  publisherConfirmed: state.sendPublisher.confirmed,
});

const mapDispatch = (dispatch: any) => ({
  sendToPublisher: (brickId: number) => dispatch(brickActions.sendToPublisher(brickId)),
  sendToPublisherConfirmed: () => dispatch(brickActions.sendToPublisherConfirmed()),
});

export default connect(mapState, mapDispatch)(SendToPublisherButton);

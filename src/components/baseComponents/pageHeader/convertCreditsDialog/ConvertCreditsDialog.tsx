import React, { useState } from 'react';
import { connect } from 'react-redux';


import './ConvertCreditsDialog.scss';
import userActions from 'redux/actions/user';
import BaseDialogWrapper from '../../dialogs/BaseDialogWrapper';
import { convertBrillsToCreditsByAmount } from 'services/axios/brills';

const mapDispatch = (dispatch: any) => {
  return { 
    getUser: () => dispatch(userActions.getUser()),
  }
}

interface LogoutComponentProps {
  isOpen: boolean;
  close(): void;
  getUser(): void;
}

const ConvertCreditsDialog: React.FC<LogoutComponentProps> = (props) => {
  const [is200Open,set200] = useState(false);
  const [is500Open, set500] = useState(false);

  const close200 = () => set200(false);
  const close500 = () => set500(false);

  const convert200 = async () => {
    let res = await convertBrillsToCreditsByAmount(200);
    if (res) {
      props.getUser();
    }
    close200();
  }

  const convert500 = async () => {
    const res = await convertBrillsToCreditsByAmount(500);
    if (res) {
      props.getUser();
    }
    close500();
  }

  return (
    <div>
      <BaseDialogWrapper className="convert-credits-dialog" open={props.isOpen} close={props.close} submit={() => { }}>
        <div className="dialog-header">
          <div className="title-df233 flex-center f-black">
            Convert Brills
          </div>
          <div>What would you like to exchange your brills for?</div>
          <div className="m-top-d33">Credits</div>
          <div className="f-regular">Spend 1 credit to play a brick, or 2 to enter a competition</div>
          <div className="flex-center">
            <div className="btn" onClick={() => { 
              props.close();
              set200(true);
            }}>2 credits for 200 brills</div>
            <div className="btn" onClick={() => {
              props.close();
              set500(true);
            }}>6 credits for 500 brills</div>
          </div>
          <div className="m-top-d33">Premium subscription (1 year)</div>
          <div className="f-regular">Upgrading to a premium subscription will give you 6 credits monthly, and let you</div>
          <div className="f-regular">convert your brills for other awards</div>
          <div className="flex-center">
            <div className="btn btn-gray-de3 flex-center disabled">
              Coming Soon
            </div>
          </div>
        </div>
      </BaseDialogWrapper>
      <BaseDialogWrapper className="convert-credits-dialog second-conver-dialog" open={is200Open} close={props.close} submit={() => { }}>
        <div className="dialog-header">
          <div className="title-df233 flex-center f-black">
            Convert Brills
          </div>
          <div>Redeeming 2 credits for 200 brills</div>
          <div className="flex-center">
            <div className="btn flex-center orange" onClick={close200}>Cancel</div>
            <div className="btn flex-center m-left-33" onClick={convert200}>Yes!</div>
          </div>
        </div>
      </BaseDialogWrapper>
      <BaseDialogWrapper className="convert-credits-dialog second-conver-dialog" open={is500Open} close={props.close} submit={() => { }}>
        <div className="dialog-header">
          <div className="title-df233 flex-center f-black">
            Convert Brills
          </div>
          <div>Redeeming 6 credits for 500 brills</div>
          <div className="flex-center">
            <div className="btn flex-center orange" onClick={close500}>Close</div>
            <div className="btn flex-center m-left-33" onClick={convert500}>Yes!</div>
          </div>
        </div>
      </BaseDialogWrapper>
    </div>
  );
}

const connector = connect(null, mapDispatch);

export default connector(ConvertCreditsDialog);

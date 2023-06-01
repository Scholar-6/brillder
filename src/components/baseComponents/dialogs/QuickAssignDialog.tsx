import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { connect } from 'react-redux';
import * as QRCode from "qrcode";

import './QuickAssignDialog.scss';
import { ReduxCombinedState } from 'redux/reducers';
import actions from 'redux/actions/requestFailed';
import { User } from 'model/user';
import { Brick } from 'model/brick';
import { ClassroomApi } from 'components/teach/service';
import SpriteIcon from '../SpriteIcon';

interface AssignPersonOrClassProps {
  brick: Brick;
  user?: User;
  history: any;
  isOpen: boolean;
  classroom: ClassroomApi | null;
  close(): void;
  requestFailed(e: string): void;
}

const QuickAssignDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  const [imgBase64, setImageBase64] = React.useState('');

  const writeQRCode = (str: string) => {
    QRCode.toDataURL(str, {
      width: 600,
      height: 600
    } as QRCode.QRCodeToDataURLOptions, (err, dataURL) => {
      setImageBase64(dataURL);
    });
  }

  useEffect(() => {
    if (props.classroom) {
      writeQRCode('https://dev-app.brillder.com/quickassignment/' + props.classroom.code);
    }
    /*eslint-disable-next-line*/
  }, [props.classroom]);

  if (props.classroom) {
    return (
      <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue quick-assign-dialog">
        <div className="dialog-header">
          <SpriteIcon name="cancel-custom" className="close-btn" onClick={props.close} />
          <div className="r-popup-title bold r-first-class">Code for joining class</div>
          <div>{props.classroom.code}</div>
          <div ><img className="qr-code-img" src={imgBase64} /></div>
        </div>
      </Dialog>
    );
  }
  return <div />;
}

const mapState = (state: ReduxCombinedState) => ({
  brick: state.brick.brick
});

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

const connector = connect(mapState, mapDispatch);

export default connector(QuickAssignDialog);

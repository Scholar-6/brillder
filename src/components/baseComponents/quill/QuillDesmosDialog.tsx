import React from 'react';
import Dialog from '@material-ui/core/Dialog';
//@ts-ignore
import Desmos from 'desmos';

import { GraphSettings } from 'components/build/buildQuestions/components/Graph/Graph';

import 'components/build/buildQuestions/components/Graph/GraphDialog.scss';
import _ from 'lodash';
import { Grid, IconButton } from '@material-ui/core';
import SpriteIcon from '../SpriteIcon';

interface GraphDialogProps {
  isOpen: boolean;
  graphState: any;
  graphSettings: GraphSettings;
  close(): void;
  setGraphState(state: any): void;
  setGraphSettings(settings: GraphSettings): void;
}

const QuillDesmosDialog: React.FC<GraphDialogProps> = props => {
  const [calculator, setCalculator] = React.useState<any>();

  const graphCallback = React.useCallback(elt => {
    if(elt) {
      var calculator = Desmos.GraphingCalculator(elt, {
        fontSize: Desmos.FontSizes.VERY_SMALL,
        administerSecretFolders: true
      });
      if(initialProps.current.graphState) {
        calculator.setState(initialProps.current.graphState);
      }
      calculator.observeEvent('change', _.debounce(() => {
        initialProps.current.setGraphState(calculator.getState());
      }, 500));
      setCalculator(calculator);
    }
  }, []);

  React.useEffect(() => {
    if(calculator) {
      calculator.unobserveEvent('change');
      calculator.observeEvent('change', _.debounce(() => {
        props.setGraphState(calculator.getState());
      }, 1000));
    }
    return () => {
      if(calculator) {
        calculator.unobserveEvent('change');
      }
    }
  }, [calculator, props.setGraphState]);

  React.useEffect(() => {
    if(calculator) {
      calculator.setState(props.graphState);
    }
  }, [calculator, props.graphState]);

  const initialProps = React.useRef(props);

  return (
  <Dialog
    open={props.isOpen}
    onClose={props.close}
    className="dialog-box light-blue graph-dialog"
  >
    <div className="close-button svgOnHover" onClick={props.close}>
      <SpriteIcon name="cancel" className="w100 h100 active" />
    </div>
    <div className="graph-dialog-desmos" ref={graphCallback} />
  </Dialog>
  );
};

export default QuillDesmosDialog;
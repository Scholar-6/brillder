import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";

import { enterPressed } from "components/services/key";

interface DialogProps {
  open: boolean;
  submit(): void;
  close(): void;
}

interface DialogState {
  handleMove(e: any): void;
}

class BaseDialogWrapper extends Component<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);

    this.state = {
      handleMove: this.handleMove.bind(this)
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleMove, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleMove, false);
  }
  
  handleMove(e: any) {
    if (this.props.open) {
      if (enterPressed(e)) {
        e.stopPropagation();
        console.log('click');
        this.props.submit();
      }
    }
  }

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.close} className="dialog-box">
        {this.props.children}
      </Dialog>
    );
  }
}

export default BaseDialogWrapper;

import React, { Component, Ref } from "react";

import MathInHtml from "components/play/brick/baseComponents/MathInHtml";

interface SelectableProps {
  value: string;
}

interface SelectableState {
  ref: any;
}

class SelectableText extends Component<SelectableProps, SelectableState> {
  constructor(props: SelectableProps) {
    super(props);
    this.state = {
      ref: React.createRef(),
    };
  }
  componentDidMount() {
    let { current } = this.state.ref;
    current.addEventListener("selectstart", (e:any) => {
      console.log("Selection started", e);
    });
  }
  render() {
    return <div ref={this.state.ref}> <MathInHtml value={this.props.value} /></div>;
  }
}

export default SelectableText;

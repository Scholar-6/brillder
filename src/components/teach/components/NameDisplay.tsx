import React, { useState } from 'react';

import { connect } from 'react-redux';
import { ReduxCombinedState } from 'redux/reducers';

import "./NameAndSubjectForm.scss";

interface INameDisplay {
  name: string;
}

const NameDisplay: React.FC<INameDisplay> = props => {
  const [name, setName] = React.useState<string>();


  React.useEffect(() => {
    console.log('updated', props.name);
  }, [props.name]);

  console.log('render 1', props.name);
  return <h1 className="name-display">{props.name}</h1>;
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
export default connect(mapState)(NameDisplay);
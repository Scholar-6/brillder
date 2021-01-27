import React, { Component } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import actions from 'redux/actions/requestFailed';
import { connect } from 'react-redux';

import './SubjectAutoCompete.scss';
import { Subject } from 'model/brick';
import { Popper } from '@material-ui/core';


interface SubjectAutoCompleteProps {
  subjects: Subject[];
  selected: Subject[];
  onSubjectChange(subjects: any[]): void;
  requestFailed(e: string): void;
}

interface SubjectAutoCompleteState {
  selected: Subject[];
  autoCompleteSubjects: Subject[];
  autoCompleteOpen: boolean;
}

const SubjectsPopper = function (props: any) {
  return <Popper {...props} className="subjects-popper" placement="bottom-start" />;
};

class SubjectAutoComplete extends Component<SubjectAutoCompleteProps, SubjectAutoCompleteState> {
  constructor(props: SubjectAutoCompleteProps) {
    super(props)
    let selectedSubjects:Subject[] = [];

    if (this.props.selected) {
      selectedSubjects = this.props.selected;
    }

    const autoCompleteSubjects = props.subjects.filter(s => this.checkSubject(s, selectedSubjects))

    this.state = {
      selected: selectedSubjects,
      autoCompleteSubjects,
      autoCompleteOpen: false,
    };
  }

  checkSubject(s: Subject, subjects: Subject[]) {
    for (let subject of subjects) {
      if (subject.id === s.id) {
        return false;
      }
    }
    return true;
  }

  onSubjectChange(e: any, newValue: any[]) {
    const autoCompleteSubjects = this.props.subjects.filter(s => this.checkSubject(s, newValue));
    this.setState({...this.state, autoCompleteSubjects, selected: newValue});
    this.props.onSubjectChange(newValue);
  }

  onSubjectInput(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const {value} = event.target;

    if (value && value.length >= 2) {
      this.setState({...this.state, autoCompleteOpen: true});
    } else {
      this.setState({...this.state, autoCompleteOpen: false});
    }
  }

  hide() {
    this.setState({...this.state, autoCompleteOpen: false});
  }

  render() {
    return (
      <div className="big-input-container">
        <Autocomplete
          multiple
          open={this.state.autoCompleteOpen}
          value={this.state.selected}
          options={this.state.autoCompleteSubjects}
          onChange={(e:any, v: any) => this.onSubjectChange(e, v)}
          getOptionLabel={(option:any) => option.name}
          PopperComponent={SubjectsPopper}
          noOptionsText="Sorry, try typing something else"
          className="subject-autocomplete"
          renderInput={(params:any) => (
            <TextField
              onBlur={() => this.hide()}
              {...params}
              onChange={(e) => this.onSubjectInput(e)}
              variant="standard"
              label="Subjects: "
              placeholder="Subjects"
            />
          )}
        />
      </div>
    );
  }
}

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

const connector = connect(null, mapDispatch);

export default connector(SubjectAutoComplete);

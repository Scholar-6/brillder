import { ListItemIcon, ListItemText, MenuItem, Select, SvgIcon } from '@material-ui/core';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { Subject } from 'model/brick';
import { User } from 'model/user';
import React from 'react';
import { connect } from 'react-redux';
import { ReduxCombinedState } from 'redux/reducers';

import "./NameAndSubjectForm.scss";

interface NameAndSubjectFormProps {
  name: string;
  subject: Subject;
  onChange(name: string, subject: Subject): void;

  user: User;
}

const NameAndSubjectForm: React.FC<NameAndSubjectFormProps> = props => {
  const [edit, setEdit] = React.useState(false);

  const [name, setName] = React.useState<string>();
  const [subjectIndex, setSubjectIndex] = React.useState<number>();

  const startEditing = React.useCallback(() => {
    setEdit(true);

    setName(props.name);
    if(props.subject) {
      setSubjectIndex(props.user.subjects.findIndex(s => s.id === props.subject.id));
    }
  }, [props.name, props.subject, props.user.subjects]);

  const submit = React.useCallback(() => {
    if(name && (subjectIndex !== undefined) && props.user.subjects[subjectIndex]) {
      props.onChange(name, props.user.subjects[subjectIndex]);
      setEdit(false);
    }
  }, [name, subjectIndex, props]);

  return edit ?
  (
    <div className="name-subject-form">
      <Select
        value={subjectIndex}
        onChange={e => setSubjectIndex(e.target.value as number)}
        className="subject-input"
        disableUnderline
        IconComponent={
          () => <SvgIcon className="arrow-icon">
            <SpriteIcon
              name="arrow-down"
              className="w100 h100 active"
              style={{
                color: (props.user.subjects[subjectIndex!]?.color ?? "#FFFFFF") === "#FFFFFF" ?
                  "var(--theme-dark-blue)" : 
                  "var(--white)"
              }}
            />
          </SvgIcon>
        }
      >
        { props.user.subjects.map((s, i) => 
          <MenuItem value={i} key={i}>
            <ListItemIcon>
              <SvgIcon>
                <SpriteIcon
                  name={s.color === "#FFFFFF" ? "circle-empty" : "circle-filled"}
                  className="w100 h100 active"
                  style={{ color: s.color === "#FFFFFF" ? "var(--theme-dark-blue)" : s.color }}
                />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText>{s.name}</ListItemText>
          </MenuItem>
        ) }
      </Select>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        className="name-input"
      />
      <span className="submit-icon tick" onClick={submit}>
        <SpriteIcon
          name="ok"
          className="w100 h100 active"
        />
      </span>
      <span className="submit-icon" onClick={() => setEdit(false)}>
        <SpriteIcon
          name="cancel-custom"
          className="w100 h100 active"
        />
      </span>
    </div>
  ) : (
    <div className="name-subject-display">
      <div className="subject-icon">
        <SpriteIcon
          name={(props.subject?.color ?? "#FFFFFF") === "#FFFFFF" ? "circle-empty" : "circle-filled"}
          className="w100 h100 active"
          style={{
            color: (props.subject?.color ?? "#FFFFFF") === "#FFFFFF" ?
              "var(--theme-dark-blue)" :
              props.subject.color
          }}
        />
      </div>
      <h1 className="name-display">{props.name}</h1>
      <span className="edit-icon" onClick={startEditing}>
        <SpriteIcon
          name="edit-outline"
          className="w100 h100 active"
        />
      </span>
      <div className="assign-button-container">
        <div className="btn" onClick={() => {}}>
          Assign a new brick
        </div>
      </div>
    </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

export default connector(NameAndSubjectForm);
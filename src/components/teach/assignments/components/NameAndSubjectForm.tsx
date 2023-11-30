import React, { useState } from 'react';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { checkAdminOrInstitution } from 'components/services/brickService';
import { User } from 'model/user';
import { connect } from 'react-redux';
import { ReduxCombinedState } from 'redux/reducers';

import "./NameAndSubjectForm.scss";
import ShareTeacherDialog from './ShareTeacherDialog';

interface NameAndSubjectFormProps {
  classroom: any;
  onChange(name: string): void;
  user: User;
  addBrick(): void;
  inviteStudents(): void;
  onDelete(apiClass: any): void;
}

const NameAndSubjectForm: React.FC<NameAndSubjectFormProps> = props => {
  const { user } = props;
  const [edit, setEdit] = useState(false);
  const [isShareTeachOpen, setShareTeach] = useState(false);

  const [name, setName] = React.useState<string>();
  const [subjectIndex, setSubjectIndex] = React.useState<number>();

  const startEditing = React.useCallback(() => {
    setEdit(true);

    setName(props.classroom!.name);
    if (props.classroom.subject) {
      setSubjectIndex(user.subjects.findIndex(s => s.id === props.classroom.subject.id));
    }
  }, [props.classroom, user.subjects]);

  const submit = React.useCallback(() => {
    if (name) {
      props.onChange(name);
      setEdit(false);
    }
    /* eslint-disable-next-line */
  }, [name, subjectIndex, props]);

  return edit ?
    (
      <div className="name-subject-form">
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
        <div className="name-and-edit-btn">
          <h1 className="name-display" dangerouslySetInnerHTML={{__html: props.classroom!.name}} />
          {(checkAdminOrInstitution(user.roles) && props.classroom!.teachers) &&
            <span className="class-creator">Created by <span className="creator-name">{props.classroom!.teachers[0].firstName} {props.classroom!.teachers[0].lastName}</span></span>
          }
          <span className="edit-icon" onClick={startEditing}>
            <SpriteIcon
              name="edit-outline"
              className="w100 h100 active"
            />
            <div className="css-custom-tooltip bold">Edit Class Name or Subject</div>
          </span>
        </div>
        <div className="classroom-btns-container">
          <div className="assign-button-container bold">
            <div className="btn" onClick={props.inviteStudents}>
              Share & Invite Learners
              <SpriteIcon name="share" />
            </div>
          </div>
          <div className="assign-button-container bold">
            <div className="btn" onClick={props.addBrick}>
              Assign Brick
              <SpriteIcon name="lucide_book-open-plus" />
            </div>
          </div>
          <span className="edit-icon send-teacher" onClick={() => setShareTeach(true)}>
            <SpriteIcon name="joint-teacher" className="w100 h100 active" />
            <div className="css-custom-tooltip bold">Add joint teacher</div>
          </span>
          <span className="edit-icon delete-icon" onClick={() => props.onDelete(props.classroom)}>
            <SpriteIcon
              name="delete"
              className="w100 h100 active"
            />
            <div className="css-custom-tooltip bold">Delete Class</div>
          </span>
        </div>
        <ShareTeacherDialog isOpen={isShareTeachOpen} classId={props.classroom.id} close={() => setShareTeach(false)} />
      </div>
    );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
export default connect(mapState)(NameAndSubjectForm);
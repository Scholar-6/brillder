import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { ListItemIcon, ListItemText, MenuItem, Select, SvgIcon } from '@material-ui/core';
import { connect } from 'react-redux';

import { loadSubjects } from "components/services/subject";
import { Subject } from "model/brick";
import { updateUser } from "services/axios/user";
import { User } from "model/user";
import userActions from 'redux/actions/user';

import SpriteIcon from "components/baseComponents/SpriteIcon";
  
interface DialogProps {
  user: User;
  isOpen: boolean;
  close(): void;

  getUser(): Promise<void>;
}

interface DialogState {
  subjects: Subject[];
}

class AddSubjectDialog extends React.Component<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);
    this.state = { subjects: [] }
    this.getSubjects();
  }

  async getSubjects() {
    const subjects = await loadSubjects();
    if (subjects) {
      this.setState({ subjects });
    }
  }

  async updateUser(subjectId: number) {
    let userToSave = Object.assign({}, this.props.user) as any;
    userToSave.subjects = this.props.user.subjects.map(s => s.id);
    userToSave.subjects.push(subjectId);
    userToSave.roles = null;
    let res = await updateUser(userToSave);
    if (res) {
      await this.props.getUser();
      this.props.close();
    }
  }

  render() {
    return (
      <Dialog open={this.props.isOpen} onClose={this.props.close} className="dialog-box">
        <div className="dialog-header">
          <div className="bold" style={{ textAlign: 'center' }}>Only {this.props.user.subjects[0].name} is listed on your profile. Add another subject?</div>
          <Select
            className="select-profile-subject"
            MenuProps={{ style: { zIndex: 1000000, width: '100%' } } /* Dialog box is always z-index 999999 */}
            value={''}
            onChange={(evt) => this.updateUser(evt.target.value as number)}
          >
            {this.state.subjects?.map((s, i) => (
              <MenuItem value={s.id} key={i}>
                <ListItemIcon>
                  <SvgIcon>
                    <SpriteIcon
                      name="circle-filled"
                      className="w100 h100 active"
                      style={{ color: s.color }}
                    />
                  </SvgIcon>
                </ListItemIcon>
                <ListItemText>{s.name}</ListItemText>
              </MenuItem>
            ))}
          </Select>
        </div>
      </Dialog>
    );
  }
};

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

export default connect(null, mapDispatch)(AddSubjectDialog);

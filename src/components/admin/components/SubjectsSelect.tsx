import React from "react";
import { ListItemIcon, ListItemText, MenuItem, Select, SvgIcon } from '@material-ui/core';

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Subject } from "model/brick";

interface Props {
  subjectIds: number[];
  subjects: Subject[];
  selectedSubjects: Subject[];
  selectSubjects(subjectIds: number[], subjects: Subject[]): void;
}

const SubjectsSelect: React.FC<Props> = ({ subjectIds, selectedSubjects, subjects, selectSubjects }) => {
  return (
    <div>
      <div className="filter-header">Subjects</div>
      <div className="flex-center relative select-container">
        <div className="absolute-placeholder">{selectedSubjects.length === 0 && 'Find a subject'}</div>
        <Select
          className="select-multiple-subject"
          multiple
          MenuProps={{ classes: { paper: 'select-classes-list' } }}
          value={subjectIds}
          renderValue={() => {
            let text = "";
            for (let s of selectedSubjects) {
              text += ' ' + s.name;
            }
            return text;
          }}
          onChange={(e) => {
            const values = e.target.value as number[];
            let selectedSubjects: Subject[] = [];
            for (let id of values) {
              const subject = subjects.find(s => s.id === id);
              if (subject) {
                selectedSubjects.push(subject);
              }
            }
            console.log(values, selectedSubjects)
            selectSubjects(values, selectedSubjects);
          }}
        >
          {subjects.map((s: Subject, i) =>
            <MenuItem value={s.id} key={i}>
              <ListItemIcon>
                <SvgIcon>
                  <SpriteIcon
                    name="circle-filled"
                    className="w100 h100 active"
                    style={{ color: s?.color || '#4C608A' }}
                  />
                </SvgIcon>
              </ListItemIcon>
              <ListItemText>{s.name}</ListItemText>
            </MenuItem>
          )}
        </Select>
      </div>
    </div>
  )
}

export default SubjectsSelect;

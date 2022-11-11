import React from "react";
import { ListItemText, MenuItem, Select } from '@material-ui/core';

import { ESubjectCategory } from "../bricksPlayed/BricksPlayedSidebar";

interface CategoryItem {
  name: string;
  type: ESubjectCategory;
}

interface Props {
  subjectCategory: ESubjectCategory;
  selectCategory(sg: ESubjectCategory): void;
}

const CategorySelect: React.FC<Props> = (props) => {
  const [categories] = React.useState([{
    type: ESubjectCategory.Everything,
    name: 'All'
  }, {
    type: ESubjectCategory.Arts,
    name: 'Arts'
  }, {
    type: ESubjectCategory.General,
    name: 'General'
  }, {
    type: ESubjectCategory.Humanities,
    name: 'Humanities'
  }, {
    type: ESubjectCategory.Languages,
    name: 'Languages'
  }, {
    type: ESubjectCategory.Math,
    name: 'Maths'
  }, {
    type: ESubjectCategory.Science,
    name: 'Science'
  }] as CategoryItem[]);

  return (
    <div>
      <div className="filter-header">Category</div>
      <div className="flex-center relative select-container">
        <Select
          className="select-multiple-subject"
          MenuProps={{ classes: { paper: 'select-classes-list' } }}
          value={props.subjectCategory}
          onChange={(e) => {
            props.selectCategory(e.target.value as ESubjectCategory);
          }}
        >
          {categories.map((s: CategoryItem, i) =>
            <MenuItem value={s.type} key={i}>
              <ListItemText>{s.name}</ListItemText>
            </MenuItem>
          )}
        </Select>
      </div>
    </div>
  )
}

export default CategorySelect;

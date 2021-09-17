import React from "react";

import { Subject } from "model/brick";
import { SubjectAssignments } from "../service/model";
import LibrarySubject from "./LibrarySubject";
import { getSubjectWidth } from "../service/css";

interface LibrarySubjectsProps {
  pageSize: number;
  sortedIndex: number;
  subjects: Subject[];
  subjectAssignments: SubjectAssignments[];
  history: any;
}

const LibrarySubjects: React.FC<LibrarySubjectsProps> = (props) => {
  const renderSubject = (item: SubjectAssignments, key: number) => {
    const width = getSubjectWidth(item);
    return <div key={key} className="libary-container-1" style={{ width: width + 'vw', display: 'inline-flex' }}>
      <LibrarySubject subjectAssignment={item} history={props.history} />
    </div>
  }

  return (
    <div className="my-library-list">
      {props.subjectAssignments.map(renderSubject)}
    </div>
  );
}

export default LibrarySubjects;

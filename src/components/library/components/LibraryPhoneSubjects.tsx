import React from "react";

import { SubjectAssignments } from "../service/model";
import LibraryPhoneSubject from "./LibraryPhoneSubject";

interface LibrarySubjectsProps {
  userId: number;
  subjectAssignments: SubjectAssignments[];
  history: any;
}


const LibraryPhoneSubjects: React.FC<LibrarySubjectsProps> = (props) => {
  return (
    <div className="my-library-list">
      {props.subjectAssignments.map((item, i) =>
        <div key={i} className="libary-container-1">
          <div className="ml-subject">{item.subject.name}</div>
          <LibraryPhoneSubject userId={props.userId} subjectAssignment={item} history={props.history} />
        </div>
      )}
    </div>
  );
}

export default LibraryPhoneSubjects;

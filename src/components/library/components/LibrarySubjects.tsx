import React from "react";

import { Subject } from "model/brick";
import { SortBy, SubjectAssignments } from "../service/model";
import LibrarySubject from "./LibrarySubject";
import { getSubjectWidth } from "../service/css";
import { User } from "model/user";

interface LibrarySubjectsProps {
  sortBy: SortBy;
  pageSize: number;
  sortedIndex: number;
  subjects: Subject[];
  subjectAssignments: SubjectAssignments[];
  history: any;
  student: User | null;

  subjectTitleClick(s: Subject): void;
}

const LibrarySubjects: React.FC<LibrarySubjectsProps> = (props) => {
  const renderSubject = (item: SubjectAssignments, key: number) => {
    const width = getSubjectWidth(item);

    if (props.sortBy === SortBy.Score) {
      item.assignments = item.assignments.sort((a, b) => {
        if (a.bestAttemptPercentScore && b.bestAttemptPercentScore && a.bestAttemptPercentScore > b.bestAttemptPercentScore) {
          return -1;
        }
        return 1;
      });
    } else if (props.sortBy === SortBy.Date) {
      item.assignments = item.assignments.sort((a: any, b: any) => {
        if (new Date(a.lastAttemptDate).getTime() > new Date(b.lastAttemptDate).getTime()) {
          return -1;
        }
        return 1;
      });
    } else if (props.sortBy === SortBy.Level) {
      item.assignments = item.assignments.sort((a: any, b: any) => {
        if (a.brick.academicLevel < b.brick.academicLevel) {
          return -1;
        }
        return 1;
      });
    }

    return <div key={key} className="libary-container-1" style={{ width: width + 'vw', display: 'inline-flex' }}>
      <LibrarySubject subjectAssignment={item} history={props.history} student={props.student} subjectTitleClick={() => props.subjectTitleClick(item.subject)} />
    </div>
  }

  return (
    <div className="my-library-list">
      {props.subjectAssignments.map(renderSubject)}
    </div>
  );
}

export default LibrarySubjects;

import React, { useEffect } from "react";

import { Subject } from "model/brick";
import { SortBy, SubjectAssignments } from "../service/model";
import LibrarySubject from "./LibrarySubject";
import { getSubjectWidth } from "../service/css";
import { User } from "model/user";
import SpriteIcon from "components/baseComponents/SpriteIcon";

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
  const numRows = 3;
  const [page, setPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(0)

  useEffect(() => {
    let margin = 1;
    let rowWidth = 69.1;
    let rows = 1;
    let tempWidth = 0;
    for (let item of props.subjectAssignments) {
      const itemWidth = getSubjectWidth(item);
      item.width = itemWidth;
      item.row = rows;

      if (tempWidth == 0) {
        tempWidth += itemWidth + margin;
      } else if (tempWidth + itemWidth + margin > rowWidth) {
        rows += 1;
        item.row = rows;
        tempWidth = itemWidth + margin;
      } else {
        tempWidth += itemWidth + margin;
      }
      console.log('rows', rows, itemWidth, item.subject.name);
    }
    setLastPage(Math.ceil(rows / numRows));
    /*eslint-disable-next-line*/
  }, []);

  const renderSubject = (item: SubjectAssignments, key: number) => {
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

    if (item.row > (page - 1) * numRows && item.row <= page * numRows) {
      return <div key={key} className="libary-container-1" style={{ width: item.width + 'vw', display: 'inline-flex' }}>
        <LibrarySubject subjectAssignment={item} history={props.history} student={props.student} subjectTitleClick={() => props.subjectTitleClick(item.subject)} />
      </div>
    }
    return <div />;
  }

  const renderPagination = () => {
    if (lastPage > 1) {
      return (
        <div className="pagination">
          <div className="left-part">
            {page} <span className="gray">| {lastPage}</span>
          </div>
          <div className="center-part">
            {page > 1 && <SpriteIcon name="arrow-up" onClick={() => setPage(page - 1)} />}
            {lastPage > page && <SpriteIcon name="arrow-down" onClick={() => setPage(page + 1)} />}
          </div>
        </div>
      );
    }
    return '';
  }

  return (
    <div className="my-library-list">
      {props.subjectAssignments.map(renderSubject)}
      {renderPagination()}
    </div>
  );
}

export default LibrarySubjects;

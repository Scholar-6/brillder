import React from 'react';

import map from 'components/map';
import { TeachClassroom } from 'model/classroom';
import { isArchived } from "../service/service";

interface Props {
  isArchive: boolean;
  history: any;
  activeStudent: any;
  classrooms: TeachClassroom[];
  activeClassroom: TeachClassroom | null;
  setArchive(v: boolean): void;
}

const ArchiveToggle: React.FC<Props> = (props) => {
  const getLiveClassCount = (classroom: TeachClassroom) => {
    let count = 0;
    for (const assignment of classroom.assignments) {
      const archived = isArchived(assignment);
      if (!archived) {
        count += 1;
      }
    }
    return count;
  }

  const getArchiveClassCount = (classroom: TeachClassroom) => {
    let count = 0;
    for (const assignment of classroom.assignments) {
      const archived = isArchived(assignment);
      if (archived) {
        count += 1;
      }
    }
    return count;
  }

  const getLiveClassesCount = () => {
    let count = 0;
    for (const classroom of props.classrooms) {
      count += getLiveClassCount(classroom);
    }
    return count;
  }

  const getArchiveClassesCount = () => {
    let count = 0;
    for (const classroom of props.classrooms) {
      count += getArchiveClassCount(classroom);
    }
    return count;
  }

  const getLiveAssignmentsCount = () => {
    if (props.activeStudent) {
      return '';
    }
    if (props.activeClassroom) {
      return getLiveClassCount(props.activeClassroom);
    } else {
      return getLiveClassesCount();
    }
  }

  const getArchivedAssigmentsCount = () => {
    if (props.activeStudent) {
      return '';
    }
    if (props.activeClassroom) {
      return getArchiveClassCount(props.activeClassroom);
    } else {
      return getArchiveClassesCount();
    }
  }

  const renderLiveBricksButton = () => {
    const className = props.isArchive ? "" : "active";
    return (
      <div
        className={className}
        onClick={() => {
          props.history.push(map.TeachAssignedTab);
          props.setArchive(false);
        }}
      >
        {getLiveAssignmentsCount()} LIVE BRICKS
      </div>
    );
  }
  
  const renderArchiveButton = () => {
    const className = props.isArchive ? "archive-toggle-button active" : "archive-toggle-button";
    return (
      <div
        className={className}
        onClick={() => {
          props.history.push(map.TeachAssignedArchiveTab);
          props.setArchive(true);
        }}
      >
        {getArchivedAssigmentsCount()} ARCHIVED
      </div>
    );
  }

  return (
    <div className="classroom-list-buttons">
      {renderLiveBricksButton()}
      {renderArchiveButton()}
    </div>
  )
}

export default ArchiveToggle;

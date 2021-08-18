import React from 'react';

import map from 'components/map';
import { TeachClassroom } from 'model/classroom';

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
    return parseInt(classroom.assignmentsCount) - parseInt(classroom.archivedAssignmentsCount);
  }

  const getArchiveClassCount = (classroom: TeachClassroom) => {
    return parseInt(classroom.archivedAssignmentsCount);
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

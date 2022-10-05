import React from 'react';

import map from 'components/map';
import { TeachClassroom } from 'model/classroom';
import { getArchivedAssignedCount, getClassAssignedCount } from '../service/service';

interface Props {
  isArchive: boolean;
  history: any;
  activeStudent: any;
  activeClassroom: TeachClassroom | null;
  setArchive(v: boolean): void;
}

const ArchiveToggle: React.FC<Props> = (props) => {
  const getLiveClassCount = (classroom: TeachClassroom) => {
    return getClassAssignedCount(classroom) - getArchivedAssignedCount(classroom);
  }

  const getArchiveClassCount = (classroom: TeachClassroom) => {
    return getArchivedAssignedCount(classroom);
  }

  const getLiveAssignmentsCount = () => {
    if (props.activeStudent) {
      return '';
    }
    if (props.activeClassroom) {
      return getLiveClassCount(props.activeClassroom);
    }
  }

  const getArchivedAssigmentsCount = () => {
    if (props.activeStudent) {
      return '';
    }
    if (props.activeClassroom) {
      return getArchiveClassCount(props.activeClassroom);
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
        {getLiveAssignmentsCount()} ACTIVE
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
        {getArchivedAssigmentsCount()} PREVIOUS
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

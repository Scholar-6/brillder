import React, { useEffect, useState } from 'react';

import { getAdminBrickStatistic } from 'services/axios/brick';
import BrickPlayedPopup from 'components/admin/bricksPlayed/BrickPlayedPopup';
import { PDateFilter } from 'components/admin/adminOverview/OverviewSidebar';
import { Brick } from 'model/brick';
import { getSubjects } from 'services/axios/subject';

interface Props {
  brick: Brick;
  history: any;
}

const AdminBrickStatisticButton: React.FC<Props> = (props) => {
  const [data, setData] = useState({} as any);
  const [subjects, setSubjects] = useState([] as any[]);

  const getData = async (e: any, b: Brick) => {
    e.stopPropagation();
    const data = await getAdminBrickStatistic(b.id);
    if (data) {
      setData({ selectedBrick: b, brickAttempts: data.attempts, assignments: data.assignments })
    }
  }

  const loadSubjects = async () => {
    const subjects = await getSubjects();
    if (subjects) {
      setSubjects(subjects);
    }
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  return (
    <div style={{ "width": "80%" }}>
      <div
        className="assign-class-button bigger-button-v3 assign-intro-button" style={{ width: "100%" }}
        onClick={(e) => getData(e, props.brick)}
      >Data</div>
      {data.selectedBrick && <BrickPlayedPopup
        history={props.history}
        dateFilter={PDateFilter.AllTime}
        brick={data.selectedBrick}
        subjects={subjects}
        assignments={data.assignments}
        brickAttempts={data.brickAttempts}
        close={() => {
          setData({ selectedBrick: null });
        }}
      />}
    </div>
  );
}

export default AdminBrickStatisticButton;
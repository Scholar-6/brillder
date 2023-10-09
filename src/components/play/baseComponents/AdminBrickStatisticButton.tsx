import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";

import { getAdminBrickStatistic } from 'services/axios/brick';
import BrickPlayedPopup from 'components/admin/bricksPlayed/BrickPlayedPopup';
import { PDateFilter } from 'components/admin/adminOverview/OverviewSidebar';
import { Brick, Subject } from 'model/brick';
import subjectActions from "redux/actions/subject";
import { ReduxCombinedState } from "redux/reducers";

interface Props {
  brick: Brick;
  history: any;

  subjects: Subject[];
  getSubjects(): void;
}

const AdminBrickStatisticButton: React.FC<Props> = (props) => {
  const [data, setData] = useState({} as any);

  const getData = async (e: any, b: Brick) => {
    e.stopPropagation();
    const data = await getAdminBrickStatistic(b.id);
    if (data) {
      setData({ selectedBrick: b, brickAttempts: data.attempts, assignments: data.assignments })
    }
  }

  useEffect(() => {
    if (props.subjects.length === 0) {
      props.getSubjects();
    }
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
        subjects={props.subjects}
        assignments={data.assignments}
        brickAttempts={data.brickAttempts}
        close={() => {
          setData({ selectedBrick: null });
        }}
      />}
    </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  subjects: state.subjects.subjects,
});

const mapDispatch = (dispatch: any) => ({
  getSubjects: () => dispatch(subjectActions.fetchSubjects()),
});

export default connect(mapState, mapDispatch)(AdminBrickStatisticButton);

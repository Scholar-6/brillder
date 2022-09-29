import React from 'react';

import { Dialog } from '@material-ui/core';
import { getAdminBrickStatistic } from 'services/axios/brick';

interface Props {
  brickId: number;
}

const AdminBrickStatisticButton: React.FC<Props> = (props) => {
  const [isOpened, setOpen] = React.useState(false);
  const [data, setData] = React.useState({} as any);

  const getData = async () => {
    const data = await getAdminBrickStatistic(props.brickId);
    if (data) {
      setData(data);
    }
  }

  const renderScore = (attempt: any) => {
    if (typeof attempt.oldScore === undefined) {
      return Math.round((attempt.score * 50) / attempt.maxScore);
    } else {
      return Math.round(((attempt.oldScore + attempt.score) * 50) / attempt.maxScore);
    }
  }

  const renderAttempts = () => {
    if (data && data.attempts) {
      return data.attempts.map((attempt: any) => {
        return <tr key={attempt.id}>
          <td>{attempt.student.firstName} {attempt.student.lastName}</td>
          <td>{renderScore(attempt)}</td>
        </tr>
      });
    }
    return "";
  }

  const renderTeachers = () => {
    if (data && data.assignments) {
      return data.assignments.map((assignment: any) => {
        try {
          const teacher = assignment.classroom.teachers[0];
          return <span key={assignment.id}>
            {teacher.firstName} {teacher.lastName}
          </span>
        } catch {
          return "";
        }
      });
    }
    return "";
  }

  return (
    <div style={{"width": "80%"}}>
      <div className="assign-class-button bigger-button-v3 assign-intro-button" style={{width: "100%"}} onClick={() => {
        console.log('click')
        getData();
        setOpen(true);
      }}>Data</div>
      <Dialog open={isOpened} onClose={(e: any) => {
        console.log('close');
        console.log(e);
        e.stopPropagation();
        e.preventDefault();
        setOpen(false)
      }} className="dialog-box admin-data">
        <div className="dialog-header">
          <div>
            <div className="r-popup-title bold">Attempts</div>
            <table className="admin-attempts-table">
              <tr>
                <th>Name</th>
                <th>Score</th>
              </tr>
              {renderAttempts()}
            </table>
            <div className="r-popup-title bold">Teachers</div>
            {renderTeachers()}
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default AdminBrickStatisticButton;
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

  const renderAttempts = () => {
    if (data && data.attempts) {
      return data.attempts.map((attempt: any) => {
        return <tr key={attempt.id}><td>{attempt.student.firstName} {attempt.student.lastName}</td><td>{(attempt.oldScore + attempt.score) / attempt.maxScore}</td></tr>
      });
    }
    return "";
  }

  return (
    <div className="assign-class-button bigger-button-v3 assign-intro-button" onClick={() => {
      getData();
      setOpen(true);
    }}>Data
      <Dialog open={isOpened} onClose={() => setOpen(false)} className="dialog-box light-blue assign-dialog assign-dialog-new">
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
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default AdminBrickStatisticButton;
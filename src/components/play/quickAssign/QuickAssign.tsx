import React, { useEffect } from 'react';
import { getClassroomByCode } from 'services/axios/classroom';
import routes from '../routes';
import { Brick } from 'model/brick';

interface AssignPersonOrClassProps {
  history: any;
  location: any;
  match: any;
}

const QuickAssignPage: React.FC<AssignPersonOrClassProps> = (props) => {
  const code = props.match.params.code as string;

  
  useEffect(() => {
    getClassroomByCode(code).then((res) => {
      console.log('ddd', res);
      props.history.push(routes.playCover({id: res.brickId} as Brick));
    });
  }, []);
  return <div>Getting data</div>;
}

export default QuickAssignPage;

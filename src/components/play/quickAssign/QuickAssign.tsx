import React, { useEffect } from 'react';
import { getClassroomByCode } from 'services/axios/classroom';
import routes from '../routes';
import { Brick } from 'model/brick';
import { SetQuickAssignment } from 'localStorage/play';

interface AssignPersonOrClassProps {
  history: any;
  location: any;
  match: any;
}

const QuickAssignPage: React.FC<AssignPersonOrClassProps> = (props) => {
  const code = props.match.params.code as string;
  
  useEffect(() => {

    getClassroomByCode(code).then((res) => {
      if (res.brick) {
        const {brick} = res;
        SetQuickAssignment(JSON.stringify({
          brick: {
            id: brick.id,
            title: brick.title
          },
          classroom: {
            id: res.class.id,
            code,
            teacher: res.class.teacher
          }
        }));
  
        props.history.push(routes.playCover(res.brick as Brick));
      }
    });
  }, []);
  
  return <div>Getting data</div>;
}

export default QuickAssignPage;

import React, { useEffect } from 'react';

import "./QuickAssign.scss";
import { getClassroomByCode } from 'services/axios/classroom';
import routes from '../routes';
import { Brick } from 'model/brick';
import { SetQuickAssignment } from 'localStorage/play';
import HomeButtonComponent from 'components/baseComponents/homeButton/HomeButton';

interface AssignPersonOrClassProps {
  history: any;
  location: any;
  match: any;
}

const QuickAssignPage: React.FC<AssignPersonOrClassProps> = (props) => {
  const code = props.match.params.code as string;
  const [failed, setFailed] = React.useState(false);
  const [classroom, setClassroom] = React.useState(null as any);
  const [assignments, setAssignments] = React.useState([] as any[]);

  useEffect(() => {
    getClassroomByCode(code).then((res) => {
      if (res.many) {
        console.log(res);
        setAssignments(res.assignments);
        setClassroom(res.class);
      } else if (res.brick) {
        const { brick } = res;
        SetQuickAssignment(JSON.stringify({
          brick: {
            id: brick.id,
            title: brick.title
          },
          classroom: {
            id: res.class.id,
            code,
            name: res.class.name,
            teacher: res.class.teacher
          }
        }));
        props.history.push(routes.playCover(res.brick as Brick));
      } else {
        setFailed(true);
      }
    });
  }, []);

  if (failed) {
    return (
      <div className="QuickAssignPage">
        <div>
          <HomeButtonComponent history={props.history} />
          <div className="sidebar"></div>
        </div>
        <div className="page-content">
          Class don`t have assignments yet
        </div>
      </div>
    );
  }

  if (classroom && assignments && assignments.length > 0) {
    return (
      <div className="QuickAssignPage">
        <div>
          <HomeButtonComponent history={props.history} />
          <div className="sidebar"></div>
        </div>
        <div className="page-content">
          <div className="classroom-name" dangerouslySetInnerHTML={{ __html: classroom.name }} />
          <div className="bricks-list">
            {assignments.map((a, i) => {
              return (
                <div className="animated-brick-container">
                  <div className="flex-brick-container">
                    <div className="publish-brick-container">
                      <div className="level-and-length">
                        <div className="level before-alternative">
                          <div style={{ background: "rgb(101, 196, 76);" }}>
                            <div className="level">
                              <div style={{ background: "rgb(0, 107, 253);" }}>I</div>
                            </div>
                          </div>
                        </div>
                        <div className="length-text-r3">20 min</div>
                      </div>
                      <div className="p-cover-icon">
                        <svg className="svg ">
                          <use href="/static/media/icons-sprite.7e9f4bdc6b19212c8882b7c96f3168d9.svg#image"></use>
                        </svg>
                      </div>
                      <div className="bottom-description-color"></div>
                      <div className="bottom-description">
                        <span className="bold brick-title" dangerouslySetInnerHTML={{ __html: a.brick.title }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="QuickAssignPage">
      <div>
        <HomeButtonComponent history={props.history} />
        <div className="sidebar"></div>
      </div>
      <div className="page-content">
        Class don`t have assignments yet
      </div>
    </div>
  );
}

export default QuickAssignPage;

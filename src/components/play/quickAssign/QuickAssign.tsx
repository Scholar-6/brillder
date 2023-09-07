import React, { useEffect } from 'react';

import "./QuickAssign.scss";
import { getClassroomByCode } from 'services/axios/classroom';
import routes from '../routes';
import { AcademicLevelLabels, Brick } from 'model/brick';
import { SetQuickAssignment } from 'localStorage/play';
import HomeButtonComponent from 'components/baseComponents/homeButton/HomeButton';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { fileUrl } from 'components/services/uploadFile';

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
  const [imgLoaded, setImgLoaded] = React.useState(false);

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
          <div className="classroom-name bold" dangerouslySetInnerHTML={{ __html: classroom.name }} />
          <div className="bricks-list">
            {assignments.map((a, i) => {
              const { brick } = a;

              var alternateColor = "";
              let color = "";
              if (!brick.subject) {
                color = "#B0B0AD";
              } else {
                color = brick.subject.color;
              }

              if (brick.alternateSubject) {
                alternateColor = brick.alternateSubject.color;
              }

              const renderLevelCircles = () => {
                if (alternateColor) {
                  return (
                    <div className="level before-alternative">
                      <div style={{ background: alternateColor }}>
                        <div className="level">
                          <div style={{ background: color }}>
                            {AcademicLevelLabels[brick.academicLevel]}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="level only-one-circle">
                    <div style={{ background: color }}>
                      {AcademicLevelLabels[brick.academicLevel]}
                    </div>
                  </div>
                );
              }

              return (
                <div className="animated-brick-container" onClick={() => {
                  SetQuickAssignment(JSON.stringify({
                    brick: {
                      id: brick.id,
                      title: brick.title
                    },
                    classroom: {
                      id: classroom.id,
                      code,
                      name: classroom.name,
                      teacher: classroom.teacher
                    }
                  }));
                  props.history.push(routes.playCover(brick as Brick));
                }}>
                  <div className="flex-brick-container">
                    <div className="publish-brick-container">
                      <div className="level-and-length">
                        {renderLevelCircles()}
                        <div className="length-text-r3">{brick.brickLength} min</div>
                      </div>
                      {brick.coverImage ?
                        <div className="p-cover-image">
                          <div className="scroll-block">
                            <img alt="" className={imgLoaded ? 'visible' : 'hidden'} onLoad={() => setImgLoaded(true)} src={fileUrl(brick.coverImage)} />
                          </div>
                        </div>
                        :
                        <div className="p-cover-icon">
                          <SpriteIcon name="image" />
                        </div>
                      }
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

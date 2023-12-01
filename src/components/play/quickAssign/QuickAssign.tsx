import React, { useEffect } from 'react';

import { getClassroomByCode } from 'services/axios/classroom';
import routes from '../routes';
import { AcademicLevelLabels, Brick } from 'model/brick';
import { SetQuickAssignment } from 'localStorage/play';
import HomeButtonComponent from 'components/baseComponents/homeButton/HomeButton';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { fileUrl } from 'components/services/uploadFile';
import { isPhone } from 'services/phone';
import { minimizeZendeskButton } from 'services/zendesk';

const MobileTheme = React.lazy(() => import('./themes/QuickAssignMobileTheme'));
const DesktopTheme = React.lazy(() => import('./themes/QuickAssignDesktopTheme'));

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
        let assignments = res.assignments;
        if (assignments[0].order > 0) {
          assignments = res.assignments.sort((a:any, b:any) => a.order - b.order);
        }
        setAssignments(assignments);
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
    minimizeZendeskButton();
  }, []);

  const renderAssignments = () => {
    return (
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
            <div className="animated-brick-container" key={i} onClick={() => {
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
                      <div className="scroll-block" style={{backgroundImage: `url(${fileUrl(brick.coverImage)})`}} />
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
    );
  }

  if (isPhone()) {
    const renderMobileContent = () => {
      if (failed) {
      }

      if (classroom && assignments && assignments.length > 0) {
        return (
          <div className="page-content">
            <div className="top-header flex-center">
              <div>
                <span className="bold" dangerouslySetInnerHTML={{ __html: classroom.name }} /> by <span className="bold">{classroom.teacher.firstName}</span>
              </div>
            </div>
            {renderAssignments()}
          </div>
        );
      }

      return (
        <div className="page-content">
          <div className="top-header"></div>
          Class don`t have assignments yet
        </div>
      );
    }

    return (
      <React.Suspense fallback={<></>}>
        <MobileTheme />

        <div className="QuickAssignPage">
          {renderMobileContent()}
          <div className="page-header">
            <div className="flex-center home-btn">
              <SpriteIcon name="logo" className="svg text-theme-orange" />
            </div>
            <div className="flex-center search-btn-container">
              <div className="search-btn">
                <SpriteIcon name="search" />
                <div className="gh-phone-background"></div>
              </div>
            </div>
          </div>
        </div>
      </React.Suspense>
    );
  }


  const renderContent = () => {
    if (failed) {
      return (
        <div className="page-content">
          Class don`t have assignments yet
        </div>
      );
    }

    if (classroom && assignments && assignments.length > 0) {
      return (
        <div className="page-content">
          <div className="classroom-name" >
            <span className="bold" dangerouslySetInnerHTML={{ __html: classroom.name }} /> by <span className="bold">{classroom.teacher.firstName} {classroom.teacher.lastName}</span>
          </div>
          {renderAssignments()}
        </div>
      )
    }

    return (
      <div className="page-content">
        <div className="classroom-name">
          ...Loading data...
        </div>
      </div>
    );
  }

  return (
    <React.Suspense fallback={<></>}>
      <DesktopTheme />
      <div className="QuickAssignPage">
        <div>
          <HomeButtonComponent history={props.history} />
          <div className="sidebar"></div>
        </div>
        {renderContent()}
      </div>
    </React.Suspense>
  );
}

export default QuickAssignPage;

import { checkAdmin, checkTeacher } from 'components/services/brickService';
import { User } from 'model/user';
import React, { Component } from 'react';
import { isIPad13, isMobile, isTablet } from 'react-device-detect';
interface Props {
  user: User;
}

const MobileTheme = React.lazy(() => import('./themes/FixedHelpersMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/FixedHelpersTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/FixedHelpersDesktopTheme'));

class FixedHelpers extends Component<Props> {
  renderBorder(className: string) {
    return <img alt="circle-border" className={className + " dashed-circle"} src="/images/borders/small-dash-circle.svg" />;
  }

  render() {
    const { user } = this.props;
    if (!user) { return <div /> }

    const canSee = checkTeacher(user) || checkAdmin(user.roles);

    return (
      <React.Suspense fallback={<></>}>
        {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
        <div className="fixed-helpers-container">
          <div className="circles">
            <div className="highlight">
              {this.renderBorder('highlight-circle')}
              <span>Highlight Text</span>
            </div>
            <div className="share">
              {this.renderBorder('share-circle')}
              <span>Share Brick</span>
            </div>
            {canSee && 
              <>
              <div className="assign">
                {this.renderBorder('assign-circle')}
                <span>Assign Brick</span>
              </div>
              <div className="adapt">
                {this.renderBorder('adapt-circle')}
                <span>Adapt Brick</span>
              </div>
              </>
            }
          </div>
        </div>
      </React.Suspense>
    );
  }
}

export default FixedHelpers;

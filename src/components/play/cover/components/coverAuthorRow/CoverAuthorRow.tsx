import { Brick } from "model/brick";
import React from "react";
import { isMobile } from "react-device-detect";
import { isPhone } from "services/phone";

interface Props {
  brick: Brick;
  setBio(v: boolean): void;
}

const MobileTheme = React.lazy(() => import("./themes/CoverMobileTheme"));
const TabletTheme = React.lazy(() => import("./themes/CoverTabletTheme"));
const DesktopTheme = React.lazy(() => import("./themes/CoverDesktopTheme"));

const CoverAuthorRow: React.FC<Props> = ({ brick, setBio }) => {
  return (
    <React.Suspense fallback={<></>}>
      {isPhone() ? (
        <MobileTheme />
      ) : isMobile ? (
        <TabletTheme />
      ) : (
        <DesktopTheme />
      )}
      <div className="author-row cover-author-row">
        <span>
          {brick.author.firstName} {brick.author.lastName}
        </span>
        <div className="cover-bio" onClick={() => setBio(true)}>
          <div className="cover-bio-content">Author Profile</div>
          <div className="cover-bio-background" />
        </div>
      </div>
    </React.Suspense>
  );
};

export default CoverAuthorRow;

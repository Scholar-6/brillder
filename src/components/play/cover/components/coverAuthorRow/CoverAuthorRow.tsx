import { Brick } from "model/brick";
import React from "react";
import { isMobile } from "react-device-detect";
import { isPhone } from "services/phone";

interface Props {
  brick: Brick;
  setBio(v: boolean): void;
  setEditorBio(v: boolean): void;
}

const MobileTheme = React.lazy(() => import("./themes/CoverMobileTheme"));
const TabletTheme = React.lazy(() => import("./themes/CoverTabletTheme"));
const DesktopTheme = React.lazy(() => import("./themes/CoverDesktopTheme"));

const CoverAuthorRow: React.FC<Props> = ({ brick, setBio, setEditorBio }) => {
  const renderEditor = () => {
    if (brick.editors && brick.editors.length > 0) {
      return <span><span>, </span><span className="pointer bold-on-hover" onClick={() => setEditorBio(true)}>{brick.editors[0].firstName} {brick.editors[0].lastName} (Editor)</span></span>
    }
    return '';
  }
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
          <span onClick={() => setBio(true)} className="pointer bold-on-hover">{brick.author.firstName} {brick.author.lastName}</span>{renderEditor()}
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

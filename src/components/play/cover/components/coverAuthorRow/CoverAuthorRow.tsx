import React from "react";
import { isMobile } from "react-device-detect";

import CoverBioDialog from "components/baseComponents/dialogs/CoverBioDialog";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Brick, Editor } from "model/brick";
import { User } from "model/user";
import { isPhone } from "services/phone";

interface PopupBio {
  isOpen: boolean;
  user?: User | Editor | null;
}
interface Props {
  brick: Brick;
}

const MobileTheme = React.lazy(() => import("./themes/CoverMobileTheme"));
const TabletTheme = React.lazy(() => import("./themes/CoverTabletTheme"));
const DesktopTheme = React.lazy(() => import("./themes/CoverDesktopTheme"));

const CoverAuthorRow: React.FC<Props> = ({ brick }) => {
  const [bio, setBio] = React.useState({
    isOpen: false,
    user: null
  } as PopupBio);

  const renderEditor = () => {
    if (brick.editors && brick.editors[0]) {
      const editor = brick.editors[0];
      return <div><div>, </div><div className="pointer bold-on-hover" onClick={() => setBio({ isOpen: true, user: editor })}>
        <SpriteIcon name="feather-edit-3" />
        {editor.firstName} {editor.lastName} (Editor)</div>
      </div>
    }
    return '';
  }

  const renderAuthor = (author: any, icon: string) => {
    return (
      <div onClick={() => setBio({ isOpen: true, user: author })} className="pointer bold-on-hover">
        <SpriteIcon name={icon} />
        <div>
          {author.firstName} {author.lastName}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (brick.adaptedFrom && brick.adaptedFrom.author) {
      return (
        <div className="absolute-text">
          {renderAuthor(brick.adaptedFrom.author, "feather-feather")}
          {renderEditor()}<span className="text-transform-none">, adapted by</span>
          {renderAuthor(brick.author, "copy-sw2")}
        </div>
      );
    }
    return (
      <div className="absolute-text">
        {renderAuthor(brick.author, "feather-feather")}
        {renderEditor()}
      </div>
    );
  }

  return (
    <React.Suspense fallback={<></>}>
      {isPhone() ? <MobileTheme /> : isMobile ? <TabletTheme /> : <DesktopTheme />}
      <div className="author-row cover-author-row">
        <div className="relative">
          <span>
            {renderContent()}
          </span>
        </div>
      </div>
      {bio.isOpen && bio.user &&
        <CoverBioDialog isOpen={bio.isOpen} user={bio.user} close={() => setBio({ isOpen: false, user: null })} />
      }
    </React.Suspense>
  );
};

export default CoverAuthorRow;

import React, { useState } from 'react';
import axios from "axios";

import './ShareDialog.scss';
import { Brick } from 'model/brick';
import { User } from 'model/user';

import ShareDialog from './ShareDialog';
import LinkDialog from './LinkDialog';
import LinkCopiedDialog from './LinkCopiedDialog';
import InviteDialog from './InviteDialog';
import InvitationSuccessDialog from './InvitationSuccessDialog';
import routes from 'components/play/routes';

interface ShareProps {
  shareOpen: boolean;
  user: User;
  brick: Brick;
  close(): void;
}

interface InviteResult {
  isOpen: boolean;
  accessGranted: boolean;
  name: string;
}

const ShareDialogs: React.FC<ShareProps> = props => {
  const [loaded, setLoaded] = useState(false);
  const [linkOpen, setLink] = useState(false);
  const [linkCopiedOpen, setCopiedLink] = useState(false);
  const [inviteOpen, setInvite] = useState(false);
  const [inviteResult, setInviteResult] = useState({
    isOpen: false,
    accessGranted: false,
    name: ''
  } as InviteResult);

  const [referralId, setReferralId] = useState("");
  React.useEffect(() => {
    (async () => {
      try {
        if (props.shareOpen && !referralId) {
          const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/user/current/referral`, { withCredentials: true });
          setReferralId(data.referralId);
          setLoaded(true);
        }
      } catch(e) {
        setLoaded(true);
      }
    })();
  }, [props.user, props.shareOpen])

  let link = routes.playCover(props.brick); + `?referralId=${referralId}`;
  if (props.user && props.user.library) {
    link += '?origin=library';
  } else {
    link += `?referralId=${referralId}`;
  }

  let isAuthor = false;
  try {
    isAuthor = props.brick.author.id === props.user.id;
  } catch { }

  return (
    <div>
      <ShareDialog
        isOpen={props.shareOpen && loaded}
        realLink={link}
        link={() => setLink(true)}
        invite={() => setInvite(true)}
        close={props.close}
      />
      <LinkDialog
        isOpen={linkOpen} link={document.location.host + link}
        submit={() => setCopiedLink(true)} close={() => setLink(false)}
      />
      <LinkCopiedDialog isOpen={linkCopiedOpen} close={() => setCopiedLink(false)} />
      <InviteDialog
        canEdit={true} brick={props.brick} isOpen={inviteOpen} hideAccess={true} isAuthor={isAuthor}
        submit={name => {
          setInviteResult({ isOpen: true, name, accessGranted: false } as InviteResult);
        }}
        close={() => setInvite(false)}
      />
      <InvitationSuccessDialog
        isAuthor={isAuthor}
        isOpen={inviteResult.isOpen} name={inviteResult.name} accessGranted={inviteResult.accessGranted}
        close={() => setInviteResult({ isOpen: false, name: '', accessGranted: false } as InviteResult)}
      />
    </div>
  );
}

export default ShareDialogs;

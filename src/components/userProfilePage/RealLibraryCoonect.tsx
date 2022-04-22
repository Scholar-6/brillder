import React, { useEffect, useState } from "react";
import { ListItemText, MenuItem, Select } from '@material-ui/core';

import ProfileInput from "./components/ProfileInput";
import { claimLibraryAccount, getRealLibraries, RealLibrary, unclaimLibraryAccount } from "services/axios/realLibrary";
import LibraryFailedDialog from "components/baseComponents/dialogs/LibraryFailedDialog";
import LibrarySuccessDialog from "components/baseComponents/dialogs/LibrarySuccessDialog";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { User } from "model/user";



interface Props {
  user: User;
  reloadLibrary(): void;
}

const RealLibraryConnect: React.FC<Props> = ({ user, reloadLibrary }) => {
  const [libraryCardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [libraryId, setLibrary] = useState(null as null | number);
  const [libraries, setLibraries] = useState([] as RealLibrary[]);
  const [linked, setLinked] = useState(null as null | boolean); // false - unlinked, true - linked, null - loading
  //const [suggestedName, setSuggestedName] = useState('');

  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  const loadLibraries = async () => {
    const libraries = await getRealLibraries();
    if (libraries !== null) {
      libraries.push({ id: -2, name: 'Other' });
      setLibraries(libraries);
    }
  }

  useEffect(() => {
    loadLibraries();
    if (user.library && user.libraryCardNumber) {
      setLinked(true);
      setLibrary(user.library.id);
      setCardNumber(user.libraryCardNumber);
    } else {
      setLinked(false);
    }
  }, []);

  const submit = async () => {
    if (libraryId) {
      const success = await claimLibraryAccount(libraryId, libraryCardNumber, pin);
      if (success) {
        setSuccess(true);
        reloadLibrary();
        setLinked(true);
      } else {
        setFailed(true);
      }
    } else {
      setFailed(true);
    }
  }

  const unlink = async () => {
    if (libraryId) {
      const success = await unclaimLibraryAccount(libraryId);
      if (success) {
        console.log('unlinked successfully');
        reloadLibrary();
        setLinked(false);
      }
    }
  }

  const sendSuggestion = () => {
    const el = document.createElement('a');
    el.setAttribute('href', 'mailto: ivanadmin@gmail.com"');
  }

  if (libraryId === -2) {
    return (
      <div className="customer-real-library">
        <div className="sub-title-d43"> Get a premium account for free through your UK library</div>
        <div className="flex-center">
          <div>
            <Select
              className="select-existed-class"
              placeholder="Library Name"
              value={libraryId}
              onChange={e => setLibrary(e.target.value as any)}
              MenuProps={{ classes: { paper: 'select-classes-list' } }}
            >
              {libraries.map((s, i) => (
                <MenuItem value={s.id} key={i}>
                  <ListItemText>{s.name}</ListItemText>
                </MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <ProfileInput value={libraryCardNumber} validationRequired={false} className="" type="text" onChange={e => setCardNumber(e.target.value)} placeholder="Library Card Number" />
          </div>
          <div className="flex-center">
            <div className="btn custom-d42" onClick={() => sendSuggestion()}>Send</div>
          </div>
        </div>
      </div>
    );
  }

  const renderLinkButton = () => {
    if (linked) {
      return (
        <div className="btn" onClick={unlink}>
          <SpriteIcon name="link" />
          <div>Unlink Library</div>
        </div>
      );
    }
    return (
      <div className="btn" onClick={submit}>
        <SpriteIcon name="link" />
        <div>Link to Library</div>
      </div>
    );
  }

  return (
    <div className="customer-real-library">
      <div className="sub-title-d43"> Get a premium account for free through your UK library</div>
      <div className="flex-center">
        <div className="relative">
          {(libraryId === -1 || libraryId === null) && <div className="absolute-placeholder unselectable" onClick={e => e.preventDefault()}>Library Authority</div>}
          <Select
            className="select-existed-class"
            value={libraryId}
            disabled={!!linked}
            onChange={e => setLibrary(e.target.value as any)}
            MenuProps={{ classes: { paper: 'select-classes-list' } }}
          >
            {libraries.map((s, i) => (
              <MenuItem value={s.id} key={i}>
                <ListItemText>{s.name}</ListItemText>
              </MenuItem>
            ))}
          </Select>
        </div>
        <div>
          <ProfileInput value={libraryCardNumber} disabled={!!linked} validationRequired={false} className="" type="text" onChange={e => setCardNumber(e.target.value)} placeholder="Library Card Number" />
        </div>
        <div>
          <ProfileInput value={pin} disabled={!!linked} validationRequired={false} className="" type="password" onChange={e => setPin(e.target.value)} placeholder="Library Pin" />
        </div>
      </div>
      <div className="flex-center btn-container">
        {renderLinkButton()}
      </div>
      <LibraryFailedDialog isOpen={failed} close={() => setFailed(false)} />
      <LibrarySuccessDialog isOpen={success} close={() => setSuccess(false)} />
    </div>
  )
}

export default RealLibraryConnect;

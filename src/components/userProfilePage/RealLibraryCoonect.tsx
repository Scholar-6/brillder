import React, { useEffect, useState } from "react";
import { ListItemText, MenuItem, Select } from '@material-ui/core';

import ProfileInput from "./components/ProfileInput";
import { claimLibraryAccount, getRealLibraries, RealLibrary, unclaimLibraryAccount } from "services/axios/realLibrary";
import LibraryFailedDialog from "components/baseComponents/dialogs/LibraryFailedDialog";
import LibrarySuccessDialog from "components/baseComponents/dialogs/LibrarySuccessDialog";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { User } from "model/user";
import { createTicket } from "services/axios/zendesk";
import LibrarySuggestSuccessDialog from "components/baseComponents/dialogs/LibrarySuggestSuccessDialog";
import LibraryUnlinkDialog from "components/baseComponents/dialogs/LibraryUnlinkDialog";


interface Props {
  user: User;
  reloadLibrary(): void;
  successPopupClosed?(): void;
  suggestionSubmitted?(): void;
  linkedSuccess?(): void;
}

const RealLibraryConnect: React.FC<Props> = ({ user, reloadLibrary, successPopupClosed, suggestionSubmitted, linkedSuccess }) => {
  const [unlinking, setUnlinking] = useState(false);
  const [libraryCardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [libraryId, setLibrary] = useState(null as null | number);
  const [libraries, setLibraries] = useState([] as RealLibrary[]);
  const [linked, setLinked] = useState(null as null | boolean); // false - unlinked, true - linked, null - loading
  const [suggestedName, setSuggestedName] = useState('');

  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  const [suggestionSuccess, setSuggestionSuccess] = useState(false);
  const [suggestionFailed, setSuggestionFailed] = useState(false);

  const loadLibraries = async () => {
    const libraries = await getRealLibraries();
    if (libraries !== null) {
      libraries.push({ id: -2, name: 'Other' });
      setLibraries(libraries);
    }
  }

  const createNewTicket = async (librarySuggestion: string) => {
    await createTicket(user, librarySuggestion);
    setSuggestedName('');
    setSuggestionSuccess(true);
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
    /*eslint-disable-next-line*/
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
        reloadLibrary();
        setLinked(false);
      }

      setLibrary(null);
      setPin('');
      setCardNumber('');

      setUnlinking(false);
    }
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
            <ProfileInput
              value={suggestedName}
              validationRequired={false}
              className="" type="text" onChange={e => setSuggestedName(e.target.value)}
              placeholder="Suggest a library"
            />
          </div>
          <div className="flex-center">
            <div className="btn custom-d42" onClick={() => createNewTicket(suggestedName)}>
              <div>Send us your suggestion</div>
              <SpriteIcon name="send" />
            </div>
          </div>
        </div>
        <LibraryFailedDialog isOpen={suggestionFailed} close={() => setSuggestionFailed(false)} />
        <LibrarySuggestSuccessDialog isOpen={suggestionSuccess} close={() => setSuggestionSuccess(false)} submit={() => suggestionSubmitted?.()} />
      </div>
    );
  }

  const renderLinkButton = () => {
    if (linked) {
      return (
        <div className="btn linked" onClick={() => setUnlinking(true)}>
          <SpriteIcon name="x-square-feather" />
          <div>Unlink library account</div>
        </div>
      );
    }

    let isValid = true;
    if (libraryId === -1) {
      isValid = false;
    }
    if (libraryCardNumber === '') {
      isValid = false;
    }

    if (pin === '') {
      isValid = false;
    }

    return (
      <div className={`btn ${isValid ? '' : 'invalid'}`} onClick={submit}>
        <SpriteIcon name="link" />
        <div>Link My Library</div>
      </div>
    );
  }

  return (
    <div className="customer-real-library">
      <div className="sub-title-d43">
        Get a free premium account through a participating UK library
      </div>
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
          <ProfileInput autoCompleteOff={true} value={libraryCardNumber} disabled={!!linked} validationRequired={false} className="" type="text" onChange={e => setCardNumber(e.target.value)} placeholder="Library Card Barcode" />
        </div>
        <div>
          <ProfileInput autoCompleteOff={true} value={pin} disabled={!!linked} validationRequired={false} className={pin.length > 0 ? "replace-text-with-dots" : ""} type="text" onChange={e => setPin(e.target.value)} placeholder="Pin" />
        </div>
      </div>
      <div className="flex-center btn-container">
        {renderLinkButton()}
      </div>
      <LibraryFailedDialog isOpen={failed} close={() => setFailed(false)} />
      <LibrarySuccessDialog isOpen={success}
        close={() => {
          setSuccess(false);
          successPopupClosed?.();
        }}
        submit={() => {
          linkedSuccess?.();
          setSuccess(false);
        }}
      />
      <LibraryUnlinkDialog isOpen={unlinking} close={() => setUnlinking(false)} submit={unlink} />
    </div>
  )
}

export default RealLibraryConnect;

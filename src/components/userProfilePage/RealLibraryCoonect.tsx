import React, { useEffect } from "react";
import { ListItemText, MenuItem, Select } from '@material-ui/core';

import ProfileInput from "./components/ProfileInput";
import { claimLibraryAccount, getRealLibraries, RealLibrary } from "services/axios/realLibrary";



interface Props {
}

const RealLibraryConnect: React.FC<Props> = () => {
  const [libraryCardNumber, setCardNumber] = React.useState('');
  const [pin, setPin] = React.useState('');
  const [libraryId, setLibrary] = React.useState(null as null | number);
  const [libraries, setLibraries] = React.useState([] as RealLibrary[]);

  const loadLibraries = async () => {
    const libraries = await getRealLibraries();
    if (libraries) {
      setLibraries(libraries);
    }
  }

  useEffect(() => {
    loadLibraries();
  }, []);

  const submit = async () => {
    if (libraryId) {
      const res = await claimLibraryAccount(libraryId, libraryCardNumber, pin);
    }
  }

  return (
    <div className="customer-real-library">
      <div className="sub-title-d43"> Get a free account if you have a UK Library Card</div>
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
        <div>
          <ProfileInput value={pin} validationRequired={false} className="" type="password" onChange={e => setPin(e.target.value)} placeholder="Pin" />
        </div>
      </div>
      <div className="flex-center">
        <div className="btn" onClick={() => submit()}>Claim Account</div>
      </div>
    </div>
  )
}

export default RealLibraryConnect;

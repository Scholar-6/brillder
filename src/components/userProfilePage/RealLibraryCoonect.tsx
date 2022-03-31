import React, { useEffect } from "react";
import { ListItemText, MenuItem, Select } from '@material-ui/core';

import ProfileInput from "./components/ProfileInput";
import { getRealLibraries } from "services/axios/realLibrary";


interface Props {
}

const RealLibraryConnect: React.FC<Props> = () => {
  const [libraryCardNumber, setCardNumber] = React.useState('');
  const [pin, setPin] = React.useState('');
  const [library, setLibrary] = React.useState(null);
  const [libraries, setLibraries] = React.useState([] as any[]);

  const loadLibraries = async () => {
    const libraries = await getRealLibraries();
    console.log(libraries);
    setLibraries(libraries);
  }

  useEffect(() => {
    loadLibraries();
  }, []);

  return (
    <div className="customer-real-library">
      <div className="sub-title-d43"> Get a free account if you have a UK Library Card</div>
      <div className="flex-center">
        <div>
          <Select
            className="select-existed-class"
            placeholder="Library Name"
            value={library}
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
        <div className="btn">Claim Account</div>
      </div>
    </div>
  )
}

export default RealLibraryConnect;

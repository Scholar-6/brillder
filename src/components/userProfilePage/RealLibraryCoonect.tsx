import React from "react";
import { ListItemText, MenuItem, Select } from '@material-ui/core';

import ProfileInput from "./components/ProfileInput";


interface Props {
}

const RealLibraryConnect: React.FC<Props> = () => {
  const [libraryCardNumber, setCardNumber] = React.useState('');
  const [pin, setPin] = React.useState('');
  const [library, setLibrary] = React.useState(null);

  return (
    <div className="customer-real-library">
      <div className="sub-title-d43"> Get a free account if you have a UK Library Card</div>
      <div className="flex-center">
        <div>
          <Select
            className="select-existed-class"
            placeholder="Library Name"
            value={library}
            onChange={() => setLibrary(library)}
            MenuProps={{ classes: { paper: 'select-classes-list' } }}
          >
            <MenuItem>
              <ListItemText>Library Name</ListItemText>
            </MenuItem>
          </Select>
        </div>
        <div>
          <ProfileInput value={libraryCardNumber} validationRequired={false} className="" type="text" onChange={e => setCardNumber(e.target.value)} placeholder="Library Card Number" />
        </div>
        <div>
          <ProfileInput value={pin} validationRequired={false} className="" type="password" onChange={e => setPin(e.target.value)} placeholder="Pin" />
        </div>
      </div>
    </div>
  )
}

export default RealLibraryConnect;

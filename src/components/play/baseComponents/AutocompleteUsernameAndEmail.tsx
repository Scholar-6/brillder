import React from "react";
import { Avatar, Chip, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import './AutocompleteUsername.scss';
import { Brick } from "model/brick";
import { suggestUsername } from "services/axios/user";
import { UserBase } from "model/user";
import { fileUrl } from "components/services/uploadFile";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { enterPressed, spaceKeyPressed } from "components/services/key";

//eslint-disable-next-line
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export interface ShareUser extends UserBase {
  isJustEmail?: boolean;
}

interface AutocompleteProps {
  brick: Brick;
  canEdit: boolean;
  editorError: string;
  placeholder: string;
  onBlur(): void;

  users: ShareUser[];
  setUsers(users: ShareUser[]): void;
}

const AutocompleteUsernameAndEmail: React.FC<AutocompleteProps> = ({
  brick, users, setUsers,
  ...props
}) => {
  const [suggestions, setSuggestions] = React.useState([] as ShareUser[]);

  const onKeyPressed = (e: any) => {
    if (enterPressed(e) || spaceKeyPressed(e)) {
      const email = e.target.value.trim();
      if (!emailRegex.test(email)) { return; }
      setUsers([...users, { email, isJustEmail: true} as ShareUser]);
    }
  }

  return (
    <Autocomplete
      multiple
      disabled={!props.canEdit}
      value={users}
      options={suggestions}
      style={{ background: "inherit" }}
      onChange={(e: any, value: ShareUser[]) => {
        if (value) {
          setUsers(value);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          error={props.editorError !== ""}
          helperText={props.editorError}
          fullWidth
          onBlur={() => props.onBlur()}
          onKeyUp={onKeyPressed}
          onChange={(evt) => {
            const { value } = evt.target;

            if (value.length >= 3) {
              suggestUsername(value).then((res) => {
                if (res && res.length > 0) {
                  setSuggestions(res);
                } else {
                  setSuggestions([]);
                }
              });
            } else {
              setSuggestions([]);
            }
          }}
          placeholder={props.placeholder}
          variant="outlined"
        />
      )}
      renderTags={(value: ShareUser[], getTagProps) => {
        return <>
        {value.map((user, idx) => (
          <Chip
            label={user.isJustEmail ? user.email : user.username}
            avatar={<Avatar src={fileUrl(user.profileImage)} />}
            {...getTagProps({ index: idx })}
          />
        ))}
        </>;
      }}
      filterOptions={(options) => options}
      getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.username})`}
      renderOption={option => (
        <React.Fragment>
          {option.profileImage ? <img alt="" className="autocomplete-profile-image" src={fileUrl(option.profileImage)} /> : <SpriteIcon className="autocomplete-profile-icon" name="user" />}
          {option.firstName} {option.lastName} ({option.username})
        </React.Fragment>
      )}
    />
  );
};

export default AutocompleteUsernameAndEmail;

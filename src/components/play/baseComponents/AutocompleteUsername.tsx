import React from "react";
import { Avatar, Chip, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import './AutocompleteUsername.scss';
import { Brick } from "model/brick";
import { suggestUsername } from "services/axios/user";
import { UserBase } from "model/user";
import { fileUrl } from "components/services/uploadFile";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface AutocompleteProps {
  brick: Brick;
  canEdit: boolean;
  editorError: string;
  placeholder: string;
  removeDisabled?: boolean;
  onBlur(): void;

  users: UserBase[];
  setUsers(users: UserBase[]): void;
}

const AutocompleteUsername: React.FC<AutocompleteProps> = ({
  brick, users, setUsers,
  ...props
}) => {
  const [searchString, setSearchString] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([] as UserBase[]);

  return (
    <Autocomplete
      multiple
      className="autocomplete-username no-removal"
      disabled={!props.canEdit}
      value={users}
      options={suggestions}
      style={{ background: "inherit" }}
      onChange={(e: any, value: UserBase[]) => {
        if (value) {
          setUsers(value);
        }
      }}
      noOptionsText={searchString.length >= 3 ? 'Sorry, no potential editors found with that username' : "Options will start appearing after you type three characters"}
      renderInput={(params) => (
        <TextField
          {...params}
          error={props.editorError !== ""}
          helperText={props.editorError}
          fullWidth
          onBlur={() => props.onBlur()}
          onChange={(evt) => {
            const { value } = evt.target;
            setSearchString(value);
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
      renderTags={(value: UserBase[], getTagProps) => {
        if (props.removeDisabled) {
          return <>
            {value.map((user, idx) => (
              <Chip
                label={`${user.username}`}
                avatar={<Avatar src={fileUrl(user.profileImage)} />}
              />
            ))}
          </>;
        }
        return <>
          {value.map((user, idx) => (
            <Chip
              label={`${user.username}`}
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

export default AutocompleteUsername;

import React from "react";
import { Avatar, Chip, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import './AutocompleteUsername.scss';
import { suggestUsername } from "services/axios/user";
import { UserBase, UserPreferenceType } from "model/user";
import { fileUrl } from "components/services/uploadFile";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface AutocompleteProps {
  canEdit: boolean;
  editorError: string;
  placeholder: string;
  onlyTeachers?: boolean;
  removeDisabled?: boolean;
  onlyUsername?: boolean;
  onBlur(): void;

  users: UserBase[];
  setUsers(users: UserBase[]): void;
}

const AutocompleteUsername: React.FC<AutocompleteProps> = ({
  users, setUsers,
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
      noOptionsText={
        searchString.length >= 3
          ? props.onlyTeachers ? 'Sorry, no potential teachers found with that username' : 'Sorry, no potential editors found with that name'
          : "Options will start appearing after you type three characters"
      }
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
                  if (props.onlyTeachers) {
                    let teachers = res.filter(r => r.userPreference && r.userPreference.preferenceId === UserPreferenceType.Teacher);
                    setSuggestions(teachers);
                  } else {
                    setSuggestions(res);
                  }
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
                onDelete={e => console.log(e)}
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
      getOptionLabel={(option) => {
        if (props.onlyUsername) {
          return option.username;
        }
        return `${option.firstName} ${option.lastName} (${option.username})`
      }}
      renderOption={option => (
        <React.Fragment>
          {option.profileImage ? <img alt="" className="autocomplete-profile-image" src={fileUrl(option.profileImage)} /> : <SpriteIcon className="autocomplete-profile-icon" name="user" />}
          {props.onlyUsername ? option.username : `${option.firstName} ${option.lastName} (${option.username})`}
        </React.Fragment>
      )}
    />
  );
};

export default AutocompleteUsername;

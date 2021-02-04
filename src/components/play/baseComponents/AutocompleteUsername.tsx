import React from "react";
import { Avatar, Chip, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { Brick } from "model/brick";
import { suggestUsername } from "services/axios/user";
import { UserBase } from "model/user";
import { fileUrl } from "components/services/uploadFile";

interface AutocompleteProps {
  brick: Brick;
  canEdit: boolean;
  editorError: string;
  placeholder: string;
  onBlur(): void;

  users: UserBase[];
  setUsers(users: UserBase[]): void;
}

const AutocompleteUsername: React.FC<AutocompleteProps> = ({
  brick, users, setUsers,
  ...props
}) => {
  const [suggestions, setSuggestions] = React.useState([] as UserBase[]);

  return (
    <Autocomplete
      // I commented out these because they were throwing errors in the build and was not sure how to fix them 29/10/20
      // TODO: fix the autosuggest for users
      multiple
      disabled={!props.canEdit}
      value={users}
      options={suggestions}
      style={{ background: "inherit" }}
      onChange={(e: any, value: UserBase[]) => {
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
      renderTags={(value: UserBase[], getTagProps) => {
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
    />
  );
};

export default AutocompleteUsername;

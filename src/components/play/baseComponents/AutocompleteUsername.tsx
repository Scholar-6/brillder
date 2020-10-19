import React from "react";
import { Avatar, Chip, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { Brick } from "model/brick";
import { suggestUsername } from "components/services/axios/user";
import { UserBase } from "model/user";

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
    <Autocomplete<UserBase>
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
            label={`${user.firstName} ${user.lastName}`}
            avatar={<Avatar src={`${process.env.REACT_APP_BACKEND_HOST}/files/${user.profileImage}`} />}
            {...getTagProps({ index: idx })}
          />
        ))}
        </>;
      }}
      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
    />
  );
};

export default AutocompleteUsername;

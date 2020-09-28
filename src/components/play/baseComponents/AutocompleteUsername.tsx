import React from "react";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { Brick } from "model/brick";
import { suggestUsername } from "components/services/axios/user";

interface AutocompleteProps {
  brick: Brick;
  canEdit: boolean;
  editorError: string;
  placeholder: string;
  onBlur(): void;

  username: string;
  setUsername(name: string): void;
}

const AutocompleteUsername: React.FC<AutocompleteProps> = ({
  brick, username, setUsername,
  ...props
}) => {
  const [suggestions, setSuggestions] = React.useState([] as string[]);

  return (
    <Autocomplete
      disabled={!props.canEdit}
      value={username}
      options={suggestions}
      style={{ background: "inherit" }}
      onChange={(e: any, value: string | null) => {
        if (value) {
          setUsername(value);
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
            setUsername(value);
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
    />
  );
};

export default AutocompleteUsername;

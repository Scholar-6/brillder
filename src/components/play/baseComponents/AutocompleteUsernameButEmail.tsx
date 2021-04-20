import React from "react";
import { Avatar, Chip, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import './AutocompleteUsername.scss';
import { UserBase } from "model/user";
import { fileUrl } from "components/services/uploadFile";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface AutocompleteProps {
  placeholder?: string;
  currentEmail: string;
  users: UserBase[];
  onChange(email: string): void;
  onAddEmail(): void;
  setUsers(users: UserBase[]): void;
}

const AutocompleteUsernameButEmail: React.FC<AutocompleteProps> = ({
  users, setUsers, ...props
}) => {
  return (
    <Autocomplete
      multiple
      value={users}
      options={[] as UserBase[]}
      open={false}
      style={{ background: "inherit" }}
      onChange={(e: any, value: UserBase[]) => {
        if (value) {
          setUsers(value);
        }
      }}
      // noOptionsText="User not found. Try to type the name of person"
      renderInput={(params) => {
        const inputProps = params.inputProps as any;
        inputProps.value = props.currentEmail;
        return (
          <TextField
            {...params}
            helperText={""}
            value={props.currentEmail}
            fullWidth
            onKeyPress={e => {
              if (e.key === "Enter" || e.key === ' ') {
                const user = users.find(u => u.email.toLocaleLowerCase() === props.currentEmail.toLocaleLowerCase());
                if (user) {
                  return;
                } else {
                  props.onAddEmail();
                }
              }
            }}
            onChange={(evt) => {
              const { value } = evt.target;
              props.onChange(value);
            }}
            placeholder={props.placeholder ? props.placeholder : "Enter emails here"}
            variant="outlined"
          />
        );
      }}
      renderTags={(value: UserBase[], getTagProps) => {
        return <>
          {value.map((user, idx) => (
            <Chip
              label={`${user.username || user.email}`}
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
          {option.username}
        </React.Fragment>
      )}
    />
  );
};

export default AutocompleteUsernameButEmail;

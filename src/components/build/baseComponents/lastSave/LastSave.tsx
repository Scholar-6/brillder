import React, { useEffect } from "react";

import './LastSave.scss'
import { Grid } from "@material-ui/core";


interface LastSaveProps {
  isSaving: boolean;
  updated: string;
}

const LastSave:React.FC<LastSaveProps> = (props) => {
  const updated = new Date(props.updated);
  const [isSaving, setSaving] = React.useState(props.isSaving);
  const [saveTimeout, setSaveTimeout] = React.useState(null as any);

  useEffect(() => {
    if (props.isSaving) {
      setSaving(true);
      if (saveTimeout) {
        clearInterval(saveTimeout);
      }
      let timeout = setTimeout(() => setSaving(false), 2000);
      setSaveTimeout(timeout);
    }
  }, [props]);

  const formatTwoDigits = (number: Number) => {
    let str = number.toString();
    if (str.length < 2) {
      return '0' + str;
    }
    return str;
  }

  const getTime = (updated: Date) => {
    let hours = formatTwoDigits(updated.getHours());
    let minutes = formatTwoDigits(updated.getMinutes());
    return hours + ":" + minutes;
  }

  const renderText = () => {
    if (isSaving) {
      return "Saving...";
    } else {
      return `Last Saved at ${getTime(updated)}`;
    }
  }

  return (
    <div className="saved-info">
      <Grid container alignContent="center" justify="center">
        <img alt="" src="/feathericons/save-white.png" />
        <div>
          {renderText()}
        </div>
      </Grid>
    </div>
  );
}

export default LastSave;

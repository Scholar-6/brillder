import React from "react";

import { User } from "model/user";
import { Notification } from 'model/notifications';
import { isPhone } from "services/phone";
import DesktopLibrary from "./DesktopLibrary";
import PhoneLibrary from "./PhoneLibrary";

interface BricksListProps {
  user: User;
  notifications: Notification[] | null;
  history: any;
  location: any;
}

const Library:React.FC<BricksListProps> = (props) => {
  if (isPhone()) {
    return <PhoneLibrary {...props} />;
  }
  return <DesktopLibrary {...props} />;
}

export default Library;

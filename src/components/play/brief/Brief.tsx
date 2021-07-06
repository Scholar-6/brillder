import React from "react";

import { Brick } from "model/brick";

import { isPhone } from "services/phone";
import { BrickFieldNames } from 'components/build/proposal/model';

import { PlayMode } from "../model";
import { User } from "model/user";
import DesktopBrief from "./DesktopBrief";
import PhoneBrief from "./PhoneBrief";

interface Props {
  brick: Brick;
  user: User;

  moveNext(): void;
  mode?: PlayMode;
  onHighlight?(name: BrickFieldNames, value: string): void;
}

const BriefPage: React.FC<Props> = ({ ...props }) => {
  if (isPhone()) {
    return <PhoneBrief {...props} />;
  }
  return <DesktopBrief {...props} />
};

export default BriefPage;

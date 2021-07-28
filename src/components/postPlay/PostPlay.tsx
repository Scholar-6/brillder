import React from "react";
import { History } from "history";

import { Brick } from "model/brick";
import { User } from "model/user";
import { BrickFieldNames, PlayButtonStatus } from "../build/proposal/model";

import { isPhone } from "services/phone";
import PostPhonePlay from "./phone/PostPhonePlay";
import PostDesktopPlay from "./desktop/PostDesktopPlay";

export enum BookState {
  Titles,
  Attempts,
  Introduction,
  QuestionPage,
  Synthesis
}

interface ProposalProps {
  brick: Brick;
  user: User;
  canEdit: boolean;
  history: History;
  match: any;
  playStatus: PlayButtonStatus;
  saveBrick(): void;
  setBrickField(name: BrickFieldNames, value: string): void;
}

const PostPlay:React.FC<ProposalProps> = (props) => {
  if (isPhone()) {
    return <PostPhonePlay {...props} />
  }
  return <PostDesktopPlay {...props} />
}

export default PostPlay;

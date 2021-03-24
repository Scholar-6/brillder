import React from "react";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { isPhone } from "services/phone";
import DesktopVersionDialog from "./baseComponents/dialogs/DesktopVersionDialog";

import InvestigationBuildPage, { InvestigationBuildProps } from "./investigationBuildPage";
import { BrickLengthRoutePart, BriefRoutePart, OpenQuestionRoutePart, PrepRoutePart, ProposalReviewPart, TitleRoutePart } from "./proposal/model";

import Proposal from "./proposal/Proposal";


const BuildRouter: React.FC<InvestigationBuildProps> = (props) => {
  const { params } = props.match;
  const brickId = parseInt(params.brickId);

  const proposalBaseUrl = '/build/brick/' + brickId;

  if (isPhone()) {
    return (
      <div className="blue-page">
        <DesktopVersionDialog history={props.history} />
      </div>
    );
  }

  return (
    <Switch>
      <Route
        path={[
          proposalBaseUrl + "/subject",
          proposalBaseUrl + TitleRoutePart,
          proposalBaseUrl + OpenQuestionRoutePart,
          proposalBaseUrl + BrickLengthRoutePart,
          proposalBaseUrl + BriefRoutePart,
          proposalBaseUrl + PrepRoutePart,
          proposalBaseUrl + ProposalReviewPart
        ]}
      >
        <Proposal history={props.history} location={props.location} match={props.match} />
      </Route>
      <Route path="/build/brick/:brickId">
        <InvestigationBuildPage {...props} />
      </Route>
    </Switch>
  );
}

export default BuildRouter;

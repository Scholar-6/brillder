import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import { User } from "model/user";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { ReduxCombinedState } from "redux/reducers";
import { getCompetitionLeaderboard } from "services/axios/competitions";

import './LeaderboardPage.scss';

interface LeaderboardProps {
  user: User;
  match: any
}

const LeaderboardPage: React.FC<any> = (props: LeaderboardProps) => {
  const history = useHistory();
  const [competitors, setCompetitors] = React.useState([] as any);

  const getCompetitors = async (competitionId: number) => {
    const res = [
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
      {username: 1, score: 2},
    ] // await getCompetitionLeaderboard(competitionId);
    setCompetitors(res);
  }

  useEffect(() => {
    const competitionId = parseInt(props.match.params.competitionId);
    getCompetitors(competitionId);
  }, []);

  return (
    <div className="LeaderboardPage">
      <PageHeadWithMenu
        page={PageEnum.MyLibrary}
        user={props.user}
        placeholder="  "
        history={history}
        search={() => { }}
        searching={() => { }}
      />
      <div className="leaderboard-container">
        <div className="leaderboard-head">
          Leaderboard
        </div>
        <div className="leaderboard-filter">
          <div>Competitors</div>
          <div>Brick Title</div>
        </div>
        <div className="competitors-result">
          <div className="title">
            <div>Username</div>
            <div>Score</div>
          </div>
          <div className="line"></div>
          <div className="list">
            {competitors.map((c: any) => {
              return <div>
                <div>{c.username}</div>
                <div>{parseInt(c.score)}</div>
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(LeaderboardPage);

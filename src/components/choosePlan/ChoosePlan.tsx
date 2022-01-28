import React, { Component } from "react";
import { connect } from "react-redux";

import "./ChoosePlan.scss";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";

import HomeButton from "components/baseComponents/homeButton/HomeButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";

interface ChoosePlanProps {
  user: User;
  history: any;
  location: any;
}

interface ChoosePlanState {
}

class ChoosePlanPage extends Component<ChoosePlanProps, ChoosePlanState> {
  constructor(props: ChoosePlanProps) {
    super(props);

    this.state = {
    };
  }


  render() {
    return (
      <div className="choose-plan-page">
        <HomeButton link="/home" history={this.props.history} />
        <div className="title">
          Choose your Premium Plan. <span className="text-green"> Save 50%!</span>
        </div>
        <div className="plans-container">
          <div className="plan-container">
            <div className="flex-center">
              <SpriteIcon name="glasses" className="green-icon glasses" />
            </div>
            <div className="flex-center big-label">Learners</div>
            <div className="price-row flex-center">
              <span className="relative">
                <span className="upper-text first">£9.99</span>
                Monthly&nbsp;<span className="text-green">£4.99</span>
              </span>&nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="relative">
                <span className="upper-text second">£99</span>
                Annually&nbsp;<span className="text-green">£49</span>
              </span>
            </div>
            <div className="list">
              <div>
                <SpriteIcon name="check-icon" className="text-green" />
                Earn prize money if you win a challenge
              </div>
              <div>
                <SpriteIcon name="check-icon" className="text-green" />
                Collect unlimited books in your library
              </div>
              <div>
                <SpriteIcon name="check-icon" className="text-green" />
                Priority Feature Requests
              </div>
            </div>
            <div className="flex-center">
              <div className="continue-btn flex-center" onClick={() => this.props.history.push(map.StripeLearner)}>
                Continue <SpriteIcon name="hero-sparkle"/>
              </div>
            </div>
          </div>
          <div className="plan-container second">
            <div className="flex-center">
              <SpriteIcon name="academic-cap" className="green-icon cap" />
            </div>
            <div className="flex-center big-label">Educators</div>
            <div className="price-row flex-center">
              <span className="relative">
                <span className="upper-text first">£12.99</span>
                Monthly&nbsp;<span className="text-green">£6.49</span>
              </span>&nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="relative">
                <span className="upper-text second">£129</span>
                Annually&nbsp;<span className="text-green">£64.99</span>
              </span>
            </div>
            <div className="list">
              <div>
                <SpriteIcon name="check-icon" className="text-green" />
                Unlimited Assignments
              </div>
              <div>
                <SpriteIcon name="check-icon" className="text-green" />
                Request Bespoke Content
              </div>
              <div>
                <SpriteIcon name="check-icon" className="text-green" />
                Adapt Existing Bricks
              </div>
              <div>
                <SpriteIcon name="check-icon" className="text-green" />
                Priority Feature Requests
              </div>
            </div>
            <div className="flex-center">
              <div className="continue-btn flex-center" onClick={() => this.props.history.push(map.StripeEducator)}>
                Continue <SpriteIcon name="hero-sparkle"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(ChoosePlanPage);

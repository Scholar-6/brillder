import React from "react";
import { Grid } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { History } from "history";

import "../loginPage/loginPage.scss";


interface LoginProps {
	history: History;
}

const SignUpFinished: React.FC<LoginProps> = props => {
	return (
		<Grid
			className="login-page"
			container
			item
			justify="center"
			alignItems="center"
		>
			<div className="back-col">
				<div className="back-box" />
			</div>
			<div className="first-col">
				<div className="first-item" />
				<div className="second-item" />
			</div>
			<div className="second-col">
				<div className="first-item" />
				<div className="second-item" />
			</div>
			<div className="register-success">
				<div className="thanks-info" onClick={() => props.history.push('/')}>
					<CheckCircleIcon className="register-success-icon" />
            Thank you for signing up to Brix. <br />
            We’ll get back to you soon with a link <br />
            to activate your account.
          </div>
				<div className="contact-info">
					If you have any further questions, please email theteam@scholar6.org
          </div>
			</div>
      ) : (
			<div></div>
      )
		</Grid>
	);
};

export default SignUpFinished;

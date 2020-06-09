import React from 'react'
import { Grid } from '@material-ui/core';
import { withRouter } from "react-router-dom";

import sprite from "../../../assets/img/icons-sprite.svg";
import './HomeButton.scss';


export interface HomeButtonProps {
	link: string,
	history: any
	onClick(): void
}

interface HomeButtonState {
	focused: boolean,
	ref: any,
	//   enterTimeout: any,
	//   leaveTimeout: any,
	//   style: any,
}

class HomeButtonComponent extends React.Component<any, HomeButtonState> {
	constructor(props: any) {
		super(props);
		this.state = {
			focused: false,
			ref: React.createRef(),

			//   enterTimeout: null,
			//   leaveTimeout: null,

			//   style: {
			//     baseSize: '6.3vh',
			//     animateMarginLeft: '0.9vh',
			//     animateMarginTop: '2.25vh',
			//     animateHeight: '4vh',
			//     animateWidth: '4.5vh',
			//     transaction: 'all 0.25s ease-in-out',
			//     delay: 200,
			//   }
		}
	}

	// onMouseEnterHandler() {
	//   if (this.state.leaveTimeout) {
	//     clearTimeout(this.state.leaveTimeout);
	//   }

	//   const {style} = this.state;
	//   let homeIcon = this.state.ref.current;
	//   homeIcon.style.marginTop = style.animateMarginTop;
	//   homeIcon.style.marginLeft = style.animateMarginLeft;
	//   homeIcon.style.height = style.animateHeight;
	//   homeIcon.style.width = style.animateWidth;
	//   homeIcon.style.transition = style.transaction;

	//   const enterTimeout = setTimeout(() => {
	//     homeIcon.style.transition = 'none';
	//     homeIcon.style.marginTop = 0;
	//     homeIcon.style.marginLeft = 0;
	//     homeIcon.style.height = style.baseSize;
	//     homeIcon.style.width = style.baseSize;
	//     homeIcon.style.backgroundImage = 'url(/images/brick-list/home-hover.png)';
	//     this.setState({...this.state, enterTimeout: null});
	//   }, style.delay);
	//   this.setState({...this.state, enterTimeout})
	// }

	// onMouseLeaveHandler() {
	//   if (this.state.enterTimeout) {
	//     clearTimeout(this.state.enterTimeout);
	//   }
	//   const {style} = this.state;
	//   let homeIcon = this.state.ref.current;
	//   homeIcon.style.marginTop = 0;
	//   homeIcon.style.marginLeft = 0;
	//   homeIcon.style.marginTop = style.animateMarginTop;
	//   homeIcon.style.marginLeft = style.animateMarginLeft;
	//   homeIcon.style.height = style.animateHeight;
	//   homeIcon.style.width = style.animateWidth;
	//   homeIcon.style.backgroundImage = 'url(/images/choose-login/logo.png)';

	//   const leaveTimeout = setTimeout(() => {
	//     homeIcon.style.transition = 'none';
	//     homeIcon.style.height = style.baseSize;
	//     homeIcon.style.width = style.baseSize;
	//     homeIcon.style.marginTop = 0;
	//     homeIcon.style.marginLeft = 0;
	//     homeIcon.style.transition = style.transaction;
	//     this.setState({...this.state, leaveTimeout: null});
	//   }, 100);
	//   this.setState({...this.state, leaveTimeout})
	// }

	onClick() {
		if (this.props.onClick) {
			this.props.onClick();
		} else {
			this.props.history.push(this.props.link);
		}
	}

	render() {
		return (
			<Grid container direction="row" className="home-button-container">
				<button type="button" className="btn btn-transparent svgOnHover home-button"
					// onMouseEnter={() => this.onMouseEnterHandler()}
					// onMouseLeave={() => this.onMouseLeaveHandler()}
					onClick={() => this.onClick()}>
					{/* <div ref={this.state.ref} /> */}\
					<svg className="svg svg-default">
						<use href={sprite + "#logo"} />
					</svg>
					<svg className="svg colored">
						<use href={sprite + "#logo-hover"} />
					</svg>
					<div className="smoke-container">
						<svg width="80px" height="73px" viewBox="0 0 31 73">
							<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g className="smokes" transform="translate(2.000000, 2.000000)" stroke="#BEBEBE" stroke-width="5">
									<g className="smoke-1">
										<path id="Shape1" d="M0.5,8.8817842e-16 C0.5,8.8817842e-16 3.5,5.875 3.5,11.75 C3.5,17.625 0.5,17.625 0.5,23.5 C0.5,29.375 3.5,29.375 3.5,35.25 C3.5,41.125 0.5,41.125 0.5,47"></path>
									</g>
									<g className="smoke-2">
										<path id="Shape2" d="M0.5,8.8817842e-16 C0.5,8.8817842e-16 3.5,5.875 3.5,11.75 C3.5,17.625 0.5,17.625 0.5,23.5 C0.5,29.375 3.5,29.375 3.5,35.25 C3.5,41.125 0.5,41.125 0.5,47"></path>
									</g>
									<g className="smoke-3">
										<path id="Shape3" d="M0.5,8.8817842e-16 C0.5,8.8817842e-16 3.5,5.875 3.5,11.75 C3.5,17.625 0.5,17.625 0.5,23.5 C0.5,29.375 3.5,29.375 3.5,35.25 C3.5,41.125 0.5,41.125 0.5,47"></path>
									</g>
								</g>
							</g>
						</svg>
					</div>
				</button>
			</Grid>
		);
	}
}

export default withRouter(HomeButtonComponent);

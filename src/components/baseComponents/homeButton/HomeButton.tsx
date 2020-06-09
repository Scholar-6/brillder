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
					<svg className="svg w100 h100 svg-default">
						<use href={sprite + "#logo"} className="text-orange" />
					</svg>
					<svg className="svg w100 h100 colored">
						<use href={sprite + "#logo-home"} className="text-orange" />
					</svg>
					<div className="smoke-container">
						<svg width="2vw" height="2vw" viewBox="0 0 2vw 2vw">
							<g className="smokes" fill="#BEBEBE" stroke="none">
								<g className="smoke-1">
									<path id="Shape1" d="M13.247,2.505c-2.09-1.363-3.281-2.4-6.472-2.043C3.583,0.818,4.833,5.601,3.438,5.601
										c-2.063,0-3.655,4.108-2.536,6.084c1.119,1.979,5.873,0,5.873,0c1.268,1.129,2.874,1.805,4.567,1.924c2.487,0,1.899-3.82,1.899-3.82
										s5.965,0.27,5.447-2.536c-0.146-0.794,1.824-3.089,0-4.749C16.866,0.844,13.247,2.505,13.247,2.505z"/>
								</g>
								<g className="smoke-2">
									<path id="Shape2" d="M13.247,2.505c-2.09-1.363-3.281-2.4-6.472-2.043C3.583,0.818,4.833,5.601,3.438,5.601
										c-2.063,0-3.655,4.108-2.536,6.084c1.119,1.979,5.873,0,5.873,0c1.268,1.129,2.874,1.805,4.567,1.924c2.487,0,1.899-3.82,1.899-3.82
										s5.965,0.27,5.447-2.536c-0.146-0.794,1.824-3.089,0-4.749C16.866,0.844,13.247,2.505,13.247,2.505z"/>
								</g>
								<g className="smoke-3">
									<path id="Shape3" d="M13.247,2.505c-2.09-1.363-3.281-2.4-6.472-2.043C3.583,0.818,4.833,5.601,3.438,5.601
										c-2.063,0-3.655,4.108-2.536,6.084c1.119,1.979,5.873,0,5.873,0c1.268,1.129,2.874,1.805,4.567,1.924c2.487,0,1.899-3.82,1.899-3.82
										s5.965,0.27,5.447-2.536c-0.146-0.794,1.824-3.089,0-4.749C16.866,0.844,13.247,2.505,13.247,2.505z"/>
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

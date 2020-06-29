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
}

class HomeButtonComponent extends React.Component<any, HomeButtonState> {
	constructor(props: any) {
		super(props);
		this.state = {
			focused: false,
			ref: React.createRef(),
		}
	}
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
					onClick={() => this.onClick()}>
					<svg className="svg w100 h100 active">
						<use href={sprite + "#logo"} className="text-theme-orange" />
					</svg>
					<div className="roof svgOnHover">
						<svg className="svg w100 h100 active">
							<use href={sprite + "#roof"} className="text-theme-orange" />
						</svg>
					</div>
					<div className="smoke-container">
						<svg width="2vw" height="2vw">
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

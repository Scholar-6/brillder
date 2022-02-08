import React from 'react'
import { Route } from 'react-router-dom'

import './HomeButton.scss';
import SpriteIcon from '../SpriteIcon';
import { isMobile } from 'react-device-detect';

const DesktopTheme = React.lazy(() => import("./themes/HomeButtonDesktopTheme"));
export interface HomeButtonProps {
  link?: string;
  history: any;
  onClick?(): void;
}

const HomeButtonComponent: React.FC<HomeButtonProps> = (props) => {
  return (
    <Route render={() => {
      const onClick = () => {
        if (props.onClick) {
          props.onClick();
        } else if (props.link) {
          props.history.push(props.link);
        }
      }
      return (
        <React.Suspense fallback={<></>}>
        {!isMobile && <DesktopTheme />}
        <div className="home-button-container">
          <button type="button" className="btn btn-transparent svgOnHover home-button" onClick={() => onClick()}>
            <SpriteIcon name="logo" className="w100 h100 active text-theme-orange" />
            <div className="roof svgOnHover">
              <SpriteIcon name="roof" className="w100 h100 active text-theme-orange" />
            </div>
            <div className="smoke-container">
              <svg className="svg w100 h100" viewBox="0 0 24 24">
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
        </div>
        </React.Suspense>
      )
    }} />
  );
}

export default HomeButtonComponent;

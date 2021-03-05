import React from "react";

interface PhoneIconProps {}

interface PhoneIconState {
  teach: string;
  learn: string;
  build: string;
  animation: boolean;
}

enum StateKeysEnum {
  teach = 'teach',
  build = 'build',
  learn = 'learn',
}

class PhoneIcon extends React.Component<PhoneIconProps, PhoneIconState> {
  constructor(props: PhoneIconProps) {
    super(props);

    this.state = {
      teach: '',
      learn: '',
      build: '',
      animation: false,
    };

  }

  componentDidMount() {
    this.printLetter(0, 'LEARN', StateKeysEnum.learn, () => {
      this.printLetter(0, 'TEACH', StateKeysEnum.teach, () => {
        this.printLetter(0, 'BUILD', StateKeysEnum.build, () => {});
      });
    });

    setTimeout(() => {
      this.setState({animation: true});
    }, 100);
  }

  randDelay (min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  printLetter (index: number, label: string, key: StateKeysEnum, onEnded: Function) {
    setTimeout(() => {
      try {
        this.setState({ ...this.state, [key]: this.state[key] + label[index] });
        if (index < label.length - 1) {
          this.printLetter(index + 1, label, key, onEnded);
        } else {
          onEnded();
        }
      } catch {}
    }, this.randDelay(50, 90));
  };

  render() {
    return (
      <div className="loginPhone">
        <svg viewBox="0 0 321.145 739.506">
          <defs>
            <filter id="Rectangle_574" x="0" y="0" width="321.145" height="739.506" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feFlood floodOpacity="0.161" />
              <feComposite operator="in" in2="blur" />
              <feComposite in="SourceGraphic" />
            </filter>
          </defs>
          <g id="Group_438" transform="translate(-1219.626 -124.483) scale(0.906 1)">
            <g id="Group_327" transform="translate(1344 162.872)">
              <g transform="matrix(1.1, 0, 0, 1, 1.71, -38.39)" filter="url(#Rectangle_574)">
                <g id="Rectangle_574-2" transform="translate(2.65 38.39) scale(0.91 1)" fill="#193366" stroke="#001c55" strokeWidth="8">
                  <rect width="314.827" height="645.859" rx="32" stroke="none" />
                  <rect x="4" y="4" width="306.827" height="637.859" rx="28" fill="none" />
                </g>
              </g>
              <rect id="Rectangle_213" width="282.433" height="617.232" rx="16" transform="translate(21.149 13.814)" fill="#001c55" />
              <rect id="Rectangle_247" width="6.945" height="30.094" rx="3.472" transform="translate(0 78.707)" fill="#001c55" />
              <rect id="Rectangle_248" width="6.945" height="41.668" rx="3.472" transform="translate(0 145.839)" fill="#001c55" />
              <rect id="Rectangle_249" width="6.945" height="41.668" rx="3.472" transform="translate(0 208.342)" fill="#001c55" />
              <rect id="Rectangle_575" width="11.575" height="94.911" rx="5.787" transform="translate(312.512 155.099)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077" d="M14,0H255.073a14,14,0,0,1,14,14V287.955a0,0,0,0,1,0,0H14a14,14,0,0,1-14-14V14A14,14,0,0,1,14,0Z" transform="translate(1371.507 181.948)" fill="#193366" />
            <path id="Rectangle_1078" d="M14,0H268.676a0,0,0,0,1,0,0V275.887a14,14,0,0,1-14,14H14a14,14,0,0,1-14-14V14A14,14,0,0,1,14,0Z" transform="translate(1371.706 498.533)" fill="#fff" />
            <image id="phone-image" width="156.603" height="164.358" transform="translate(1427.337 248.523)" href="/images/choose-login/logo.png"/>
            <text id="LEARN" transform="translate(1405.162 553.787)" fill="#001c55" fontSize="54" letterSpacing="0.16em">
              <tspan x="0" y="0">{this.state.learn}</tspan>
            </text>
            <text id="TEACH" transform="translate(1410.279 627.91)" fill="#001c55" fontSize="49" letterSpacing="0.16em">
              <tspan x="0" y="0">{this.state.teach}</tspan>
            </text>
            <text id="BUILD" transform="translate(1414.503 710.323)" fill="#001c55" fontSize="52" letterSpacing="0.16em">
              <tspan x="0" y="0">{this.state.build}</tspan>
            </text>
          </g>
        </svg>
      </div>
    );
  }
};

export default PhoneIcon;
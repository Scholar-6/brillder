import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from 'assets/lottiefiles/first.json';

interface Props {
  animationData: string;
  className: string;
}

interface State {
  isStopped: boolean;
  isPaused: boolean;
  lottieHeartRef: any;
}

export default class LottieHoverControl extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isStopped: true,
      isPaused: false,
      lottieHeartRef: React.createRef()
    };
  }

  onMouseEnter() {
    console.log('hover');
    this.setState({isStopped: false});
  };

  onMouseLeave = () => {
    this.setState({isStopped: true});
  };

  render() {
    const dd = animationData as any;

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: dd.default[this.props.animationData],
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return <div className={this.props.className} onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
      <Lottie options={defaultOptions}
        height={400}
        width={400}
        isStopped={this.state.isStopped}
        isPaused={this.state.isPaused}
      />
    </div>
  }
}

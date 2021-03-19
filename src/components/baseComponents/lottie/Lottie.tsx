import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from 'assets/lottiefiles/first.json';


interface Props {

}

interface State {
  isStopped: boolean;
  isPaused: boolean;
}

export default class LottieControl extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isStopped: false, isPaused: false };
  }

  render() {
    const dd = animationData as any;

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: dd.default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return <div>
      <Lottie options={defaultOptions}
        height={400}
        width={400}
        isStopped={false}
        isPaused={false} />
    </div>
  }
}

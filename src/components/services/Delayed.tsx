import React from 'react';
import PropTypes from 'prop-types';

interface DelayedProps {
    waitBeforeShow: number;
    children: any;
}

interface DelayedState {
    hidden: boolean;
}

class Delayed extends React.Component<DelayedProps, DelayedState> {

    constructor(props: any) {
        super(props);
        this.state = {hidden : true};
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({hidden: false});
        }, this.props.waitBeforeShow);
    }

    render() {
        return this.state.hidden ? '' : this.props.children;
    }
}

export default Delayed;
import React from 'react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';

import actions from 'redux/actions/play';
import { ReduxCombinedState } from 'redux/reducers';


interface SortImageProps {
  valueFile: string;
  imageSource?: string;

  hovered: boolean;
  hover(valueFile: string, imageSource?: string): void;
  blur(): void;
}


const SortImage: React.FC<SortImageProps> = ({valueFile, imageSource, ...props}) => {
  const [lastClick, setLastClick] = React.useState(0);

  const onDoubleClick = () => {
    if (props.hovered) {
      props.blur();
    } else {
      props.hover(valueFile, imageSource);
    }
  }

  if (isMobile) {
    return (
      <img
        alt="" className="sort-image-choice"
        src={`${process.env.REACT_APP_BACKEND_HOST}/files/${valueFile}`}
        onClick={e => {
          if (lastClick && e.timeStamp - lastClick < 250) {
            setLastClick(0);
            onDoubleClick();
          } else {
            setLastClick(e.timeStamp);
          }
        }}
      />
    );
  }

  return (
    <img
      alt="" className="sort-image-choice"
      src={`${process.env.REACT_APP_BACKEND_HOST}/files/${valueFile}`}
      onMouseEnter={() => props.hover(valueFile, imageSource)}
      onMouseLeave={props.blur}
    />
  );
}

const mapState = (state: ReduxCombinedState) => ({
  hovered: state.play.imageHovered, // for phones it is not hovered but double clicked
});

const mapDispatch = (dispatch: any) => ({
  hover: (fileName: string, imageSource: string) => dispatch(actions.setImageHover(fileName, imageSource)),
  blur: () => dispatch(actions.setImageBlur()),
});

export default connect(mapState, mapDispatch)(SortImage);
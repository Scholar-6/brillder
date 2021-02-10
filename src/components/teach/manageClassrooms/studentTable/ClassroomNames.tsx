import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

import './ClassroomNames.scss';

interface ClassroomNamesProps {
  studyClassrooms?: any[];
  hasInvitation: boolean;
}

interface State {
  scrollNeeded: boolean;
  ref: React.RefObject<HTMLDivElement>;
}

class ClassroomNames extends React.Component<ClassroomNamesProps, State> {
  constructor(props: ClassroomNamesProps) {
    super(props);

    this.state = {
      scrollNeeded: false,
      ref: React.createRef<HTMLDivElement>()
    }
  }

  /**
   * Set if scroll status if needed
   * */
  componentDidMount() {
    const parrentNode = this.state.ref.current;
    if (parrentNode && parrentNode.children.length > 0) {
      const childNode = parrentNode.children[0] as HTMLDivElement;
      if (childNode) {
        if (childNode.offsetWidth > parrentNode.offsetWidth) {
          this.setState({ scrollNeeded: true });
        }
      }
    }
  }

  getScrollingComponent() {
    const parrentNode = this.state.ref.current;
    if (parrentNode && parrentNode.children.length > 0) {
      const childNode = parrentNode.children[0] as HTMLDivElement;
      if (childNode) {
        return childNode;
      }
    }
    return null;
  }

  scroll(scrollValue: number) {
    const scrollElement = this.state.ref.current;
    if (scrollElement) {
      scrollElement.scrollBy(scrollValue, 0);
    }
  }

  scrollRight() {
    this.scroll(100);
  }

  scrollLeft() {
    this.scroll(-100);
  }

  render() {
    const { props } = this;
    const { scrollNeeded } = this.state;

    let className = 'inline-names-container';
    if (scrollNeeded) {
      className += ' scrolling';
    }

    return (
      <div className={className}>
        {scrollNeeded && <SpriteIcon className="scroll-button left" name="arrow-left" onClick={this.scrollLeft.bind(this)} />}
        <div ref={this.state.ref} className="inline-names-limiter">
          <div className="inline-names">
            {props.studyClassrooms && props.studyClassrooms.map((classroom, i) =>
              <div key={i} className="classroom-name" style={{
                backgroundColor: classroom.subject?.color
              }}>{classroom.name}</div>)
            }
            {props.hasInvitation && <div className="classroom-name text-theme-dark-blue pending-label">Pending</div>}
          </div>
        </div>
        {scrollNeeded && <SpriteIcon className="scroll-button right" name="arrow-right" onClick={this.scrollRight.bind(this)}  />}
      </div>
    );
  }
}

export default ClassroomNames;

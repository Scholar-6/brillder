import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

import './ClassroomNames.scss';

interface ClassroomNamesProps {
  studyClassrooms?: any[];
  hasInvitation: boolean;
  resendInvitation(): void;
}

interface State {
  scrollNeeded: boolean;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  ref: React.RefObject<HTMLDivElement>;
}

class ClassroomNames extends React.Component<ClassroomNamesProps, State> {
  constructor(props: ClassroomNamesProps) {
    super(props);

    this.state = {
      scrollNeeded: false,
      canScrollLeft: false,
      canScrollRight: false,
      ref: React.createRef<HTMLDivElement>()
    }
  }

  /**
   * Set if scroll status if needed
   * */
  checkScrolling() {
    const parrentNode = this.state.ref.current;
    if (parrentNode && parrentNode.children.length > 0) {
      const childNode = parrentNode.children[0] as HTMLDivElement;
      if (childNode) {
        if (childNode.offsetWidth > parrentNode.offsetWidth) {
          if (!this.state.scrollNeeded) {
            this.setState({ scrollNeeded: true, canScrollRight: true });
          }
          return;
        }
      }
    }
    if (this.state.scrollNeeded) {
      this.setState({ scrollNeeded: false });
    }
  }

  componentDidMount() {
    this.checkScrolling();
  }

  componentDidUpdate() {
    this.checkScrolling();
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
      return true;
    }
    return false;
  }

  checkScrollRight() {
    const scrollElement = this.state.ref.current;
    if (scrollElement) {
      if (scrollElement.scrollWidth - scrollElement.offsetWidth < scrollElement.scrollLeft + 3) {
        this.setState({ canScrollRight: false });
      }
    }
  }

  scrollRight() {
    const success = this.scroll(100);
    if (success && !this.state.canScrollLeft) {
      this.setState({ canScrollLeft: true });
    }

    this.checkScrollRight();
  }

  checkScrollLeft() {
    const scrollElement = this.state.ref.current;
    if (scrollElement) {
      if (scrollElement.scrollLeft === 0) {
        this.setState({ canScrollLeft: false });
      }
    }
  }

  scrollLeft() {
    const success = this.scroll(-100);
    if (success && !this.state.canScrollRight) {
      this.setState({ canScrollRight: true });
    }
    this.checkScrollLeft();
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
        {scrollNeeded && this.state.canScrollLeft && <SpriteIcon className="scroll-button left" name="arrow-left" onClick={e => {
          this.scrollLeft();
          e.stopPropagation();
        }} />}
        <div ref={this.state.ref} className="inline-names-limiter">
          <div className="inline-names">
            {props.studyClassrooms && props.studyClassrooms.map((classroom, i) =>
              <div key={i} className="classroom-name" style={{
                backgroundColor: classroom.subject?.color
              }}>{classroom.name}</div>)
            }
            {props.hasInvitation && <>
              <div className="classroom-name text-theme-dark-blue pending-label">Pending</div>
              <div className="classroom-name resend-label" onClick={e => { e.stopPropagation(); props.resendInvitation(); }}>Resend</div>
            </>}
          </div>
        </div>
        {scrollNeeded && this.state.canScrollRight && <div className="overflow-fade-end" />}
        {scrollNeeded && this.state.canScrollLeft && <div className="overflow-fade-start" />}
        {scrollNeeded && this.state.canScrollRight && <SpriteIcon className="scroll-button right" name="arrow-right" onClick={e => {
          this.scrollRight();
          e.stopPropagation();
        }} />}
      </div>
    );
  }
}

export default ClassroomNames;

import React, { useRef, useState, useCallback } from 'react';
import useBricks from './useBricks';
import { User } from 'model/user';
import PhoneTopBrickScroll16x9 from 'components/baseComponents/PhoneTopBrickScroll16x9';

interface Props {
  user: User;
  subjectId: number;
}

const InfinityScrollCustom = (props: Props) => {
  const [pageNum, setPageNum] = useState(1);
  const {
    isLoading,
    isError,
    results,
    hasNextPage
  } = useBricks(pageNum, props.subjectId);

  const intObserver = useRef() as any;

  const lastBrickRef = useCallback(brick => {
    if (isLoading) return

    if (intObserver.current) intObserver.current.disconnect();

    intObserver.current = new IntersectionObserver(bricks => {
      if (bricks[0].isIntersecting && hasNextPage) {
        setPageNum(prev => prev + 1);
      }
    });

    if (brick) intObserver.current.observe(brick);

  }, [isLoading, hasNextPage]);

  if (isError) {
    // need to think what to do when error;
    console.log('error when loading bricks in play');
  }

  const content = results.map((brick, i) => {
    if (results.length === i + 1) {
      return <PhoneTopBrickScroll16x9 ref={lastBrickRef} brick={brick} user={props.user} />
    }
    return <PhoneTopBrickScroll16x9 brick={brick} user={props.user} />
  });

  return (
    <div className="bricks-scroll-row">
      <div className="bricks-flex-row" style={{ width: results.length * 60 + 2 + "vw" }}>
        {content}
        {/*isLoading && <div>...Loading</div>*/}
      </div>
    </div>
  );
}

export default InfinityScrollCustom;

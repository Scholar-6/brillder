import React, { useRef, useState, useCallback } from 'react';

import useBricks from './useBricks';
import { User } from 'model/user';
import PhoneTopBrickScroll16x9 from 'components/baseComponents/PhoneTopBrickScroll16x9';
import { Brick } from 'model/brick';

interface Props {
  user: User;
  subjectId: number;
  subjectGroup: number | null;
  setBrick(b: Brick): void;
}

const InfinityScrollCustom = (props: Props) => {
  const [pageNum, setPageNum] = useState(0);
  const {
    isLoading,
    isError,
    results,
    hasNextPage
  } = useBricks(pageNum, props.user, props.subjectId, props.subjectGroup, true, [], []);

  const intObserver = useRef() as any;

  const lastBrickRef = useCallback(brick => {
    if (isLoading) return;

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
      return <PhoneTopBrickScroll16x9 ref={lastBrickRef} brick={brick} user={props.user} onClick={() => props.setBrick(brick)} />
    }
    return <PhoneTopBrickScroll16x9 brick={brick} user={props.user} onClick={() => props.setBrick(brick)} />
  });

  return (
    <div className="bricks-scroll-row">
      <div className="bricks-flex-row">
        {content}
        {isLoading && <div>...Loading</div>}
      </div>
    </div>
  );
}

export default InfinityScrollCustom;

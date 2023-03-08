import React, { useRef, useState, useCallback, useEffect } from 'react';

import useBricks from './useBricks';
import { User } from 'model/user';
import PhoneTopBrickScroll16x9 from 'components/baseComponents/PhoneTopBrickScroll16x9';
import { Brick, Subject, SubjectGroup } from 'model/brick';

interface Props {
  user: User;
  isCore: boolean;
  subjects: Subject[];
  subjectGroup?: SubjectGroup,
  onLoad(data: any): void;
  setBrick(b: Brick): void;
}

const InfinityScrollCustom = (props: Props) => {
  const [pageNum, setPageNum] = useState(0);
  const {
    isLoading,
    isError,
    results,
    hasNextPage,
    data
  } = useBricks(pageNum, props.user, props.subjects, props.isCore, [], [], props.subjectGroup);

  useEffect(() => {
    props.onLoad(data);
  }, [data])

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
      return <PhoneTopBrickScroll16x9 key={i} ref={lastBrickRef} brick={brick} user={props.user} onClick={() => props.setBrick(brick)} />
    }
    return <PhoneTopBrickScroll16x9 key={i} brick={brick} user={props.user} onClick={() => props.setBrick(brick)} />
  });

  if (content.length == 0) {
    return <div />;
  }

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

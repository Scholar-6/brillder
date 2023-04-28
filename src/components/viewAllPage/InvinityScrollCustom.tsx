import React, { useRef, useState, useCallback, useEffect } from 'react';

import useBricks from './useBricks';
import { User } from 'model/user';
import PhoneTopBrickScroll16x9 from 'components/baseComponents/PhoneTopBrickScroll16x9';
import { AcademicLevel, Brick, BrickLengthEnum, Subject } from 'model/brick';

interface Props {
  user: User;
  isCore: boolean;
  subjects: Subject[];
 
  filterLevels: AcademicLevel[];
  filterLength: BrickLengthEnum[];

  searchString?: string;
  onLoad(data: any): void;
  setBrick(b: Brick): void;
}

const InfinityScrollCustom = (props: Props) => {
  const [pageNum, setPageNum] = useState(0);
  const [subjectsB, setSubjects] = useState([] as Subject[]);
  const [oldSearch, setOldSearchStr] = useState('');

  const {
    isLoading,
    isError,
    results,
    hasNextPage,
    data
  } = useBricks(pageNum, props.user, props.subjects, props.isCore, props.filterLevels, props.filterLength, props.searchString);

  useEffect(() => {
    props.onLoad(data);
  }, [data])

  useEffect(() => {
    const {searchString} = props;
    const subjectIds = props.subjects.map(s => s.id);
    const subject2Ids = subjectsB.map(s => s.id);

    let isModified = subjectIds.length !== subject2Ids.length;

    if (searchString && searchString.length >= 3) {
      if (searchString != oldSearch) {
        isModified = true;
        setOldSearchStr(searchString);
      }
    } else {
      if (searchString && searchString.length < 3) {
        if (oldSearch.length >= 3) {
          isModified = true;
          setOldSearchStr('');
        }
      }
    }

    if(!isModified){
      for (let index = 0; index < subjectIds.length; index++) {
        let same = subject2Ids[index] == subjectIds[index];
        if (!same) {
          isModified = true;
          break;
        }
      }
    }

    if (isModified) {
      setPageNum(0);
      setSubjects(props.subjects);
    }
  }, [props.subjects, props.searchString, props.filterLength, props.filterLength]); // need to update when searchString changed.

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

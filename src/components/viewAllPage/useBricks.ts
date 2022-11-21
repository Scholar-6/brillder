import { Brick } from 'model/brick';
import { User } from 'model/user';
import { useState, useEffect } from 'react';
import { getPublishedBricksByPage, getUnauthPublishedBricksByPage } from 'services/axios/brick';

const useBricks = (pageNum = 0, user: User, subjectId: number, subjectGroup: number | null, isCore: boolean, levels: number[], lengths: number[] ) => {
  const [results, setResults] = useState([] as Brick[]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [hasNextPage, setHasNextPage] = useState(false);

  const bricksPerPage = 6;

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError({});

    if (user) {
      getPublishedBricksByPage(bricksPerPage, pageNum, isCore, levels, lengths, [subjectId], false, true).then(data => {
        if (data) {
          setResults(prev => [...prev, ...data.bricks]);
          setHasNextPage(data.pageCount - ((pageNum + 1) * bricksPerPage) >= 0);
          setIsLoading(false);
        } else {
          // error
          setIsLoading(false);
          setHasNextPage(false);
          setIsError(true);
        }
      });
    } else {
      if (subjectGroup) {
        getUnauthPublishedBricksByPage(6, pageNum, [], [], [subjectId], false, subjectGroup).then(data => {
          if (data) {
            setResults(prev => [...prev, ...data.bricks]);
            setHasNextPage(data.pageCount > pageNum);
            setIsLoading(false)
          } else {
            // error
            setIsLoading(false);
            setHasNextPage(false);
            setIsError(true);
          }
        });
      }
    }
  }, [pageNum])

  return { isLoading, isError, error, results, hasNextPage }
}

export default useBricks;

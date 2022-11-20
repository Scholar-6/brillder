import { Brick } from 'model/brick';
import { User } from 'model/user';
import { useState, useEffect } from 'react';
import { getPublishedBricksByPage, getUnauthPublishedBricksByPage } from 'services/axios/brick';

const useBricks = (pageNum = 0, user: User, subjectId: number, subjectGroup: number | null) => {
  const [results, setResults] = useState([] as Brick[]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError({});

    if (user) {
      getPublishedBricksByPage(6, pageNum, true, [], [], [subjectId], false, true).then(data => {
        if (data) {
          setResults(prev => [...prev, ...data.bricks]);
          setHasNextPage(data.pageCount > pageNum);
          setIsLoading(false)
        } else {
          // error
          setIsLoading(false);
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
            setIsError(true);
          }
        });
      }
    }
  }, [pageNum])

  return { isLoading, isError, error, results, hasNextPage }
}

export default useBricks;

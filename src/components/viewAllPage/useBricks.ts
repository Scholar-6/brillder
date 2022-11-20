import { Brick } from 'model/brick';
import { useState, useEffect } from 'react';
import { getPublishedBricksByPage } from 'services/axios/brick';

const useBricks = (pageNum = 1, subjectId: number) => {
  const [results, setResults] = useState([] as Brick[]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError({});
    
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
  }, [pageNum])

  return { isLoading, isError, error, results, hasNextPage }
}

export default useBricks;

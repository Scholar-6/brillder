import { Brick, Subject, SubjectGroup } from 'model/brick';
import { User } from 'model/user';
import { useState, useEffect } from 'react';
import { getPublishedBricksByPage, getUnauthPublishedBricksByPage, PageBricks } from 'services/axios/brick';

const useBricks = (pageNum = 0, user: User, subjects: Subject[], isCore: boolean, levels: number[], lengths: number[], subjectGroup?: SubjectGroup) => {
  const [results, setResults] = useState([] as Brick[]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [hasNextPage, setHasNextPage] = useState(false);
  const [data, setData] = useState({} as PageBricks);
  const [subjectsB, setSubjects] = useState([] as Subject[]);

  const bricksPerPage = 6;

  const getAndSetBricks = (sIds: number[]) => {
    if (user) {
      getPublishedBricksByPage(bricksPerPage, pageNum, isCore, levels, lengths, sIds, false).then(data => {
        if (data) {
          setResults(prev => [...prev, ...data.bricks]);
          setHasNextPage(data.pageCount - ((pageNum + 1) * bricksPerPage) >= 0);
          setData(data);
          setIsLoading(false);
        } else {
          // error
          setIsLoading(false);
          setHasNextPage(false);
          setIsError(true);
        }
      });
    } else {
        let sGroup = subjectGroup;
        if (!sGroup) {
          sGroup = subjects[0].group;
        }
        getUnauthPublishedBricksByPage(bricksPerPage, pageNum, [], [], sIds, false).then(data => {
          if (data) {
            setResults(prev => [...prev, ...data.bricks]);
            setHasNextPage(data.pageCount - ((pageNum + 1) * bricksPerPage) >= 0);
            setData(data);
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

  useEffect(() => {
    const subjectIds = subjects.map(s => s.id);
    const subject2Ids = subjectsB.map(s => s.id);

    let isModified = subjectIds.length !== subject2Ids.length;

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
      setIsLoading(true);
      setIsError(false);
      setError({});

      setSubjects(subjects);
      setResults([]);
      setData({} as PageBricks);
      setHasNextPage(false);
      getAndSetBricks(subjectIds);
    }
  }, [subjects]);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError({});

    const sIds = subjects.map(s => s.id);

    getAndSetBricks(sIds);
  }, [pageNum])

  return { isLoading, isError, error, results, hasNextPage, data }
}

export default useBricks;

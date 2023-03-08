import { Brick, Subject } from 'model/brick';
import { User } from 'model/user';
import { useState, useEffect } from 'react';
import { getPublishedBricksByPage, getUnauthPublishedBricksByPage, PageBricks, searchPaginateBricks } from 'services/axios/brick';

const useBricks = (pageNum = 0, user: User, subjects: Subject[], isCore: boolean, levels: number[], lengths: number[], searchString?: string) => {
  const [results, setResults] = useState([] as Brick[]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [hasNextPage, setHasNextPage] = useState(false);
  const [data, setData] = useState({} as PageBricks);
  const [subjectsB, setSubjects] = useState([] as Subject[]);
  const [pageNumB, setPageNum] = useState(-1);
  const [oldSearch, setOldSearchStr] = useState("");

  const bricksPerPage = 6;

  const getAndSetBricks = (sIds: number[]) => {
    console.log('get and set bricks', sIds, pageNum);
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

  const search = (subjectIdsV3: number[]) => {
    searchPaginateBricks(searchString, pageNum, bricksPerPage, isCore).then(data => {
      if (data) {
        console.log(data);
        setResults(prev => [...prev, ...data.bricks]);
        setHasNextPage(data.pageCount - ((pageNum + 1) * bricksPerPage) >= 0);
        setData(data);
        setIsLoading(false)
      } else {
        setIsLoading(false);
        setHasNextPage(false);
        setIsError(true);
      }
    });
  }

  useEffect(() => {
    // if not searching
    const subjectIds = subjects.map(s => s.id);
    const subject2Ids = subjectsB.map(s => s.id);

    let isModified = subjectIds.length !== subject2Ids.length;
    let isSearching = false;
    if (searchString && searchString.length >= 3) {
      isSearching = true;
      if (searchString != oldSearch) {
        console.log('modified');
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

    if (!isModified) {
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
      if (isSearching) {
        search(subjectIds);
      } else {
        getAndSetBricks(subjectIds);
      }
      setPageNum(pageNum);
    } else {
      if (pageNumB != pageNum) {
        setIsLoading(true);
        setIsError(false);
        setError({});

        const sIds = subjects.map(s => s.id);

        if (isSearching) {
          search(sIds);
        } else {
          getAndSetBricks(sIds);
        }
        setPageNum(pageNum);
      }
    }
  }, [pageNum, subjects, searchString])

  useEffect(() => {
  }, [searchString])

  return { isLoading, isError, error, results, hasNextPage, data }
}

export default useBricks;

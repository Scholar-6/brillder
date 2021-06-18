import queryString from 'query-string';
import { Brick, BrickStatus, Subject, SubjectItem } from "model/brick";

export const getCheckedSubjectIds = (subjects: Subject[]) => {
  const filterSubjects = [];
  for (let subject of subjects) {
    if (subject.checked) {
      filterSubjects.push(subject.id);
    }
  }
  return filterSubjects;
}

export const filterBySubjects = (bricks: Brick[], filterSubjectIds: number[]) => {
  let filtered = [];
  for (let brick of bricks) {
    let res = filterSubjectIds.indexOf(brick.subjectId);
    if (res !== -1) {
      filtered.push(brick);
    }
  }
  return filtered;
}

export const sortByDate = (bricks: Brick[]) => {
  return bricks.sort((a, b) => {
    const createdA = new Date(a.created).getTime();
    const createdB = new Date(b.created).getTime();
    return createdA < createdB ? 1 : -1;
  });
}

export const sortByPopularity = (bricks: Brick[]) => {
  return bricks.sort((a, b) => a.attemptsCount > b.attemptsCount ? 1 : -1);
}

export const removeByIndex = (bricks: Brick[], brickId: number) => {
  let brick = bricks.find(brick => brick.id === brickId);
  if (brick) {
    let index = bricks.indexOf(brick);
    bricks.splice(index, 1);
  }
}

export const getCheckedSubjects = (subjects: SubjectItem[]) => {
  const filterSubjects = [];
  for (let subject of subjects) {
    if (subject.checked) {
      filterSubjects.push(subject);
    }
  }
  return filterSubjects;
}

export const sortAndFilterBySubject = (bricks: Brick[], filterSubjects: number[]) => {
  const filtered = filterBySubjects(bricks, filterSubjects);
  sortBySubjectId(filtered, filterSubjects);
  return filtered;
}

export const filterSearchBricks = (searchBricks: Brick[], isCore: boolean) => {
  if (isCore) {
    return searchBricks.filter(b => b.isCore);
  } else {
    return searchBricks.filter(b => !b.isCore);
  }
}

export const sortAndCheckSubjects = (subjects: Subject[], values: queryString.ParsedQuery<string>) => {
  subjects.sort((s1, s2) => s1.name.localeCompare(s2.name));
  subjects.forEach(s => {
    if (values.subjectId) {
      if (s.id === parseInt(values.subjectId as string || '')) {
        s.checked = true;
      }
    }
  });
  if (values.subjectIds) {
    const subjectIds = values.subjectIds as string;
    const idsArray = subjectIds.split(',');
    subjects.forEach(s => {
      for (const id of idsArray) {
        if (s.id === parseInt(id)) {
          s.checked = true;
        }
      }
    });
  }
}

export const prepareYourBricks = (currentBricks: Brick[]) => {
  let yourBricks = currentBricks.filter(brick => brick.status === BrickStatus.Publish);
  return yourBricks.sort((a, b) => (new Date(b.updated).getTime() < new Date(a.updated).getTime()) ? -1 : 1);
}

export const sortAllBricks = (bricks: Brick[]) => {
  let bs = bricks.sort((a, b) => (new Date(b.updated).getTime() < new Date(a.updated).getTime()) ? -1 : 1);
  bs = bs.sort((a, b) => (b.hasNotifications === true && new Date(b.updated).getTime() > new Date(a.updated).getTime()) ? -1 : 1);
  return bs;
}

export const countSubjectBricks = (subjects: any[], bricks: Brick[]) => {
  subjects.forEach((s: any) => {
    s.publicCount = 0;
    s.personalCount = 0;
  });
  for (let b of bricks) {
    for (let s of subjects) {
      if (s.id === b.subjectId) {
        if (b.isCore) {
          s.publicCount += 1;
        } else {
          s.personalCount += 1;
        }
      }
    }
  }
}

/**
  * Sort bricks by subjects. Order is based on list of filterSubjectIds
  */
export const sortBySubjectId = (bricks: Brick[], filterSubjectIds: number[]) => {
  bricks.sort((a, b) => {
    if (a.subject && b.subject) {
      let res1 = 0;
      let res2 = 0;

      let count = 0;
      for (let subjectId of filterSubjectIds) {
        if (a.subject.id === subjectId) {
          res1 = count;
        }
        if (b.subject.id === subjectId) {
          res2 = count;
        }
        count += 1;
      }
      return res1 - res2;
    }
    return 0;
  });
}

export const toggleSubject = (subjects: Subject[], id: number) => {
  const subject = subjects.find(s => s.id === id);
  if (subject) {
    subject.checked = !subject?.checked;
  }
}

export const hideBricks = (bricks: Brick[]) => {
  bricks.forEach(b => (b.expanded = false));
}

export const expandBrick = (bricks: Brick[], index: number) => {
  if (bricks[index]) {
    bricks[index].expanded = true;
  }
}

export const renderTitle = (bricks: Brick[]) => {
  const {length} = bricks;
  if (length === 1) {
    return '1 brick found';
  }
  return length + ' bricks found';
}

export const prepareVisibleBricks = (
  sortedIndex: number,
  pageSize: number,
  bricks: Brick[]
) => {
  let data: any[] = [];
  let count = 0;
  for (let i = 0 + sortedIndex; i < pageSize + sortedIndex; i++) {
    const brick = bricks[i];
    if (brick) {
      let row = Math.floor(count / 3);
      data.push({ brick, key: i, index: count, row });
      count++;
    }
  }
  return data;
}

export const prepareUserSubjects = (subjects: SubjectItem[], userSubjects: Subject[]) => {
  const ss = [];
  for (let subject of userSubjects) {
    for (let s of subjects) {
      if (s.id === subject.id) {
        ss.push(s);
      }
    }
  }
  subjects.sort((s1, s2) => s2.publicCount - s1.publicCount);
  return getCheckedSubjectIds(subjects);
}

export const onlyPrepareUserSubjects = (subjects: SubjectItem[], userSubjects: Subject[]) => {
  const ss = [];
  for (let subject of userSubjects) {
    for (let s of subjects) {
      if (s.id === subject.id) {
        ss.push(s);
      }
    }
  }
  subjects.sort((s1, s2) => s2.publicCount - s1.publicCount);
  return ss;
}
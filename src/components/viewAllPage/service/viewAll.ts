import queryString from 'query-string';
import { AcademicLevel, Brick, BrickLengthEnum, Subject, SubjectItem } from "model/brick";
import { User } from 'model/user';

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

export const renderTitle = (bricksCount: number) => {
  if (bricksCount === 1) {
    return '1 brick found';
  }
  return bricksCount + ' bricks found';
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

export const prepareVisibleBricks2 = (
  bricks: Brick[]
) => {
  let data: any[] = [];
  let count = 0;
  for (let i = 0; i < bricks.length; i++) {
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

/**
 * Phone filters
 * @param arr array with values
 * @param value value
 * @returns array with filtered value
 */
export const toggleElement = (arr: any[], value: any) => {
  const found = arr.find((l) => l === value);
  if (found) {
    arr = arr.filter((l) => l !== value);
  } else {
    arr.push(value);
  }
  return arr;
}

/**
 * Check if brick is visible by level
 * @param brick Brick
 * @param levels array of numeric levels
 * @returns true if present if level is in array, false if not. if array empty than true.
 */
export const isLevelVisible = (brick: Brick, levels: AcademicLevel[]) => {
  if (levels.length > 0) {
    return !!levels.find(l => l === brick.academicLevel);
  }
  return true;
}

/**
 * Check if brick is visible by length
 * @param brick Brick
 * @param levels array of numeric length in minutes
 * @returns true if present if length is in array, false if not. if array empty than true.
 */
export const isLengthVisible = (brick: Brick, lengths: BrickLengthEnum[]) => {
  if (lengths.length > 0) {
    return !!lengths.find(l => l === brick.brickLength);
  }
  return true;
}


export const filterSubjectsByCurrentUser = (subjects: SubjectItem[], user: User) => {
  let resSubjects = [];
  for (let subject of user.subjects) {
    for (let s of subjects) {
      if (s.id === subject.id) {
        resSubjects.push(s);
      }
    }
  }
  return resSubjects;
}

export const getPersonalSubjectsWithBricks = (subjects: SubjectItem[], user: User, isAllSubjects: boolean) => {
  let filteredSubjects = subjects.filter(
    (s) => s.personalCount && s.personalCount > 0
  );
  if (!isAllSubjects) {
    filteredSubjects = filterSubjectsByCurrentUser(filteredSubjects, user);
  }
  return filteredSubjects;
}

export const getPublicSubjectsWithBricks = (subjects: SubjectItem[], user: User, isAllSubjects: boolean) => {
  let filteredSubjects = subjects.filter((s) => s.publicCount > 0);
  if (!isAllSubjects) {
    filteredSubjects = filterSubjectsByCurrentUser(filteredSubjects, user);
  }
  return filteredSubjects;
}

export const getSubjectsWithBricks = (subjects: SubjectItem[], user: User, isCore: boolean, isAllSubjects: boolean) => {
  let filteredSubjects: SubjectItem[] = [];
  if (!user) {
    filteredSubjects = subjects.filter((s) => s.publicCount > 0);
  } else {
    if (isCore) {
      filteredSubjects = getPublicSubjectsWithBricks(filteredSubjects, user, isAllSubjects);
    } else {
      filteredSubjects = getPersonalSubjectsWithBricks(filteredSubjects, user, isAllSubjects);
    }
  }
  return filteredSubjects;
}

/**
  * Check all subjects based on isCore.
  */
export const checkAllSubjects = (subjects: SubjectItem[], isCore: boolean) => {
  if (isCore) {
    subjects.forEach((s) => {
      if (s.publicCount > 0) {
        s.checked = true;
      } else {
        s.checked = false;
      }
    });
  } else {
    subjects.forEach((s) => {
      if (s.personalCount && s.personalCount > 0) {
        s.checked = true;
      } else {
        s.checked = false;
      }
    });
  }
}

export const checkAssignment = (brick: Brick, user: User | undefined) => {
  if (brick.assignments) {
    for (let assignmen of brick.assignments) {
      let assignment = assignmen as any;

      if (assignment && assignment.stats) {
        for (let student of assignment?.stats?.byStudent) {
          if (student.studentId === user?.id) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
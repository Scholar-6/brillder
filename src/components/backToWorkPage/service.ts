import { AcademicLevel, Brick, BrickStatus } from 'model/brick';
import { SortBy, Filters, ThreeColumns } from './model';

const getBrickById = (bricks: Brick[], brickId: number) => {
  return bricks.find(b => b.id === brickId);
}

export const removeBrickFromList = (bricks: Brick[], brickId: number) => {
  let brick = getBrickById(bricks, brickId);
  if (brick) {
    let index = bricks.indexOf(brick);
    if (index >= 0) {
      bricks.splice(index, 1);
    }
  }
}

export const removeBrickFromLists = (rawBricks: Brick[], finalBricks: Brick[], threeColumns: ThreeColumns, brickId: number) => {
  removeBrickFromList(finalBricks, brickId);
  removeBrickFromList(rawBricks, brickId);

  const { red, yellow, green } = threeColumns;
  removeBrickFromList(green.finalBricks, brickId);
  removeBrickFromList(green.rawBricks, brickId);
  removeBrickFromList(red.finalBricks, brickId);
  removeBrickFromList(red.rawBricks, brickId);
  removeBrickFromList(yellow.finalBricks, brickId);
  removeBrickFromList(yellow.rawBricks, brickId);
}

export const filterByStatus = (bricks: Brick[], status: BrickStatus) => {
  return bricks.filter(b => b.status === status);
}

export const isEditor = (b: Brick, userId: number) => {
  return (b.editors?.findIndex((e:any) => e.id === userId) ?? -1) >= 0;
}

export const filterByEditor = (bricks: Brick[], userId: number) => {
  return bricks.filter(b => (b.status === BrickStatus.Draft || b.status === BrickStatus.Build || b.status === BrickStatus.Review) && isEditor(b, userId));
}

export const filterByNoEditor = (bricks: Brick[], userId: number) => {
  return bricks.filter(b => (b.status === BrickStatus.Draft || b.status === BrickStatus.Build || b.status === BrickStatus.Review) && !isEditor(b, userId));
}

export const filterByCurretUser = (bricks: Brick[], userId: number) => {
  return bricks.filter(b => b.author.id === userId);
}

export const filterByLevels = (bricks: Brick[], levels: AcademicLevel[]) => {
  return bricks.filter(b => {
    const found = levels.find(l => b.academicLevel == l);
    return !!found;
  });
}

export const checkPrivateBrick = (b: Brick) => {
  return !b.isCore;
}

export const filterByPrivate = (bricks: Brick[]) => {
  return bricks.filter(b => checkPrivateBrick(b));
}

export const checkCoreBrick = (b: Brick) => {
  return b.isCore === true;
}

export const filterByCore = (bricks: Brick[]) => {
  return bricks.filter(b => checkCoreBrick(b));
}

export const filterBricks = (filters: Filters, rawBricks: Brick[], userId: number): Brick[] => {
  let filteredBricks: Brick[] = [];
  let bricks = Object.assign([], rawBricks) as Brick[];

  if (!filters.isCore) {
    bricks = filterByPrivate(bricks);
  } else {
    bricks = filterByCore(bricks);
  }

  if (filters.draft) {
    filteredBricks.push(...filterByStatus(bricks, BrickStatus.Draft));
  }
  if (filters.build) {
    filteredBricks.push(...filterByStatus(bricks, BrickStatus.Build));
  }
  if (filters.review) {
    filteredBricks.push(...filterByStatus(bricks, BrickStatus.Review));
  }
  if (filters.publish) {
    filteredBricks.push(...filterByStatus(bricks, BrickStatus.Publish));
  }

  return filteredBricks;
}

export const sortByDate = (a: Brick, b: Brick) => {
  const createdA = new Date(a.updated).getTime();
  const createdB = new Date(b.updated).getTime();
  return createdA > createdB ? 1 : -1;
}

export const sortByStatus = (a: Brick, b: Brick) => a.status > b.status ? 1 : -1;

export const sortByPopularity = (a: Brick, b: Brick) => a.attemptsCount > b.attemptsCount ? 1 : -1;

export const sortBricks = (bricks: Brick[], sortBy: SortBy) => {
  let finalBricks = Object.assign([], bricks) as Brick[];
  if (sortBy === SortBy.Date) {
    finalBricks = finalBricks.sort(sortByDate);
  } else if (sortBy === SortBy.Status) {
    finalBricks = finalBricks.sort(sortByStatus);
  } else if (sortBy === SortBy.Popularity) {
    finalBricks = finalBricks.sort(sortByPopularity);
  }
  return finalBricks;
}

export const hideBricks = (bricks: Brick[]) => bricks.forEach(b => b.expanded = false);

export const expandSearchBrick = (bricks: Brick[], index: number) => {
  hideBricks(bricks);
  if (!bricks[index].expandFinished) {
    bricks[index].expanded = true;
  }
}

export const expandBrick = (bricks: Brick[], allBricks: Brick[], index: number) => {
  hideBricks(allBricks);
  if (!bricks[index].expandFinished) {
    bricks[index].expanded = true;
  }
}

export const clearStatusFilters = (filters: Filters) => {
  filters.draft = false;
  filters.review = false;
  filters.publish = false;
  filters.build = false;
}

export const removeAllFilters = (filters: Filters) => {
  clearStatusFilters(filters);
}

export const prepareVisibleBricks = (sortedIndex: number, pageSize: number, bricks: Brick[]) => {
  let data: any[] = [];
  let count = 0;
  for (let i = 0 + sortedIndex; i < pageSize + sortedIndex; i++) {
    const brick = bricks[i];
    if (brick) {
      let row = Math.floor(count / 3);
      data.push({ brick, key: i, index: count, row, isCreateLink: brick.isCreateLink });
      count++;
    }
  }
  return data;
}

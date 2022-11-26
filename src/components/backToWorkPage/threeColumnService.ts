import { Brick, BrickStatus } from 'model/brick';
import { ThreeColumns, Filters, ThreeColumnNames } from './model';
import {filterByStatus, filterByPrivate, filterByCore } from './service';

const prepareBrickData = (data: any[], brick: Brick, index: number, key: number, row: number) => {
  data.push({ brick: brick, key, index, row });
}

const setColumnBricksByStatus = (
  res: ThreeColumns, filters: Filters, userId: number,
  name: ThreeColumnNames, bricks: Brick[], status: BrickStatus
) => {
  let bs = filterByStatus(bricks, status);
  let finalBs = [];
  if (!filters.isCore) {
    finalBs = filterByPrivate(bs);
  } else {
    finalBs = filterByCore(bs);
  }
  finalBs = finalBs.sort(b => (b.editors && b.editors.find(e => e.id === userId)) ? -1 : 1);
  res[name] = { rawBricks: bs, finalBricks: finalBs };
}

export const getLongestColumn = (threeColumns: any) => {
  const draftLength = threeColumns.red.count;
  const reviewLength = threeColumns.yellow.count;
  const publishLenght = threeColumns.green.count;
  return Math.max(draftLength, reviewLength, publishLenght);
}

export const getThreeColumnName = (status: BrickStatus) => {
  let name = ThreeColumnNames.Red;
  if (status === BrickStatus.Review) {
    name = ThreeColumnNames.Green;
  } else if (status === BrickStatus.Build) {
    name = ThreeColumnNames.Yellow;
  }
  return name;
}

export const getThreeColumnBrick = (threeColumns: ThreeColumns, name: ThreeColumnNames, key: number) => {
  return threeColumns[name].finalBricks[key];
}

export const expandThreeColumnBrick = (threeColumns: ThreeColumns, name: ThreeColumnNames, key: number) => {
  let brick = getThreeColumnBrick(threeColumns, name, key);
  if (brick && !brick.expandFinished) {
    brick.expanded = true;
  }
}

export const prepareTreeRows = (bricks: Brick[], filters: Filters, userId: number) => {
  let threeColumns = {} as ThreeColumns;
  if (filters) {
    setColumnBricksByStatus(threeColumns, filters, userId, ThreeColumnNames.Red, bricks, BrickStatus.Draft);
    setColumnBricksByStatus(threeColumns, filters, userId, ThreeColumnNames.Yellow, bricks, BrickStatus.Build);
    setColumnBricksByStatus(threeColumns, filters, userId, ThreeColumnNames.Green, bricks, BrickStatus.Review);
    threeColumns.red.finalBricks.unshift({isCreateLink: true} as Brick);
  }
  return threeColumns;
}

export const prepareVisibleThreeColumnBricks = (threeColumns: any, loaded: boolean) => {
  let data: any[] = [];
  let count = 0;

  const isFirstEmpty = threeColumns.red.count === 0;
  const isSecondEmpty = threeColumns.yellow.count === 0;
  const isThirdEmpty = threeColumns.green.count === 0;

  if (loaded) {
    if (isFirstEmpty) {
      prepareBrickData(data, { isEmptyColumn: true, columnStatus: BrickStatus.Draft } as Brick, 0, -5, 0);
    } else {
      prepareBrickData(data, { } as Brick, 0, -5, 0);
    }

    if (isSecondEmpty) {
      prepareBrickData(data, {isEmptyColumn: true, columnStatus: BrickStatus.Build } as Brick, 0, -6, 0);
    } else {
      prepareBrickData(data, { } as Brick, 0, -6, 0);
    }

    if (isThirdEmpty) {
      prepareBrickData(data, {isEmptyColumn: true, columnStatus: BrickStatus.Review } as Brick, 0, -7, 0);
    } else {
      prepareBrickData(data, { } as Brick, 0, -7, 0);
    }
  }

  for (let i = 0; i < 5; i++) {
    let brick = threeColumns.red.finalBricks[i];
    
    if (brick) {
      prepareBrickData(data, brick, i, count, 1);
    } else {
      prepareBrickData(data, {} as Brick, i, count, 1);
    }
    count++;
    brick = threeColumns.yellow.finalBricks[i];
    if (brick) {
      prepareBrickData(data, brick, i, count, 1);
    } else {
      prepareBrickData(data, {} as Brick, i, count, 1);
    }
    count++;
    brick = threeColumns.green.finalBricks[i];
    if (brick) {
      prepareBrickData(data, brick, i, count, 1);
    } else {
      prepareBrickData(data, {} as Brick, i, count, 1);
    }
    count++;
  }
  return data;
}

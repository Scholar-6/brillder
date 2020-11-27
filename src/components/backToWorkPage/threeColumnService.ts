import { Brick, BrickStatus } from 'model/brick';
import { AssignmentBrick } from 'model/assignment';
import { ThreeColumns, ThreeAssignmentColumns, Filters, ThreeColumnNames, AssignmentBrickData } from './model';
import {filterByStatus, filterByPrivate, filterByCore } from './service';

const prepareBrickData = (data: any[], brick: Brick, index: number, key: number, row: number) => {
  data.push({ brick: brick, key, index, row });
}

const prepareAssignmentData = (data: any[], assignment: AssignmentBrick, index: number, key: number, row: number) => {
  data.push({
    brick: assignment.brick, key, index, row, assignmentId: assignment.id, status: assignment.status, isInvitation: assignment.isInvitation
  } as AssignmentBrickData);
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

export const getLongestColumn = (threeColumns: ThreeColumns) => {
  const draftLength = threeColumns.red.finalBricks.length;
  const reviewLength = threeColumns.yellow.finalBricks.length;
  const publishLenght = threeColumns.green.finalBricks.length;
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

export const prepareVisibleThreeColumnBricks = (pageSize: number, sortedIndex: number, threeColumns: ThreeColumns, loaded: boolean) => {
  let data: any[] = [];
  let count = 0;

  const isFirstEmpty = threeColumns.red.finalBricks.length === 0;
  const isSecondEmpty = threeColumns.yellow.finalBricks.length === 0;
  const isThirdEmpty = threeColumns.green.finalBricks.length === 0;

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

  for (let i = 0 + sortedIndex; i < (pageSize / 3) + sortedIndex; i++) {
    let brick = threeColumns.red.finalBricks[i];
    let row = i - sortedIndex + 1;
    
    if (brick) {
      prepareBrickData(data, brick, i, count, row);
    } else {
      prepareBrickData(data, {} as Brick, i, count, row);
    }
    count++;
    brick = threeColumns.yellow.finalBricks[i];
    if (brick) {
      prepareBrickData(data, brick, i, count, row);
    } else {
      prepareBrickData(data, {} as Brick, i, count, row);
    }
    count++;
    brick = threeColumns.green.finalBricks[i];
    if (brick) {
      prepareBrickData(data, brick, i, count, row);
    } else {
      prepareBrickData(data, {} as Brick, i, count, row);
    }
    count++;
  }
  return data;
}

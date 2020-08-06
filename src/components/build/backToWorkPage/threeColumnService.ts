import { Brick, BrickStatus } from '../../../model/brick';
import { ThreeColumns, Filters, ThreeColumnNames } from './model';
import {filterByStatus, filterByCurretUser, removeBrickFromList } from './service';

const prepareBrickData = (data: any[], brick: Brick, index: number, key: number, row: number) => {
  data.push({ brick: brick, key, index, row });
}

const setColumnBricksByStatus = (res: ThreeColumns, filters: Filters, userId: number, name: ThreeColumnNames, bricks: Brick[], status: BrickStatus) => {
  let bs = filterByStatus(bricks, status);
  if (!filters.isCore) {
    bs = filterByCurretUser(bs, userId);
  }
  res[name] = { rawBricks: bs, finalBricks: bs };
}

export const getLongestColumn = (threeColumns: ThreeColumns) => {
  let draftLength = threeColumns.draft.finalBricks.length;
  let reviewLength = threeColumns.review.finalBricks.length;
  let publishLenght = threeColumns.publish.finalBricks.length;
  return Math.max(draftLength, reviewLength, publishLenght);
}

export const getThreeColumnName = (status: BrickStatus) => {
  let name = ThreeColumnNames.Draft;
  if (status === BrickStatus.Publish) {
    name = ThreeColumnNames.Publish;
  } else if (status === BrickStatus.Review) {
    name = ThreeColumnNames.Review;
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
    setColumnBricksByStatus(threeColumns, filters, userId, ThreeColumnNames.Draft, bricks, BrickStatus.Draft);
    setColumnBricksByStatus(threeColumns, filters, userId, ThreeColumnNames.Review, bricks, BrickStatus.Review);
    setColumnBricksByStatus(threeColumns, filters, userId, ThreeColumnNames.Publish, bricks, BrickStatus.Publish);
  }
  return threeColumns;
}

export const prepareVisibleThreeColumnBricks = (pageSize: number, sortedIndex: number, threeColumns: ThreeColumns,) => {
  let data: any[] = [];
  let count = 0;

  for (let i = 0 + sortedIndex; i < (pageSize / 3) + sortedIndex; i++) {
    let brick = threeColumns.draft.finalBricks[i];
    let row = i - sortedIndex;
    if (brick) {
      prepareBrickData(data, brick, i, count, row);
      count++;
    } else {
      prepareBrickData(data, {} as Brick, i, count, row);
      count++;
    }
    brick = threeColumns.review.finalBricks[i];
    if (brick) {
      prepareBrickData(data, brick, i, count, row);
      count++;
    } else {
      prepareBrickData(data, {} as Brick, i, count, row);
      count++;
    }
    brick = threeColumns.publish.finalBricks[i];
    if (brick) {
      prepareBrickData(data, brick, i, count, row);
      count++;
    } else {
      prepareBrickData(data, {} as Brick, i, count, row);
      count++;
    }
  }
  return data;
}

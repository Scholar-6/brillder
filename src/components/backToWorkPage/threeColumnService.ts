import { Brick, BrickStatus } from 'model/brick';
import { ThreeColumns, ThreeColumnNames } from './model';

const prepareBrickData = (data: any[], brick: Brick, index: number, key: number, row: number) => {
  data.push({ brick: brick, key, index, row });
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

export const prepareVisibleThreeColumnBricks = (page: number, threeColumns: any, loaded: boolean) => {
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

  let redBricks = [...threeColumns.red.finalBricks]

  if (page === 0) {
    redBricks.unshift({isCreateLink: true} as Brick);
  }

  for (let i = 0; i < 5; i++) {
    let brick = redBricks[i];
    
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

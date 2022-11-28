import { Brick, BrickStatus } from 'model/brick';
import { ThreeColumns, ThreeColumnNames } from './model';

const prepareBrickData = (data: any[], brick: Brick, index: number, key: number, row: number) => {
  data.push({ brick: brick, key, index, row });
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

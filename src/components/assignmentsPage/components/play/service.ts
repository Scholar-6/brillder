import { AssignmentBrick, AssignmentBrickStatus } from 'model/assignment';
import { ThreeAssignmentColumns, ThreeColumnNames } from '../../model';
import { checkPrivateBrick, checkCoreBrick } from '../../service';

export const getLongestColumn = (threeColumns: ThreeAssignmentColumns) => {
  const draftLength = threeColumns.red.finalAssignments.length;
  const reviewLength = threeColumns.yellow.finalAssignments.length;
  const publishLenght = threeColumns.green.finalAssignments.length;
  return Math.max(draftLength, reviewLength, publishLenght);
}

export const hideAssignments = (assignments: AssignmentBrick[]) => {
  return assignments.forEach(a => a.brick.expanded = false);
}

export const filterAssignmentByStatus = (bricks: AssignmentBrick[], status: AssignmentBrickStatus) => {
  return bricks.filter(b => b.status === status);
}

const setColumnAssignmentByStatus = (
  res: ThreeAssignmentColumns,
  name: ThreeColumnNames,
  bricks: AssignmentBrick[],
  status: AssignmentBrickStatus
) => {
  let bs = filterAssignmentByStatus(bricks, status);
  res[name] = { rawAssignments: bs, finalAssignments: bs };
}

export const prepareThreeAssignmentRows = (assignments: AssignmentBrick[]) => {
  let threeColumns = {} as ThreeAssignmentColumns;
  setColumnAssignmentByStatus(threeColumns, ThreeColumnNames.Red, assignments, AssignmentBrickStatus.ToBeCompleted);
  setColumnAssignmentByStatus(threeColumns, ThreeColumnNames.Yellow, assignments, AssignmentBrickStatus.SubmitedToTeacher);
  setColumnAssignmentByStatus(threeColumns, ThreeColumnNames.Green, assignments, AssignmentBrickStatus.CheckedByTeacher);
  return threeColumns;
}

export const getPlayThreeColumnBrick = (threeColumns: ThreeAssignmentColumns, name: ThreeColumnNames, key: number) => {
  return threeColumns[name].finalAssignments[key];
}

export const expandPlayThreeColumnBrick = (threeColumns: ThreeAssignmentColumns, name: ThreeColumnNames, key: number) => {
  let assignment = getPlayThreeColumnBrick(threeColumns, name, key);
  if (assignment && !assignment.expandFinished) {
    assignment.brick.expanded = true;
  }
}

export const getPlayThreeColumnName = (status: AssignmentBrickStatus) => {
  let name = ThreeColumnNames.Red;
  if (status === AssignmentBrickStatus.CheckedByTeacher) {
    name = ThreeColumnNames.Green;
  } else if (status === AssignmentBrickStatus.SubmitedToTeacher) {
    name = ThreeColumnNames.Yellow;
  }
  return name;
}

const filterByPrivate = (assignments: AssignmentBrick[]) => {
  return assignments.filter(a => checkPrivateBrick(a.brick));
}

const filterByCore = (assignments: AssignmentBrick[]) => {
  return assignments.filter(a => checkCoreBrick(a.brick));
}

export const filterAssignments = (rawAssignments: AssignmentBrick[], isCore: boolean) => {
  let filteredAssignemnts = Object.assign([], rawAssignments) as AssignmentBrick[];
  if (!isCore) {
    filteredAssignemnts = filterByPrivate(filteredAssignemnts);
  } else {
    filteredAssignemnts = filterByCore(filteredAssignemnts);
  }
  return filteredAssignemnts;
}

export default {
  prepareThreeAssignmentRows,
  expandPlayThreeColumnBrick,
  getPlayThreeColumnBrick,
  getPlayThreeColumnName,
  filterAssignments
}

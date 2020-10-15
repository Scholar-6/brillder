import _ from 'lodash';
import { Brick } from 'model/brick';

export type Diff<T> = any;

export type DoubleDiff<T> = {
    forward: Diff<T>;
    backward: Diff<T>;
}

export type BrickDiff = Diff<Brick>;
export type DoubleBrickDiff = DoubleDiff<Brick>;

export const getBrickDiff = (oldBrick: Brick, newBrick: Brick): BrickDiff => {
    return getDiff(oldBrick, newBrick);
};

export const getDoubleBrickDiff = (oldBrick: Brick, newBrick: Brick): DoubleBrickDiff => {
    return {
        forward: getDiff(oldBrick, newBrick),
        backward: getDiff(newBrick, oldBrick)
    };
};

export const getDiff = <T>(oldObj: T, newObj: T): Diff<T> => {
    let diffObj: any = {};

    for (let key of _.union(Object.keys(oldObj), Object.keys(newObj)) as [keyof T]) {
        if (oldObj[key] !== newObj[key]) { // if the properties aren't the same
            if (typeof oldObj[key] !== "undefined" && typeof newObj[key] === "undefined") { // the property was removed...
                diffObj[key] = null;
            } else if (typeof oldObj[key] === "object" && typeof newObj[key] === "object") {
                diffObj[key] = getDiff(oldObj[key], newObj[key]);
            } else { // the property was added or changed...
                diffObj[key] = newObj[key];
            }
        }
    }

    return diffObj;
};

export const applyBrickDiff = (brick: Brick, diff: any) => {
    return applyDiff(brick, diff);
};

export const applyDiff = (obj: any, diff: any) => {
    if (!diff) return obj;

    let newObj;
    if (Array.isArray(obj)) {
        newObj = [...obj];
    } else {
        newObj = { ...obj };
    }

    for (let key of Object.keys(diff)) {
        if (diff[key] === null || typeof diff[key] === "undefined") {
            if (Array.isArray(newObj)) {
                newObj[key as any] = undefined;
            } else {
                delete newObj[key];
            }
        } else if (typeof diff[key] === "object") {
            if (key in obj) {
                newObj[key] = applyDiff(obj[key], diff[key])
            } else {
                newObj[key] = diff[key];
            }
        } else {
            newObj[key] = diff[key];
        }
    }

    if (Array.isArray(newObj)) {
        newObj = newObj.filter(item => item);
    }

    return newObj;
}
import _ from 'lodash';
import { Brick } from 'model/brick';

export const getBrickDiff = (oldBrick: Brick, newBrick: Brick) => {
    return getDiff(oldBrick, newBrick);
};

export const getDiff = (oldObj: any, newObj: any) => {
    let diffObj: any = {};

    for (let key of _.union(Object.keys(oldObj), Object.keys(newObj))) {
        if (oldObj[key] !== newObj[key]) { // if the properties aren't the same
            if (typeof oldObj[key] !== "undefined" && typeof newObj[key] === "undefined") { // the property was removed...
                diffObj[key] = undefined;
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
        if (typeof diff[key] === "object") {
            if (key in obj) {
                newObj[key] = applyDiff(obj[key], diff[key])
            } else {
                newObj[key] = diff[key];
            }
        } else if (typeof diff[key] === "undefined") {
            if (Array.isArray(newObj)) {
                newObj[key as any] = undefined;
            } else {
                delete newObj[key];
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
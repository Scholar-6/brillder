import { Brick } from 'model/brick';
import { diff } from 'deep-object-diff';

export const getBrickDiff = (oldBrick: Brick, newBrick: Brick) => {
    return getDiff(oldBrick, newBrick);
};

export const getDiff = (oldObj: any, newObj: any) => diff(oldObj, newObj);

export const applyBrickDiff = (brick: Brick, diff: any) => {
    return applyDiff(brick, diff);
};

export const applyDiff = (obj: any, diff: any) => {
    let newObj = obj;

    for (let key of Object.keys(diff)) {
        if (typeof diff[key] === "object") {
            if (key in obj) {
                applyDiff(obj[key], diff[key])
            } else {
                newObj[key] = diff[key];
            }
        } else if (typeof diff[key] === "undefined") {
            if (Array.isArray(obj)) {
                newObj = newObj.splice(key as any, 1);
            } else {
                delete newObj[key];
            }
        } else {
            newObj[key] = diff[key];
        }
    }

    return newObj;
}
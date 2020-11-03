import { Brick } from "model/brick";

export function getBrickColor(brick: Brick) {
  let color = "";
  if (!brick.subject) {
    color = "#B0B0AD";
  } else {
    color = brick.subject.color;
  }
  return color;
}

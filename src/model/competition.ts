import { Brick } from "./brick";

export interface Competition {
  id: number;
  brick: Brick;
  startDate: any;
  endDate: any;
  isActive?: boolean;
}
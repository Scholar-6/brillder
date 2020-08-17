import { User } from "model/user";
import { ClassroomApi } from "./service";

export interface MUser extends User {
  selected: boolean;
  studyClassrooms: ClassroomApi[];
}

import axios from "axios";

import { Subject } from "../../model/brick";

export interface SubjectsResult {
  data: Subject[];
}

export const loadSubjects = (callBack: Function) => {
  let dd = axios.get(
    process.env.REACT_APP_BACKEND_HOST + '/subjects', {withCredentials: true}
  ).then((res: SubjectsResult) => {
    callBack(res.data);
  }).catch(error => {
    alert('Can`t get subjects');
  });
}

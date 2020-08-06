import axios from "axios";

import { Subject } from "../../model/brick";

export interface SubjectsResult {
  data: Subject[];
}

export const loadSubjects = () => {
  return axios.get(
    process.env.REACT_APP_BACKEND_HOST + '/subjects', {withCredentials: true}
  ).then((res: SubjectsResult) => {
    return res.data;
  }).catch(error => {
    alert('Can`t get subjects');
    return null;
  });
}

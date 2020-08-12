import axios from "axios";

export const saveProfileImageName = (userId: number, name: string) => {
  return axios.put(
    `${process.env.REACT_APP_BACKEND_HOST}/user/profileImage/${userId}/${name}`, {}, { withCredentials: true }
  ).then((res: any) => {
    if (res.data === "OK") {
      return true;
    }
    return false;
  }).catch(error => {
    return false;
  });
}

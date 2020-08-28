import axios from "axios";

export const get = async <T>(path: string) => {
  let res = await axios.get(process.env.REACT_APP_BACKEND_HOST + path, {
    withCredentials: true,
  });
  if (res.data) {
    return res.data as T;
  }
  return null;
}

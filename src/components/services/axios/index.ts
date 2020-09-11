import axios from "axios";

export const get = async <T>(path: string) => {
  const res = await axios.get(process.env.REACT_APP_BACKEND_HOST + path, {
    withCredentials: true,
  });
  if (res.data) {
    return res.data as T;
  }
  return null;
}

export const post = async <T>(path: string, params: any) => {
  const res = await axios.post(
    process.env.REACT_APP_BACKEND_HOST + path,
    params,
    { withCredentials: true }
  );
  if (res.data) {
    return res.data as T;
  }
  return null;
}

export const put = async <T>(path: string, params: any) => {
  const res = await axios.put(
    process.env.REACT_APP_BACKEND_HOST + path,
    params,
    { withCredentials: true }
  );
  if (res.data) {
    return res.data as T;
  }
  return null;
}

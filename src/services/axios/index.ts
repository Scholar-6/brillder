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

export const axiosDelete = async (path: string) => {
  const res = await axios.delete(process.env.REACT_APP_BACKEND_HOST + path, {
    withCredentials: true,
  });
  if (res.status === 200) {
    return true;
  }
  return false;
}


export const del = async (path: string) => {
  const res = await axios.delete(process.env.REACT_APP_BACKEND_HOST + path, {
    withCredentials: true,
  });
  if (res.status === 200) {
    return true;
  }
  return false;
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

export const postRes = async (path: string, params: any) => {
  return await axios.post(
    process.env.REACT_APP_BACKEND_HOST + path,
    params,
    { withCredentials: true }
  );
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

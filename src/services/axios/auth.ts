import {post} from './index';


export const login = async (email: string, password: string) => {
  try {
    return await post<any>(`/auth/login/3`, { email, password, userType: 3 });
  } catch (e) {
    e.isError = true;
    return e;
  }
}

export const libraryLogin = async (libraryId: number, patronId: string, pin: string) => {
  try {
    return await post<any>(`/auth/library/login`, { libraryId, patronId, pin });
  } catch (e) {
    e.isError = true;
    return e;
  }
}


export default {
  login,
  libraryLogin
}

import {get, put, post} from './index';

import { User, UserType } from 'model/user';
import { UpdateUserStatus } from 'components/userProfilePage/model';
import { Editor } from 'model/brick';

const profileErrorHandler = (e: any) => {
  const {response} = e;
  if (response.status === 405) {
    if (response.data === 'User with that email already exists.') {
      return UpdateUserStatus.InvalidEmail;
    }
  }
  return UpdateUserStatus.Failed;
}

export const createUser = async (userToSave: any) => {
  try {
    const data = await post<string>('/user/new', { ...userToSave });
    return data === 'OK' ? UpdateUserStatus.Success : UpdateUserStatus.Failed;
  } catch (e) {
    return profileErrorHandler(e);
  }
}

export const updateUser = async (userToSave: any) => {
  try {
    const data = await put<string>('/user', { ...userToSave });
    return data === 'OK' ? true : false;
  } catch {
    return false;
  }
}

export const suggestUsername = async (name: string) => {
  try {
    return await get<User[]>(`/user/suggest/${name}`);
  } catch {
    return null;
  }
}

export const getUserById = async (userId: number) => {
  try {
    return await get<User>(`/user/${userId}`);
  } catch {
    return null;
  }
}

export const saveProfileImageName = async (userId: number, name: string) => {
  try {
    const data = await put<string>(`/user/profileImage/${userId}/${name}`, {});
    return data === "OK" ? true : false;
  } catch {
    return false;
  }
}

export const getUserByUserName = async (userName: string) => {
  try {
    let user = await get<Editor>(`/user/byUsername/${userName}`);
    return {
      success: true,
      user
    }
  } catch (e) {
    return {
      success: false,
      message: e.response.data
    }
  }
}

export const setUserPreference = async (roleId: UserType) => {
  try {
    const data = await put<any>(`/user/rolePreference/${roleId}`, {});
    return data === "OK" ? true : false;
  } catch (e) {
    return false;
  }
}
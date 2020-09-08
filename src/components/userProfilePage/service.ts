import axios from "axios";

import { User, UserProfile } from 'model/user';

export const createUser = async (userToSave: any) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/user/new`,
      { ...userToSave },
      { withCredentials: true }
    );
    return res.data === 'OK' ? true : false;
  }
  catch (e) {
    return false;
  }
}

export const updateUser = async (userToSave: any) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/user`,
      { ...userToSave },
      { withCredentials: true }
    );
    return res.data === 'OK' ? true : false;
  }
  catch (e) {
    return false;
  }
}

export const getUserById = async (userId: number) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_HOST}/user/${userId}`,
      { withCredentials: true }
    );
    return res.data as User;
  }
  catch (e) {
    return null;
  }
}

export const saveProfileImageName = async (userId: number, name: string) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/user/profileImage/${userId}/${name}`, {}, { withCredentials: true }
    );
    return res.data === "OK" ? true : false;
  }
  catch (error) {
    return false;
  }
}

export const isValid = (user: UserProfile) => {
  if (user.firstName && user.lastName && user.email) {
    return true;
  }
  return false;
}

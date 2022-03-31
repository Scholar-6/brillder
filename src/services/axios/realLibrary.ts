import {get} from './index';


export const getRealLibraries = async () => {
  try {
    return await get<any>(`/libraries`);
  } catch {
    return null;
  }
}
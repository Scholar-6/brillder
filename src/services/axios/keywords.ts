import {get} from './index';

export const suggestKeyword = async (value: string) => {
  try {
    return await get<any[]>(`/keywords/suggest/${value}`);
  } catch {
    return null;
  }
}

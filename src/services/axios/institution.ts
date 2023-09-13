import {get} from './index';

export const getInstitutionLogo = async () => {
  try {
    return await get<string>(`/institution/getImage`);
  } catch {
    return null;
  }
}

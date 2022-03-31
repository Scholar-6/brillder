import {get, post} from './index';

export interface RealLibrary {
  id: number;
  name: string;
}

export const getRealLibraries = async () => {
  try {
    return await get<RealLibrary[]>(`/libraries`);
  } catch {
    return null;
  }
}

export const claimLibraryAccount = async (libraryId: number, barcodeNumber: string, pin: string) => {
  try {
    var dd2 = await post<any>('/user/claimLibraryAccount', {libraryId, barcodeNumber, pin });
    console.log(dd2);
  } catch {
    return null;
  }
}
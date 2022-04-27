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
    await post<any>('/user/claimLibraryAccount', {libraryId, barcodeNumber, pin });
    return true;
  } catch {
    return false;
  }
}

export const unclaimLibraryAccount = async (libraryId: number) => {
  try {
    await post<any>('/user/unclaimLibraryAccount', {libraryId });
    return true;
  } catch {
    return false;
  }
}
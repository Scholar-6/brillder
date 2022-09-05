import {get, post} from './index';

export interface RealLibrary {
  id: number;
  name: string;
}

export const getRealLibraries = async () => {
  try {
    const libraries = await get<RealLibrary[]>(`/libraries`);
    if (libraries) {
      return libraries.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    }
    return libraries;
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

export const librarySignUp = async (libraryId: number, barcodeNumber: string, pin: string) => {
  try {
    const res = await post<any>('/auth/library/signUp', {libraryId, patronId: barcodeNumber, pin });
    console.log(res);
    return {
      success: true
    }
  } catch (e) {
    if (e.response && e.response.data) {
      return {
        data: e.response.data,
        success: false
      }
    }
    return {
      success: false
    }
  }
}

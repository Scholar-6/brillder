import axios, { AxiosResponse } from "axios";

interface TermsResult {
  lastModifiedDate: string;
  data: any;
}

export const getFileModifiedDate = (r: AxiosResponse<any>) => {
  return r.headers['last-modified'];
}

export const getTerms = async () => {
  const r = await axios.get("/terms.md");
  if (r.data) {
    const lastModifiedDate = getFileModifiedDate(r);
    return {lastModifiedDate, data: r.data } as TermsResult;
  }
}
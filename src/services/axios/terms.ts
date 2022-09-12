import axios, { AxiosResponse } from "axios";

interface TermsResult {
  lastModifiedDate: string;
  data: any;
}

export const getFileModifiedDate = (r: AxiosResponse<any>) => {
  return r.headers['last-modified'];
}

export const getTerms = async () => {
  const r = await axios.get("https://raw.githubusercontent.com/Scholar-6/terms/master/terms.md");
  if (r.data) {
    console.log(r.headers);
    // get date modified
    const lastModifiedDate = (await axios.get("https://api.github.com/repos/Scholar-6/terms/commits?path=terms.md&page=1&per_page=1")).headers['last-modified'];
    const terms:TermsResult = {lastModifiedDate, data: r.data };
    return terms;
  }
}
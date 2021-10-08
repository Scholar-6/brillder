import axios from 'axios';


export function fileUrl(fileName: string) {
  if (!fileName) { return '' }
  return `${process.env.REACT_APP_BACKEND_HOST}/files/${fileName}`;
}

export function uploadFile(inputFile: File, callback: Function, onError: Function) {
  var formData = new FormData();
  const file = Object.assign(inputFile);
  formData.append('file', file);

  return axios.post(
    process.env.REACT_APP_BACKEND_HOST + '/fileUpload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true
    }
  ).then(res => {
    callback(res);
  }).catch(error => {
    onError(error);
  });
}

export async function getFile(fileName: string) {
  const res = await axios.get(
    process.env.REACT_APP_BACKEND_HOST + '/files/' + fileName,
    {
      responseType: 'blob',
      withCredentials: true
    });
  if (res.status === 200 && res.data) {
    return new File([res.data], fileName);
  }
}
const apiBaseUrl =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://localhost:5897'
    : 'https://flightpub-team4.herokuapp.com';

const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoyLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjU4OTciLCJpZCI6MSwiZXhwIjoxNjU5MjMwMDMxfQ.HJRfGWj6IiIfr4R5ytAD4Ca1nx_lKvtgyaoKRjewUgA'; // TODO store this somewhere.

const baseOptions: RequestInit = {
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
};

//Default httpGet, takes endpoint and paramaters as input
export const httpGet = async (endpoint: string, params?: object): Promise<any> => {
  const res = await fetch(`${apiBaseUrl}${endpoint}${params ? toParams(params) : ''}`, {
    ...baseOptions,
    method: 'get'
  });
  return handleResponse(res);
};

//Default httpPost, takes endpoint and reqBody as input
export const httpPost = async (endpoint: string, reqBody: object): Promise<any> => {
  const res = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...baseOptions,
    method: 'POST',
    body: JSON.stringify(reqBody)
  });
  return handleResponse(res);
};

export const httpPut = async (endpoint: string, reqBody: object): Promise<any> => {
  const res = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...baseOptions,
    method: 'PUT',
    body: JSON.stringify(reqBody)
  });
  return handleResponse(res);
};

export const httpPatch = async (endpoint: string, reqBody: object): Promise<any> => {
  const res = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...baseOptions,
    method: 'PATCH',
    body: JSON.stringify(reqBody)
  });
  return handleResponse(res);
};

export const httpDelete = async (endpoint: string): Promise<any> => {
  const res = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...baseOptions,
    method: 'DELETE'
  });
  return handleResponse(res);
};
//Response handler, checks for 2xx http status codes
const handleResponse = async (res: Response) => {
  if (res.status.toString().charAt(0) !== '2') {
    let err = await res.json();
    throw new ApiError(err, res.status);
  }
  return res.json();
};

export class ApiError extends Error {
  public statusCode: number;
  public data: any;

  constructor(data: any, statusCode: number) {
    super(`The server returned a response of ${statusCode}, "${JSON.stringify(data)}"`);
    this.statusCode = statusCode;
    this.data = data;
  }
}

//Maps object params from array to correct json format
export const toParams = (obj?: any) => {
  let flatObj = flattenObj(obj);
  return (
    '?' +
    Object.keys(flatObj)
      .map((key) => key + '=' + flatObj[key])
      .join('&')
  );
};
//Flattens object into digestable json format
export const flattenObj = (obj: any, parent?: string, res: any = {}) => {
  for (let key in obj) {
    let propName = parent ? parent + '.' + key : key;

    if (Array.isArray(obj[key])) {
      res[propName] = obj[key].join(',');
    } else if (obj[key] instanceof Map) {
      Array.from((obj[key] as Map<any, any>).entries()).map(
        ([mapKey, value]) => (res[`${key}%5B${mapKey}%5D`] = value)
      );
    } else if (typeof obj[key] == 'object') {
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
};

const apiBaseUrl = 'http://localhost:5897';

const baseOptions: RequestInit = {
  headers: { 'Content-Type': 'application/json' },
};

export const httpGet = async (endpoint: string, params?: object): Promise<any> => {
  const res = await fetch(`${apiBaseUrl}${endpoint}${params && toParams(params)}`, {
    ...baseOptions,
    method: 'get',
  });
  return handleResponse(res);
};

export const httpPost = async (endpoint: string, reqBody: object): Promise<any> => {
  const res = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...baseOptions,
    method: 'POST',
    body: JSON.stringify(reqBody),
  });
  return handleResponse(res);
};

export const httpPut = async (endpoint: string, reqBody: object): Promise<any> => {
  const res = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...baseOptions,
    method: 'PUT',
    body: JSON.stringify(reqBody),
  });
  return handleResponse(res);
};

export const httpDelete = async (endpoint: string): Promise<any> => {
  const res = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...baseOptions,
    method: 'DELETE',
  });
  return handleResponse(res);
};

const handleResponse = async (res: Response) => {
  if (res.status.toString().charAt(0) !== "2") {
    let err = await res.json();
    throw new ApiError(err, res.status);
  }
  return res.json();
};

export class ApiError extends Error {
  public statusCode: number;
  public data: any;
  constructor(data: any, statusCode: number) {
    super(
      `The server returned a response of ${statusCode}, "${JSON.stringify(
        data
      )}"`
    );
    this.statusCode = statusCode;
    this.data = data;
  }
}

const toParams = (obj?: any) => {
  let  flatObj = flattenObj(obj);
  return '?' + Object.keys(flatObj).map(key => key + '=' + flatObj[key]).join('&');
}


const flattenObj = (obj: any, parent?: string, res: any = {}) => {
  for(let key in obj){
    let propName = parent ? parent + '.' + key : key;

    if (Array.isArray(obj[key])) {
      res[propName] = obj[key].join(',');
    } else if(typeof obj[key] == 'object'){
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}
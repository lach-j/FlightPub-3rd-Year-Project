import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';

const apiBaseUrl =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://localhost:5897'
    : 'https://flightpub-team4.herokuapp.com';

export const useApi = (_endpoint: string = '') => {
  const [baseEndpoint] = useState(_endpoint);

  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const getOptions = () => {
    const token = localStorage.getItem('bearer-token');
    const options: RequestInit = {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    };

    return options;
  };

  const resolveEndpoint = (endpoint: string) => {
    return `${apiBaseUrl}${baseEndpoint}${endpoint}`;
  };

  //Default httpGet, takes endpoint and paramaters as input
  const httpGet = async (endpoint: string, params?: object): Promise<any> => {
    const res = await fetch(`${resolveEndpoint(endpoint)}${params ? toParams(params) : ''}`, {
      ...getOptions(),
      method: 'get'
    });
    return handleResponse(res);
  };

  //Default httpPost, takes endpoint and reqBody as input
  const httpPost = async (endpoint: string, reqBody: object): Promise<any> => {
    const res = await fetch(`${resolveEndpoint(endpoint)}`, {
      ...getOptions(),
      method: 'POST',
      body: JSON.stringify(reqBody)
    });
    return handleResponse(res);
  };

  const httpPut = async (endpoint: string, reqBody: object): Promise<any> => {
    const res = await fetch(`${resolveEndpoint(endpoint)}`, {
      ...getOptions(),
      method: 'PUT',
      body: JSON.stringify(reqBody)
    });
    return handleResponse(res);
  };

  const httpPatch = async (endpoint: string, reqBody?: object): Promise<any> => {
    const res = await fetch(`${resolveEndpoint(endpoint)}`, {
      ...getOptions(),
      method: 'PATCH',
      body: reqBody && JSON.stringify(reqBody)
    });
    return handleResponse(res);
  };

  const httpDelete = async (endpoint: string): Promise<any> => {
    const res = await fetch(`${resolveEndpoint(endpoint)}`, {
      ...getOptions(),
      method: 'DELETE'
    });
    return handleResponse(res);
  };
  //Response handler, checks for 2xx http status codes
  const handleResponse = async (res: Response) => {
    if (res.status.toString().charAt(0) !== '2') {
      let err = await res.json();

      if (res.status === 401 && location.pathname !== routes.login) {
        navigate(routes.login, { state: { redirectUrl: location.pathname } });
        localStorage.removeItem('user-id');
        localStorage.removeItem('bearer-token');
      }

      if (res.status === 403) {
        toast({
          status: 'error',
          title: 'Forbidden',
          description: 'You do not have access to this page'
        });
        navigate(routes.home);
      }

      throw new ApiError(err, res.status);
    }
    return res.json();
  };

  return { httpGet, httpPost, httpPut, httpPatch, httpDelete };
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

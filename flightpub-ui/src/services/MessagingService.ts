import moment from 'moment';
import Message from '../models/Message';
import * as api from './ApiService';

const BASE_ENDPOINT = '/messages';

export const getSessionById = async (sessionId: number) => {
  return await api.httpGet(`${BASE_ENDPOINT}/${sessionId}`);
};

export const subscribeToMessages = (
  sessionId: number,
  callback: (data: Message[]) => void,
  error?: (error: any) => void,
  delay: number = 10000
) => {
  const getMessages = () => {
    let since = moment().subtract(delay, 'milliseconds').toISOString();

    api
      .httpGet(`${BASE_ENDPOINT}/${sessionId}/messages`, { since })
      .then(callback)
      .catch((e) => error && error(e));
  };

  return setInterval(getMessages, delay);
};

export const sendNewMessage = async (sessionId: number, content: string) => {
  return await api.httpPatch(`${BASE_ENDPOINT}/${sessionId}`, { content });
};

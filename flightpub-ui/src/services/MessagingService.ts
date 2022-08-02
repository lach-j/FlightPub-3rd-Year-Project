import moment from 'moment';
import { useState } from 'react';
import Message from '../models/Message';
import { useApi } from './ApiService';

const BASE_ENDPOINT = '/messages';

export const useMessaging = (_sessionId: number) => {
  const [sessionId, setSessionId] = useState(_sessionId);
  const [prevDate, setDate] = useState(new Date());

  const { httpGet, httpPatch } = useApi();

  const getSession = async () => {
    return await httpGet(`${BASE_ENDPOINT}/${sessionId}`);
  };

  const sendNewMessage = async (content: string) => {
    return await httpPatch(`${BASE_ENDPOINT}/${sessionId}`, { content });
  };

  const subscribeToMessages = (
    callback: (data: Message[]) => void,
    error?: (error: any) => void,
    delay: number = 10000
  ) => {
    const getMessages = () => {
      let since = prevDate.toISOString();
      httpGet(`${BASE_ENDPOINT}/${sessionId}/messages`, { since })
        .then((data: Message[]) => {
          setDate(new Date());
          callback(data);
        })
        .catch((e) => error && error(e));
    };

    return setInterval(getMessages, delay);
  };

  return { getSession, sendNewMessage, subscribeToMessages };
};

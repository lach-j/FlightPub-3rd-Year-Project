import { useState } from 'react';
import Message from '../models/Message';
import { useApi } from './ApiService';

const BASE_ENDPOINT = '/messages';

export const useMessaging = (_sessionId?: number) => {
  const [sessionId] = useState(_sessionId);
  const [prevDate, setDate] = useState(new Date());

  const { httpGet, httpPatch } = useApi();

  const hasSessionId = () => {
    if (!sessionId) throw new Error('A sessionId needs to be supplied to use this method');
  };

  const getSession = async () => {
    hasSessionId();
    return await httpGet(`${BASE_ENDPOINT}/${sessionId}`);
  };

  const getAllUserSessions = async () => {
    return await httpGet(`${BASE_ENDPOINT}`);
  };

  const resolveSession = async (sessionId: number) => {
    return await httpPatch(`${BASE_ENDPOINT}/${sessionId}/resolve`);
  };

  const sendNewMessage = async (content: string) => {
    hasSessionId();
    return await httpPatch(`${BASE_ENDPOINT}/${sessionId}`, { content });
  };

  const joinSession = async (sessionId: number) => {
    return await httpPatch(`${BASE_ENDPOINT}/${sessionId}/join`);
  };

  // Interval based request method for retrieving new messages from the session.
  const subscribeToMessages = (
    callback: (data: Message[]) => void,
    error?: (error: any) => void,
    delay: number = 10000
  ) => {
    hasSessionId();
    const getMessages = () => {
      // Get the last time the messages were fetched
      let since = prevDate.toISOString();
      httpGet(`${BASE_ENDPOINT}/${sessionId}/messages`, { since })
        .then((data: Message[]) => {
          setDate(new Date()); // Update prevDate so only new messages are retrieved on the next request
          callback(data); // return the messages as a callback function.
        })
        .catch((e) => error && error(e));
    };

    // Run the getMessages function every 'delay' milliseconds
    return setInterval(getMessages, delay);
  };

  return {
    getSession,
    sendNewMessage,
    subscribeToMessages,
    getAllUserSessions,
    joinSession,
    resolveSession
  };
};

import { Button, Center, Grid, Heading, VStack, Box, HStack, Input } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { FaPaperPlane, FaPlane } from 'react-icons/fa';
import Message from '../models/Message';
import { MessagingSession } from '../models/MessagingSession';
import { useMessaging } from '../services/MessagingService';
import * as _ from 'lodash';

export const TravelAgentPage = () => {
  const [sessionId, setSessionId] = useState(1);
  const [sessionData, setSessionData] = useState<MessagingSession>();
  const [messages, setMessages] = useState<Message[]>([]);
  const messageSubscription = useRef<NodeJS.Timeout>();

  const { getSession, subscribeToMessages, sendNewMessage } = useMessaging(sessionId);

  useEffect(() => {
    getSession().then(setSessionData);
  }, [sessionId]);

  useEffect(() => {
    if (!sessionData) return;

    setMessages(sessionData.messages);

    if (messageSubscription.current) clearInterval(messageSubscription.current);

    messageSubscription.current = subscribeToMessages(
      (data: Message[]) => {
        setMessages((m) => _.uniqBy([...m, ...data], 'id'));
      },
      (error) => {
        messageSubscription.current && clearInterval(messageSubscription.current);
      }
    );
  }, [sessionData]);

  const handleSendMessage = (content: string) => {
    sendNewMessage(content);
  };

  return (
    <Grid>
      <Center>
        <VStack w='50%'>
          <Heading as='h2'>Test</Heading>
          {sessionData && <MessageContainer messages={messages} />}
          <MessageSendBar onMessageSent={handleSendMessage} />
        </VStack>
      </Center>
    </Grid>
  );
};

const MessageContainer = ({ messages }: { messages: Message[] }) => {
  return (
    <VStack w='full'>
      {messages?.map((message) => (
        <MessageComoponent key={message.id} message={message} />
      ))}
    </VStack>
  );
};

const MessageComoponent = ({ message }: { message: Message }) => {
  return (
    <Box alignSelf={message.user?.id === 1 ? 'flex-start' : 'flex-end'}>{message.content}</Box>
  );
};

const MessageSendBar = ({ onMessageSent }: { onMessageSent?: (content: string) => void }) => {
  const [messageContent, setMessageContent] = useState('');

  const handleSendMessage = () => {
    setMessageContent('');
    onMessageSent && onMessageSent(messageContent);
  };

  const handleKeyEvent = ({ key }: React.KeyboardEvent) => {
    if (key === 'Enter') handleSendMessage();
  };

  return (
    <HStack w='full'>
      <Input
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        onKeyDown={handleKeyEvent}
      />
      <Button
        aria-label='send-button'
        rightIcon={<FaPaperPlane />}
        colorScheme='blue'
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </HStack>
  );
};

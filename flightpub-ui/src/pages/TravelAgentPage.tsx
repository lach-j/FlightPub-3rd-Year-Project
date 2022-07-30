import {
  Button,
  Center,
  Grid,
  Heading,
  VStack,
  Box,
  HStack,
  Input,
  IconButton
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { FaPaperPlane, FaPlane } from 'react-icons/fa';
import Message from '../models/Message';
import { MessagingSession } from '../models/MessagingSession';
import * as messagingService from '../services/MessagingService';
import * as _ from 'lodash';

export const TravelAgentPage = () => {
  const [sessionId, setSessionId] = useState(1);
  const [sessionData, setSessionData] = useState<MessagingSession>();
  const [messages, setMessages] = useState<Message[]>([]);
  const messageSubscription = useRef<NodeJS.Timeout>();

  useEffect(() => {
    messagingService.getSessionById(sessionId).then(setSessionData);
  }, [sessionId]);

  useEffect(() => {
    if (!sessionData) return;

    setMessages(sessionData.messages);

    if (messageSubscription.current) clearInterval(messageSubscription.current);

    messageSubscription.current = messagingService.subscribeToMessages(
      sessionId,
      (data: Message[]) => {
        setMessages(_.uniqBy([...messages, ...data], 'id'));
      },
      (error) => {
        messageSubscription.current && clearInterval(messageSubscription.current);
      }
    );
  }, [sessionData]);

  return (
    <Grid>
      <Center>
        <VStack>
          <Heading as='h2'>Test</Heading>
          {sessionData && <MessageContainer messages={messages} />}
          <MessageSendBar onMessageSent={(e) => console.log(e)} />
        </VStack>
      </Center>
    </Grid>
  );
};

const MessageContainer = ({ messages }: { messages: Message[] }) => {
  return (
    <VStack>
      {messages?.map((message) => (
        <MessageComoponent key={message.id} message={message} />
      ))}
    </VStack>
  );
};

const MessageComoponent = ({ message }: { message: Message }) => {
  return <Box>{message.content}</Box>;
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
    <HStack>
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

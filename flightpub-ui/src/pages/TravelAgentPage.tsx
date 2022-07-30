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
import { useEffect, useRef, useState } from 'react';
import { FaPaperPlane, FaPlane } from 'react-icons/fa';
import Message from '../models/Message';
import { MessagingSession } from '../models/MessagingSession';
import * as messagingService from '../services/MessagingService';

export const TravelAgentPage = () => {
  const [sessionId, setSessionId] = useState(1);
  const [sessionData, setSessionData] = useState<MessagingSession>();
  const messageSubscription = useRef<NodeJS.Timeout>();

  useEffect(() => {
    messagingService.getSessionById(sessionId).then(setSessionData);
  }, [sessionId]);

  useEffect(() => {
    if (!sessionData) return;
    if (messageSubscription.current) clearInterval(messageSubscription.current);

    messageSubscription.current = messagingService.subscribeToMessages(
      sessionId,
      (data) => setSessionData(data),
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
          {sessionData && <MessageContainer messages={sessionData.messages} />}
          <MessageSendBar />
        </VStack>
      </Center>
    </Grid>
  );
};

const MessageContainer = ({ messages }: { messages: Message[] }) => {
  return (
    <VStack>
      {messages?.map((message) => (
        <MessageComoponent message={message} />
      ))}
    </VStack>
  );
};

const MessageComoponent = ({ message }: { message: Message }) => {
  return <Box>{message.content}</Box>;
};

const MessageSendBar = ({}) => {
  return (
    <HStack>
      <Input />
      <IconButton aria-label='send-button' icon={<FaPaperPlane />} colorScheme='blue' />
    </HStack>
  );
};

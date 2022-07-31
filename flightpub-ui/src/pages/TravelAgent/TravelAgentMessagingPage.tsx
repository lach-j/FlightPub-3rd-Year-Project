import { Button, Heading, VStack, Box, HStack, Input } from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import Message from '../../models/Message';
import { MessagingSession } from '../../models/MessagingSession';
import { useMessaging } from '../../services/MessagingService';
import * as _ from 'lodash';
import { useParams } from 'react-router-dom';
import { User } from '../../models';
import { UserContext } from '../../services/UserContext';

export const TravelAgentMessagingPage = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState<MessagingSession>();
  const [messages, setMessages] = useState<Message[]>([]);
  const messageSubscription = useRef<NodeJS.Timeout>();
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  const userState = useContext(UserContext);

  useEffect(() => {
    if (!userState) return;

    const [userData, _] = userState;

    setCurrentUser(userData);
  }, [userState]);

  const { getSession, subscribeToMessages, sendNewMessage } = useMessaging(
    parseInt(sessionId || '-1')
  );

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
    <Box
      h='full'
      display='flex'
      w='full'
      position='absolute'
      flexDirection='column'
      padding='10'
      alignItems='center'
      gap='5'
      top={0}
      left={0}
      right={0}
      bottom={0}
    >
      <Heading as='h2'>Test</Heading>
      {sessionData && (
        <MessageContainer>
          {messages?.map((message) => (
            <MessageComponent key={message.id} message={message} currentUser={currentUser} />
          ))}
        </MessageContainer>
      )}
      <MessageSendBar onMessageSent={handleSendMessage} />
    </Box>
  );
};

const MessageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box w='full' h='full' overflow='auto' p='5'>
      <VStack w='full' overflow='auto'>
        {children}
      </VStack>
    </Box>
  );
};

const MessageComponent = ({
  message,
  currentUser
}: {
  message: Message;
  currentUser: User | undefined;
}) => {
  return (
    <Box alignSelf={message.user.id !== currentUser?.id ? 'flex-start' : 'flex-end'}>
      {message.content}
    </Box>
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

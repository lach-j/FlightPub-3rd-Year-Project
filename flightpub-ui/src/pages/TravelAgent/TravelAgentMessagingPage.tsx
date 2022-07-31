import { Button, Heading, VStack, Box, HStack, Input, Text, Flex } from '@chakra-ui/react';
import React, { Children, useContext, useEffect, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import Message from '../../models/Message';
import { MessagingSession } from '../../models/MessagingSession';
import { useMessaging } from '../../services/MessagingService';
import * as _ from 'lodash';
import { useParams } from 'react-router-dom';
import { User } from '../../models';
import { UserContext } from '../../services/UserContext';
import moment from 'moment';

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
        if (data.length !== 0)
          setMessages((m) => _.uniqBy([...m, ...data], 'id').filter((m) => m.id));
      },
      (error) => {
        messageSubscription.current && clearInterval(messageSubscription.current);
      }
    );
  }, [sessionData]);

  const handleSendMessage = (content: string) => {
    sendNewMessage(content);
    setMessages((m) =>
      _.uniqBy([...m, { content, user: currentUser, dateSent: new Date() } as Message], 'id')
    );
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
  const boxRef = useRef<HTMLDivElement>(null);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const numChildren = Children.count(children);

    if (boxRef.current && messageCount != numChildren)
      boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' });

    setMessageCount(Children.count(children));
  }, [boxRef.current, children]);

  return (
    <Box
      ref={boxRef}
      w='full'
      h='full'
      overflow='auto'
      p='5'
      border={'1px solid'}
      borderColor='gray.200'
      rounded={'xl'}
      css={{
        '&::-webkit-scrollbar': {
          width: '10px'
        },
        '&::-webkit-scrollbar-track': {
          width: '12px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'lightGray',
          borderRadius: '10px'
        }
      }}
    >
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
  const fromCurrentUser = message.user?.id !== currentUser?.id;
  const dateSent =
    message.dateSent instanceof Date ? message.dateSent : new Date(`${message.dateSent}Z`);
  return (
    <Flex
      alignSelf={fromCurrentUser ? 'flex-start' : 'flex-end'}
      flexDir='column'
      alignItems={fromCurrentUser ? 'flex-start' : 'flex-end'}
    >
      <Box
        py='1'
        px='3'
        bgColor={fromCurrentUser ? 'blue.500' : 'red.500'}
        color='white'
        rounded='full'
        w='fit-content'
      >
        <Text>{message.content}</Text>
      </Box>
      <Text
        textAlign={fromCurrentUser ? 'left' : 'right'}
        fontSize='sm'
        title={moment(dateSent).toLocaleString()}
      >
        {moment.duration(moment(dateSent).diff(new Date())).humanize(true)}
      </Text>
    </Flex>
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

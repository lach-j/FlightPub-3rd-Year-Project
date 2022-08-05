import {
  Button,
  Heading,
  VStack,
  Box,
  HStack,
  Input,
  Text,
  Flex,
  Avatar,
  useToast
} from '@chakra-ui/react';
import React, { Children, useContext, useEffect, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import Message from '../../models/Message';
import { MessagingSession, SessionStatus } from '../../models/MessagingSession';
import { useMessaging } from '../../services/MessagingService';
import * as _ from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../../models';
import { UserContext } from '../../services/UserContext';
import moment from 'moment';
import * as uuid from 'uuid';
import { ApiError } from '../../services/ApiService';
import { routes } from '../../constants/routes';
export const TravelAgentMessagingPage = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState<MessagingSession>();
  const [messages, setMessages] = useState<Message[]>([]);
  const messageSubscription = useRef<NodeJS.Timeout>();

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const toast = useToast();

  const { getSession, subscribeToMessages, sendNewMessage } = useMessaging(
    parseInt(sessionId || '-1')
  );

  useEffect(() => {
    getSession()
      .then(setSessionData)
      .catch((err: ApiError) => {
        if (err.statusCode === 400) {
          toast({
            title: err.name,
            description: 'The requested session was not found',
            status: 'error'
          });
          navigate(routes.travelAgents.base);
        }
      });
  }, [sessionId]);

  useEffect(() => {
    return () => {
      if (messageSubscription?.current) clearInterval(messageSubscription.current);
    };
  }, []);

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
      },
      3000
    );
  }, [sessionData]);

  const handleSendMessage = (content: string) => {
    if (!content) return;
    sendNewMessage(content);

    setMessages((m) => _.uniqBy([...m, { content, user, dateSent: new Date() } as Message], 'id'));
  };

  console.log(sessionData?.status);

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
            <MessageComponent key={message?.id ?? uuid.v4()} message={message} currentUser={user} />
          ))}
        </MessageContainer>
      )}
      <MessageSendBar
        onMessageSent={handleSendMessage}
        disabled={sessionData?.status === SessionStatus.RESOLVED}
      />
    </Box>
  );
};

const MessageContainer = ({ children }: { children: React.ReactNode }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const numChildren = Children.count(children);

    if (boxRef.current && messageCount !== numChildren)
      boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' });

    setMessageCount(Children.count(children));
  }, [boxRef.current, children, messageCount]);

  return (
    <Box
      ref={boxRef}
      w='full'
      h='full'
      overflow='auto'
      p='5'
      border='1px solid'
      borderColor='gray.200'
      rounded='xl'
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
  currentUser: User | null;
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
      {' '}
      <HStack>
        {fromCurrentUser && (
          <Avatar size='sm' name={`${message.user.firstName} ${message.user.lastName}`} />
        )}
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
      </HStack>
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

const MessageSendBar = ({
  onMessageSent,
  disabled = false
}: {
  onMessageSent?: (content: string) => void;
  disabled?: boolean;
}) => {
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
        disabled={disabled}
        placeholder={disabled ? 'You can no longer reply to this session' : ''}
      />
      <Button
        aria-label='send-button'
        rightIcon={<FaPaperPlane />}
        colorScheme='blue'
        onClick={handleSendMessage}
        disabled={disabled}
      >
        Send
      </Button>
    </HStack>
  );
};

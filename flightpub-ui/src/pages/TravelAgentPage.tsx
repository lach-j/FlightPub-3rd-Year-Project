import { Button, Center, Grid, Heading, VStack } from '@chakra-ui/react';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';

interface TestInterface {
  from: string;
  text: string;
}

export const TravelAgentPage = () => {
  let stompClient = useRef<CompatClient>();

  useEffect(() => {
    if (stompClient.current && stompClient.current.active) return;

    const socket = new SockJS('http://localhost:5897/chat');
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, (frame: any) => {
      console.log('connected to ', frame);
      stompClient.current?.subscribe('/topic/messages', (message: IMessage) => {
        console.log(JSON.parse(message.body) as TestInterface);
      });
    });
  }, []);

  const sendMessage = (text: string) => {
    stompClient.current?.send('/app/chat', {}, JSON.stringify({ from: 'joe', text }));
  };

  return (
    <Grid>
      <Center>
        <VStack>
          <Heading as='h2'>Test</Heading>
          <Button onClick={() => sendMessage('Test123')}>Click Me</Button>
        </VStack>
      </Center>
    </Grid>
  );
};

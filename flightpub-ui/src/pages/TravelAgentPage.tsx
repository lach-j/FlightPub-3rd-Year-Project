import { Button, Center, Grid, Heading, VStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import * as messagingService from '../services/MessagingService';

export const TravelAgentPage = () => {
  const [sessionId, setSessionId] = useState(1);
  const [sessionData, setSessionData] = useState();
  const messageSubscription = useRef<NodeJS.Timeout>();

  useEffect(() => {
    messagingService.getSessionById(sessionId).then(setSessionData);
  }, [sessionId]);

  useEffect(() => {
    if (!sessionData) return;
    if (messageSubscription.current) clearInterval(messageSubscription.current);

    messageSubscription.current = messagingService.subscribeToMessages(sessionId, (data) =>
      setSessionData(data)
    );
  }, [sessionData]);

  return (
    <Grid>
      <Center>
        <VStack>
          <Heading as='h2'>Test</Heading>
          <Button>Click Me</Button>
        </VStack>
      </Center>
    </Grid>
  );
};

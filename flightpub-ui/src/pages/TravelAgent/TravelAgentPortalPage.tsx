import {
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { GoKebabVertical } from 'react-icons/go';
import { NavLink } from 'react-router-dom';
import { routes } from '../../constants/routes';
import { MessagingSession, SessionStatus } from '../../models/MessagingSession';
import { useMessaging } from '../../services/MessagingService';
import { UserContext } from '../../services/UserContext';

export const TravelAgentPortalPage = () => {
  const [sessions, setSessions] = useState<MessagingSession[]>([]);
  const { user, setUser } = useContext(UserContext);

  const { getAllUserSessions } = useMessaging();

  useEffect(() => {
    getAllUserSessions().then(setSessions);
  }, []);

  const resolveStatusScheme = (status: SessionStatus) => {
    if (status === SessionStatus.TRIAGE) return 'gray';
    if (status === SessionStatus.IN_PROGRESS) return 'blue';
    if (status === SessionStatus.RESOLVED) return 'green';
    return 'gray';
  };

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Session Id</Th>
          <Th>User</Th>
          <Th>Status</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {sessions.map((session) => {
          const userInSession = session.users.filter((u) => u.id === user?.id).length > 0;

          return (
            <Tr>
              <Td>{session.id}</Td>
              <Td>{JSON.stringify(session.users)}</Td>
              <Td>
                <Badge colorScheme={resolveStatusScheme(session.status)}>{session.status}</Badge>
              </Td>
              <Td>
                <Menu>
                  <MenuButton as={IconButton} icon={<GoKebabVertical />}>
                    Profile
                  </MenuButton>
                  <MenuList>
                    {userInSession ? (
                      <MenuItem as={NavLink} to={`${routes.messagingSessionBase}/${session.id}`}>
                        Open Chat
                      </MenuItem>
                    ) : (
                      <MenuItem>Join Session</MenuItem>
                    )}
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

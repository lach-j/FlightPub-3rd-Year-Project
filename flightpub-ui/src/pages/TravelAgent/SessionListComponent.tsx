import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  IconButton,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { GoKebabVertical } from 'react-icons/go';
import { NavLink, useNavigate } from 'react-router-dom';
import { routes } from '../../constants/routes';
import { airports } from '../../data/airports';
import { MessagingSession, SessionStatus } from '../../models/MessagingSession';
import { UserRole } from '../../models/User';
import { Wishlist } from '../../models/Wishlist';
import { useMessaging } from '../../services/MessagingService';
import { UserContext } from '../../services/UserContext';

export const SessionListComponent = () => {
  const [sessions, setSessions] = useState<MessagingSession[]>([]);
  const [showResolved, setShowResolved] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isModelOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const [currentWishlist, setCurrentWishlist] = useState<Wishlist | undefined>();

  const { getAllUserSessions, joinSession, resolveSession } = useMessaging();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
  }, []);

  // Get all sessions that the user has access to view and display them in a table.
  const loadSessions = () => {
    getAllUserSessions().then(setSessions);
  };

  const resolveStatusScheme = (status: SessionStatus) => {
    if (status === SessionStatus.TRIAGE) return 'gray';
    if (status === SessionStatus.IN_PROGRESS) return 'blue';
    if (status === SessionStatus.RESOLVED) return 'green';
    return 'gray';
  };

  const resolveRoleScheme = (role?: UserRole) => {
    if (role === UserRole.STANDARD_USER) return 'blue';
    if (role === UserRole.TRAVEL_AGENT) return 'purple';
    if (role === UserRole.ADMINISTRATOR) return 'red';
    return 'gray';
  };

  const handleViewWishlist = (wishlist: Wishlist) => {
    setCurrentWishlist(wishlist);
    onModalOpen();
  };

  const getCurrentWishlistDate = () => {
    if (!currentWishlist) return '';

    const date =
      currentWishlist?.dateCreated instanceof Date
        ? currentWishlist?.dateCreated
        : new Date(`${currentWishlist?.dateCreated}Z`);

    return moment(date).format('DD/MM/yyy');
  };

  const handleJoinSession = (sessionId: number) => {
    onOpen();
    joinSession(sessionId)
      .then(() => {
        navigate(`${routes.travelAgents.session.base}/${sessionId}`);
      })
      .catch(() => {
        toast({
          title: 'An Error Occurred',
          description: 'An error occurred trying to join this session, please try again later',
          status: 'error'
        });
      })
      .finally(onClose);
  };

  const handleResolveSession = (sessionId: number) => {
    resolveSession(sessionId).then(loadSessions);
  };

  const resolveMenuButtons = (session: MessagingSession) => {
    const menuItems = {
      openChat: (
        <MenuItem as={NavLink} to={`${routes.travelAgents.session.base}/${session.id}`}>
          Open Chat
        </MenuItem>
      ),
      joinSession: <MenuItem onClick={() => handleJoinSession(session.id)}>Join Session</MenuItem>,
      viewWishlist: (
        <MenuItem onClick={() => handleViewWishlist(session.wishlist)}>View Wishlist</MenuItem>
      ),
      resolveSession: (
        <MenuItem bgColor='#caffe4' onClick={() => handleResolveSession(session.id)}>
          Resolve Session
        </MenuItem>
      )
    };

    const menuItemList = [];

    menuItemList.push(menuItems.viewWishlist);

    const userInSession = session.users.filter((u) => u.id === user?.id).length > 0;
    const userHasPrivileges =
      user?.role === UserRole.ADMINISTRATOR || user?.role === UserRole.TRAVEL_AGENT;

    if (userInSession) {
      menuItemList.push(menuItems.openChat);
    } else {
      if (userHasPrivileges) menuItemList.push(menuItems.joinSession);
    }

    if (userHasPrivileges && session.status === SessionStatus.IN_PROGRESS)
      menuItemList.push(menuItems.resolveSession);

    return menuItemList;
  };

  const isUserAdmin = user?.role === UserRole.ADMINISTRATOR || user?.role === UserRole.TRAVEL_AGENT;

  const maxAvatars = useBreakpointValue({ md: 4, sm: 1, base: 1 });

  return (
    <Box px='10' py='7' width='full'>
      <HStack w='full' justifyContent='flex-end' mb='4'>
        <Checkbox checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)}>
          Show resolved sessions?
        </Checkbox>
      </HStack>
      <Box maxH='600' overflow='auto' rounded='md' border='1px solid lightgray'>
        <Table>
          <Thead>
            <Tr>
              <Th>Session Id</Th>
              <Th>Users</Th>
              <Th>Status</Th>
              <Th w='0'></Th>
            </Tr>
          </Thead>
          <Tbody>
            {sessions.map((session) => {
              if (session.status === SessionStatus.RESOLVED && !showResolved) return;

              return (
                <Tr key={session.id}>
                  <Td>{session.id}</Td>
                  <Td>
                    <Flex gap='2' wrap='wrap'>
                      <AvatarGroup size='sm' max={maxAvatars}>
                        {session.users.map((u) => (
                          <Avatar
                            key={u.id}
                            name={`${u.firstName} ${u.lastName}`}
                            title={`${u.firstName} ${u.lastName}`}
                          >
                            <AvatarBadge
                              bg={resolveRoleScheme(u.role)}
                              title={u.role}
                              boxSize='1em'
                            />
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    </Flex>
                  </Td>
                  <Td>
                    <Badge colorScheme={resolveStatusScheme(session.status)}>
                      {session.status.replaceAll('_', ' ')}
                    </Badge>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton as={IconButton} bg='transparent' icon={<GoKebabVertical />} />
                      <MenuList>{resolveMenuButtons(session)}</MenuList>
                    </Menu>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <Spinner style={{ position: 'absolute', top: '50vh', left: '50vw' }} />
      </Modal>
      <Modal isOpen={isModelOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submitted {getCurrentWishlistDate()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OrderedList>
              {currentWishlist?.wishlistItems
                .sort((a, b) => a.destinationRank - b.destinationRank)
                .map((item) => {
                  const airport = airports.find(
                    (airport) => airport.code === item.destination.destinationCode
                  );
                  return (
                    <ListItem>
                      <Text>
                        {airport?.city}, {airport?.country}
                      </Text>
                      <div>
                        {isUserAdmin ? (
                          <Button as={NavLink} to={routes.holidayPackages.base} colorScheme='gray'>
                            Create Package
                          </Button>
                        ) : (
                          <span></span>
                        )}
                      </div>
                    </ListItem>
                  );
                })}
            </OrderedList>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

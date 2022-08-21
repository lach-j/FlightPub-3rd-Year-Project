import {
  Box,
  Flex,
  Modal,
  ModalOverlay,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { CancelFlightTab } from '../AdminPortal/CancelFlightTab';
import { SponsorAirlineTab } from '../AdminPortal/SponsorAirlineTab';
import { CovidHotspotTab } from '../AdminPortal/CovidHotspotTab';
import { ManageUserTab } from '../AdminPortal/ManageUserTab';
import { UserContext } from '../../services/UserContext';
import { UserRole } from '../../models/User';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../constants/routes';

export const AdminPage = () => {
  const { user } = useContext(UserContext);
  const toast = useToast();
  const navigate = useNavigate();

  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();

  const handleLoading = (isLoading: boolean) => {
    isLoading ? onOpenModal() : onCloseModal();
  };

  useEffect(() => {
    if (!user && localStorage.getItem('user-id')) return;

    if (user && user.role != UserRole.ADMINISTRATOR) {
      toast({
        status: 'error',
        title: 'Forbidden',
        description: 'You do not have access to this page'
      });
      navigate(routes.home);
    }
  });

  return (
    <Flex justifyContent='center' p='5em'>
      <Box w='80%'>
        <Tabs variant='enclosed'>
          <TabList>
            <Tab>Cancel Flight</Tab>
            <Tab>Sponsor Airline</Tab>
            <Tab>Covid Hotspot</Tab>
            <Tab>Manage Users</Tab>
          </TabList>

          <TabPanels mt='1em'>
            <TabPanel>
              <CancelFlightTab setIsLoading={handleLoading} />
            </TabPanel>
            <TabPanel>
              <SponsorAirlineTab setIsLoading={handleLoading} />
            </TabPanel>
            <TabPanel>
              <CovidHotspotTab setIsLoading={handleLoading} />
            </TabPanel>
            <TabPanel>
              <ManageUserTab setIsLoading={handleLoading} />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Modal isOpen={isOpenModal} onClose={onCloseModal}>
          <ModalOverlay />
          <Spinner style={{ position: 'absolute', top: '50vh', left: '50vw' }} />
        </Modal>
      </Box>
    </Flex>
  );
};

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
  useDisclosure
} from '@chakra-ui/react';
import { SavedPaymentsTab } from './SavedPaymentsTab';
import { MyDetailsTab } from './MyDetailsTab';
import { ChangePasswordTab } from './ChangePasswordTab';
import { BookingHistoryTab } from './BookingHistoryTab';
import { HolidayBookingHistoryTab } from './HolidayBookingHistoryTab';

export const AccountPage = () => {
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();

  const handleLoading = (isLoading: boolean) => {
    isLoading ? onOpenModal() : onCloseModal();
  };

  return (
    <Flex justifyContent='center' p='5em'>
      <Box w='80%'>
        <Tabs variant='enclosed'>
          <TabList>
            <Tab>My Details</Tab>
            <Tab>Change Password</Tab>
            <Tab>Saved Payments</Tab>
            <Tab>Booking History</Tab>
            <Tab>Holiday Booking History</Tab>
          </TabList>

          <TabPanels mt='1em'>
            <TabPanel>
              <MyDetailsTab setIsLoading={handleLoading} />
            </TabPanel>
            <TabPanel>
              <ChangePasswordTab setIsLoading={handleLoading} />
            </TabPanel>
            <TabPanel>
              <SavedPaymentsTab setIsLoading={handleLoading} />
            </TabPanel>
            <TabPanel>
              <BookingHistoryTab setIsLoading={handleLoading} />
            </TabPanel>
            <TabPanel>
              <HolidayBookingHistoryTab setIsLoading={handleLoading} />
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

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
} from '@chakra-ui/react';
import React from 'react';
import {CancelFlightTab} from "../AdminPortal/CancelFlightTab";
import {SponsorAirlineTab} from "../AdminPortal/SponsorAirlineTab";
import {CovidHotspotTab} from "../AdminPortal/CovidHotspotTab";

export const AdminPage = () => {

    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
    } = useDisclosure();

    const handleLoading = (isLoading: boolean) => {
        isLoading ? onOpenModal() : onCloseModal();
    };
    return (
    <Flex justifyContent='center' p='5em'>
        <Box w='80%'>
            <Tabs variant='enclosed'>
                <TabList>
                    <Tab>Cancel Flight</Tab>
                    <Tab>Sponsor Airline</Tab>
                    <Tab>Covid Hotspot</Tab>
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
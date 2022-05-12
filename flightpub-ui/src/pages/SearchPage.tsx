import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Link,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    VStack,
    Grid,
    StackDivider,
    FormControl,
    FormLabel,
    Select,
    Center,
    Avatar,
} from '@chakra-ui/react';
import React, {useState, SyntheticEvent} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {User} from "../models/User";
import { CUIAutoComplete } from 'chakra-ui-autocomplete'

export interface Item {
    label: string;
    value: string;
}

const tags = [{
    value: "adelaide", label: "Adelaide"
}, {value: "amsterdam", label: "Amsterdam"}, {
    value: "atlanta", label: "Atlanta"
}, {
    value: "bangkok", label: "Bangkok"
}, {
    value: "brisbane", label: "Brisbane"
}, {
    value: "canberra", label: "Canberra"
}, {
    value: "paris - charles de gaulle", label: "Paris - Charles De Gaulle"
}, {
    value: "cairns", label: "Cairns"
}, {
    value: "doha", label: "Doha"
}, {
    value: "darwin", label: "Darwin"
}, {
    value: "dubai", label: "Dubai"
}, {
    value: "rome-fiumicino", label: "Rome-Fiumicino"
}, {
    value: "rio de janeiro", label: "Rio De Janeiro"
}, {
    value: "hobart", label: "Hobart"
}, {
    value: "helsinki", label: "Helsinki"
}, {
    value: "hong kong", label: "Hong Kong"
}, {
    value: "honolulu", label: "Honolulu"
}, {
    value: "new york - jfk", label: "New York - JFK"
}, {
    value: "johannesburg", label: "Johannesburg"
}, {
    value: "kuala lumpur", label: "Kuala Lumpur"
}, {
    value: "los angeles", label: "Los Angeles"
}, {
    value: "new york - laguardia", label: "New York - Laguardia"
}, {
    value: "london-gatwick", label: "London-Gatwick"
}, {
    value: "london-heathrow", label: "London-Heathrow"
}, {
    value: "madrid", label: "Madrid"
}, {
    value: "melbourne", label: "Melbourne"
}, {
    value: "miami", label: "Miami"
}, {
    value: "munich", label: "Munich"
}, {
    value: "tokyo - narita", label: "Tokyo - Narita"
}, {
    value: "gold coast", label: "Gold Coast"
}, {
    value: "chicago - ohare intl.", label: "Chicago - OHare Intl."
}, {
    value: "paris - orly", label: "Paris - Orly"
}, {
    value: "perth", label: "Perth"
}, {
    value: "san francisco", label: "San Francisco"
}, {
    value: "singapore", label: "Singapore"
}, {
    value: "sydney", label: "Sydney"
}, {
    value: "vienna", label: "Vienna"
}, {
    value: "toronto", label: "Toronto"
}]

const handleSearch = (e: SyntheticEvent) => {

}

export const SearchPage = () => {
    const [loading, setLoading] = useState(false);
    const [departureDate, setDepartureDate] = useState(new Date());
    const [arrivalDate, setArrivalDate] = useState(new Date());


    const [pickerItems, setPickerItems] = React.useState(tags);
    const [selectedItems, setSelectedItems] = React.useState<Item[]>([]);

    const handleCreateItem = (item: Item) => {
        setPickerItems((curr) => [...curr, item]);
        setSelectedItems((curr) => [...curr, item]);
    };

    const handleSelectedItemsChange = (selectedItems?: Item[]) => {
        if (selectedItems) {
            setSelectedItems(selectedItems);
        }
    };

    const customRender = <T extends Item>(selected: T) => {
        return (
            <Flex flexDir="row" alignItems="center">
                <Avatar mr={2} size="sm" name={selected.label} />
                <Text>{selected.label}</Text>
            </Flex>
        )
    }
    return (
        <Grid>
            <Center>
            <form onSubmit={handleSearch}>
                <FormControl as='fieldset'>
                    <FormLabel as='legend'>Book a flight</FormLabel>
                    <VStack
                        divider={<StackDivider borderColor='gray.200' />}
                        spacing={2}
                        align='stretch'>
                        <Box>
                            <FormLabel htmlFor='flightClass'>Class: </FormLabel>
                            <Select name='flightClass' id='flightClass' placeholder='Select flight class' maxW={240}>
                                <option>Economy</option>
                                <option>Business</option>
                                <option>First-class</option>
                            </Select>
                        </Box>

                        <Box>
                            <FormLabel htmlFor='flightType'>Class: </FormLabel>
                            <Select name='flightType' id='flightType' placeholder='Select flight Type' maxW={240}>
                                <option>One-way</option>
                                <option>Round trip</option>
                                <option>Multi-city</option>
                            </Select>
                        </Box>

                        <Box>
                            <FormLabel>Number of Passengers</FormLabel>
                            <NumberInput allowMouseWheel={true}
                                         name={"passengers"}
                                         size='sm'
                                         maxW={16}
                                         defaultValue={0}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Box>

                        <Box>
                            <CUIAutoComplete
                                tagStyleProps={{
                                    rounded: 'full'
                                }}
                                label="Select preferred tags"
                                placeholder="Type a Country"
                                disableCreateItem={true}
                                onCreateItem={handleCreateItem}
                                items={pickerItems}
                                selectedItems={selectedItems}
                                onSelectedItemsChange={(changes) =>
                                    handleSelectedItemsChange(changes.selectedItems)
                                }
                            />
                        </Box>
                        <Box>
                            <FormLabel>Arrival Location:</FormLabel>
                            <Input name="arrival" variant='outline' placeholder='Arrival Location' width='auto' />
                        </Box>

                        <Box>
                            <FormLabel>Departure Location</FormLabel>
                            <Input name="departure" variant='outline' placeholder='Departure Location' width='auto' />
                        </Box>

                        <FormLabel>Arrival Date</FormLabel>
                        <DatePicker
                            minDate={new Date()}
                            selected={arrivalDate}
                            onChange={(date:Date) => setArrivalDate(date)} />
                        <FormLabel>Departure Date</FormLabel>
                        <DatePicker
                            minDate={new Date()}
                            selected={departureDate}
                            onChange={(date:Date) => setDepartureDate(date)} />
                        <Box>
                            <Button type="submit" isLoading={loading} colorScheme="red">
                                Search
                            </Button>
                        </Box>
                    </VStack>
                </FormControl>
            </form>
            </Center>
        </Grid>


    );
};

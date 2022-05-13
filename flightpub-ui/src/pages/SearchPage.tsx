import {
    Box,
    Text,
    Button,
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
} from '@chakra-ui/react';
import React, {useState, SyntheticEvent} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {User} from "../models/User";
import { CUIAutoComplete } from 'chakra-ui-autocomplete'
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import moment from "moment";

export interface Item {
    label: string;
    value: string;
}

const tags2 = [
    {label: "Beach" , value: "beach"},
    {label: "Snow" , value: "snow"},
    {label: "Holiday" , value: "holiday"},
    {label: "Family-Friendly", value: "family-friendly"},
    {label: "Sports", value: "sports"},
    {label: "Romantic", value: "romantic"},
    {label: "Asia", value: "asia"},
]

const tags =
    [
    {value: "adelaide", label: "Adelaide"},
    {value: "amsterdam", label: "Amsterdam"},
    {value: "atlanta", label: "Atlanta"},
    {value: "bangkok", label: "Bangkok"},
    {value: "brisbane", label: "Brisbane"},
    {value: "canberra", label: "Canberra"},
    {value: "paris - charles de gaulle", label: "Paris - Charles De Gaulle"},
    {value: "cairns", label: "Cairns"},
    {value: "doha", label: "Doha"},
    {value: "darwin", label: "Darwin"},
    {value: "dubai", label: "Dubai"},
    {value: "rome-fiumicino", label: "Rome-Fiumicino"},
    {value: "rio de janeiro", label: "Rio De Janeiro"},
    {value: "hobart", label: "Hobart"},
    {value: "helsinki", label: "Helsinki"},
    {value: "hong kong", label: "Hong Kong"},
    {value: "honolulu", label: "Honolulu"},
    {value: "new york - jfk", label: "New York - JFK"},
    {value: "johannesburg", label: "Johannesburg"},
    {value: "kuala lumpur", label: "Kuala Lumpur"},
    {value: "los angeles", label: "Los Angeles"},
    {value: "new york - laguardia", label: "New York - Laguardia"},
    {value: "london-gatwick", label: "London-Gatwick"},
    {value: "london-heathrow", label: "London-Heathrow"},
    {value: "madrid", label: "Madrid"},
    {value: "melbourne", label: "Melbourne"},
    {value: "miami", label: "Miami"},
    {value: "munich", label: "Munich"},
    {value: "tokyo - narita", label: "Tokyo - Narita"},
    {value: "gold coast", label: "Gold Coast"},
    {value: "chicago - ohare intl.", label: "Chicago - OHare Intl."},
    {value: "paris - orly", label: "Paris - Orly"},
    {value: "perth", label: "Perth"},
    {value: "san francisco", label: "San Francisco"},
    {value: "singapore", label: "Singapore"},
    {value: "sydney", label: "Sydney"},
    {value: "vienna", label: "Vienna"},
    {value: "toronto", label: "Toronto"}
    ]



export const SearchPage = () => {
    {/*TODO: Change these hooks to a single 'Search' model */}
    const [JSONString, setJSONString] = useState("");

    const [flightClass, setFlightClass] = useState("");
    const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFlightClass(event.target.value)
    }

    const [flightType, setFlightType] = useState("");
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFlightType(event.target.value)
    }
    const [numPassengers, setNumPassengers] = useState("");

    const [departureDate, setDepartureDate] = useState(new Date());
    const [arrivalDate, setArrivalDate] = useState(new Date());

    const [arrivalLocation, setArrivalLocation] = useState("");
    const [departureLocation, setDepartureLocation] = useState("");
    const [selectedTags, setSelectedTags] = React.useState<Item[]>([]);


    const handleSelectedItemsChange = (selectedTags?: Item[]) => {
        if (selectedTags) {
            setSelectedTags(selectedTags);
        }
    };
    {/*TODO: Change these hooks to a single 'Search' model */}
    function handleSearch() {
        setJSONString(JSON.stringify([
            {flightClass},
            {flightType},
            {numPassengers},
            {selectedTags},
            {arrivalLocation},
            {departureLocation},
            {arrivalDate},
            {departureDate},
        ],null, 2))
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
                            <FormControl isRequired>
                            <FormLabel htmlFor='flightClass'>Class: </FormLabel>
                            <Select onChange={handleClassChange} name='flightClass' id='flightClass' placeholder='Select flight class' maxW={240}>
                                <option>Economy</option>
                                <option>Business</option>
                                <option>First-class</option>
                            </Select>
                            </FormControl>
                        </Box>

                        <Box>
                            <FormControl isRequired>
                            <FormLabel htmlFor='flightType'>Type: </FormLabel>
                            <Select onChange={handleTypeChange} name='flightType' id='flightType' placeholder='Select flight Type' maxW={240}>
                                <option>One-way</option>
                                <option>Round trip</option>
                                <option>Multi-city</option>
                            </Select>
                            </FormControl>
                        </Box>

                        <Box>
                            <FormControl isRequired>
                            <FormLabel>Number of Passengers</FormLabel>
                            <NumberInput allowMouseWheel={true}
                                         name={"passengers"}
                                         size='sm'
                                         min={1}
                                         maxW={16}

                                         onChange={setNumPassengers}
                                         defaultValue={1}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            </FormControl>
                        </Box>

                        <Box>
                            <CUIAutoComplete
                                tagStyleProps={{
                                    rounded: 'full'
                                }}
                                label="Select preferred tags"
                                placeholder="Select a tag"
                                disableCreateItem={true}
                                items={tags2}
                                selectedItems={selectedTags}
                                onSelectedItemsChange={(changes) =>
                                    handleSelectedItemsChange(changes.selectedItems)
                                }
                            />
                        </Box>

                        <Box>
                            <FormControl isRequired>
                            <FormLabel>Arrival Location:</FormLabel>
                            <AutoComplete openOnFocus onChange={setArrivalLocation}>
                                <AutoCompleteInput variant="filled" />
                                <AutoCompleteList >
                                    {tags.map((tag, cNum) => (
                                        <AutoCompleteItem
                                            key={`option-${cNum}`}
                                            value={tag.label}
                                            align="center"
                                        >
                                            <Text ml="4">{tag.label}</Text>
                                        </AutoCompleteItem>
                                    ))}
                                </AutoCompleteList>
                            </AutoComplete>
                            </FormControl>
                        </Box>

                        <Box>
                            <FormControl isRequired>
                            <FormLabel>Departure Location</FormLabel>
                            <AutoComplete openOnFocus onChange={setDepartureLocation}>
                                <AutoCompleteInput variant="filled" />
                                <AutoCompleteList>
                                    {tags.map((tag, cNum) => (
                                        <AutoCompleteItem
                                            key={`option-${cNum}`}
                                            value={tag.label}
                                            align="center"
                                        >
                                            <Text ml="4">{tag.label}</Text>
                                        </AutoCompleteItem>
                                    ))}
                                </AutoCompleteList>
                            </AutoComplete>
                            </FormControl>
                        </Box>

                        <Box>
                            <FormLabel>Departure Date</FormLabel>
                            <DatePicker
                                minDate={new Date()}
                                selected={departureDate}
                                onChange={(date:Date) => setDepartureDate(date)}
                            />
                        </Box>

                        <Box>
                        <FormLabel>Arrival Date</FormLabel>
                        <DatePicker
                            minDate={new Date(departureDate)}
                            selected={arrivalDate}
                            onChange={(date:Date) => setArrivalDate(date)} />


                            <Button type="submit" colorScheme="red">
                                Search
                            </Button>
                        </Box>

                    </VStack>
                </FormControl>
            </form>
            </Center>

            <VStack
                divider={<StackDivider borderColor='gray.200' />}
                spacing={2}
                align='stretch'>
                <Box>
                    <p>JSON: {JSONString}</p>
                </Box>
                <Box>
                    <p>Flight Class: {flightClass}</p>
                </Box>
                <Box>
                    <p>Flight Type: {flightType}</p>
                </Box>
                <Box>
                    <p>Number of Passengers: {numPassengers}</p>
                </Box>
                <Box>
                    <ul>
                        Tags: {selectedTags.map(itemtest => (
                        <li key={itemtest.label}>{itemtest.value}</li>
                    ))}
                    </ul>
                </Box>
                <Box>
                    <p>Arrival Location: {arrivalLocation}</p>
                    <p>Departure Location: {departureLocation}</p>
                </Box>
                <Box>
                    <p>Arrival Date: {moment(arrivalDate).format("LL")} </p>
                    <p>Departure: {moment(departureDate).format("LL")}</p>
                </Box>
                <Box>
                    <p></p>
                </Box>
            </VStack>
        </Grid>


    );
};

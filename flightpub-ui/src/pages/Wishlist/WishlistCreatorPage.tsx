import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react';
import { Airport, findNearestAirport } from '../../utility/geolocation';
import { airports } from '../../data/airports';
import { useApi } from '../../services/ApiService';
import { endpoints } from '../../constants/endpoints';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../constants/routes';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from '@choc-ui/chakra-autocomplete';

// fake data generator
const getItems = (count: number, offset: number = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`
  }));

// a little function to help us with reordering the result
const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (
  source: any[],
  destination: any[],
  droppableSource: any,
  droppableDestination: any
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: any = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  borderRadius: '0.5rem',

  background: isDragging ? 'white' : 'white',

  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : '#7072c9',
  padding: grid,
  width: 250
});

export const WishlistCreatorPage = (props: any) => {
  const [items, setItems] = useState<Airport[]>(airports);
  const [departureAirport, setDepartureAirport] = useState<Airport | undefined>();
  const [selected, setSelected] = useState<Airport[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) =>
      setDepartureAirport(findNearestAirport([position.coords.longitude, position.coords.latitude]))
    );
  }, []);

  const navigate = useNavigate();
  const { httpPost } = useApi(endpoints.wishlist);

  const getOrderedWishlistItems = () => {
    return selected.map((a) => a.code);
  };

  const handleSubmitWishlist = () => {
    const items = getOrderedWishlistItems();

    if (!departureAirport?.code) {
      toast({
        status: 'error',
        title: 'Invalid Wishlist',
        description: 'You must select your departure location before submitting'
      });
      return;
    }

    if (items.length <= 0) {
      toast({
        status: 'error',
        title: 'Invalid Wishlist',
        description: 'You must have at least one item in the wishlist before submitting'
      });
      return;
    }

    httpPost('', { destinations: items, departureCode: departureAirport.code })
      .then((res) => {
        toast({
          title: 'Wishlist Created',
          description:
            'Your wishlist has been created, a travel agent will be in contact with you shortly.',
          status: 'success'
        });
        navigate(routes.wishlist.base);
      })
      .catch((err) => {
        toast({
          title: 'An Error Occured',
          description: 'An unexpected error occured, please try again soon',
          status: 'error'
        });
      });
  };

  const toast = useToast();

  const getList = (id: string) => (id === 'droppable' ? items : selected);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const items = reorder(getList(source.droppableId), source.index, destination.index);

      if (source.droppableId === 'droppable2') {
        setSelected(items);
      }
    } else {
      if (destination.droppableId === 'droppable2' && selected.length >= 10) {
        toast({
          title: 'Max Items Exceeded',
          description: 'You have exceeded the maximum number of wishlish items',
          status: 'warning',
          position: 'top'
        });
        return;
      }

      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      setItems(result.droppable);
      setSelected(result.droppable2);
    }
  };

  const filterAirports = (item: Airport) => {
    const isValid =
      item.city.toLowerCase().includes(filter.toLowerCase()) ||
      item.country.toLowerCase().includes(filter.toLowerCase());
    return isValid;
  };

  return (
    <Box p='5'>
      <VStack gap='3'>
        <DragDropContext onDragEnd={onDragEnd}>
          <HStack alignItems={'flex-start'} gap='10'>
            <FormControl isRequired>
              <FormLabel>Departure Location</FormLabel>
              <AutoComplete
                openOnFocus
                suggestWhenEmpty
                defaultValue={departureAirport?.code}
                key={departureAirport?.code}
                onChange={(value) => setDepartureAirport(airports.find((a) => a.code === value))}
              >
                <AutoCompleteInput variant='filled' />
                <AutoCompleteList>
                  {airports.map(({ code, city }) => (
                    <AutoCompleteItem key={code} value={code} align='center'>
                      <Text ml='4'>{city}</Text>
                    </AutoCompleteItem>
                  ))}
                </AutoCompleteList>
              </AutoComplete>
            </FormControl>
            <VStack>
              <Heading as='h2'>Destinations</Heading>
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                type='text'
                placeholder='Filter Destinations...'
              />
              <Box maxH='38rem' overflowY='auto' overflowX='hidden'>
                <Droppable droppableId='droppable'>
                  {(provided, snapshot) => (
                    <Box
                      rounded='lg'
                      minH='80'
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {items.filter(filterAirports).map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              {`${item.city}, ${item.country}`}
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Box>
            </VStack>
            <VStack>
              <Heading as='h2'>Wishlist</Heading>
              <Droppable droppableId='droppable2'>
                {(provided, snapshot) => (
                  <Box
                    rounded='lg'
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    minH='41rem'
                  >
                    {selected.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <HStack
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <Box>{index + 1}</Box>
                            <Box>{`${item.city}, ${item.country}`}</Box>
                          </HStack>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </VStack>
          </HStack>
        </DragDropContext>
        <Button colorScheme='green' onClick={handleSubmitWishlist}>
          Submit Wishlist
        </Button>
      </VStack>
    </Box>
  );
};

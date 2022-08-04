import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided
} from 'react-beautiful-dnd';
import { useState } from 'react';
import { useEffect } from 'react';
import { Box, HStack, Input, useToast } from '@chakra-ui/react';
import { Airport } from '../utility/geolocation';
import { airports } from '../data/airports';

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

  background: isDragging ? 'white' : 'lightgrey',

  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250
});

export const UserFacingWishlistPage = (props: any) => {
  const [items, setItems] = useState<Airport[]>(airports);
  const [selected, setSelected] = useState<Airport[]>([]);
  const [filter, setFilter] = useState('');

  const getOrderedWishlistItems = () => {
    return selected.map((a) => a.code);
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
    <DragDropContext onDragEnd={onDragEnd}>
      <HStack position='absolute' top='0' bottom='0' alignItems={'flex-start'}>
        <Box>
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            type='text'
            placeholder='Filter Destinations...'
          />
          <Box maxH='50rem' overflowY='auto' overflowX='hidden'>
            <Droppable droppableId='droppable'>
              {(provided, snapshot) => (
                <Box
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
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
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
        </Box>
        <Box>
          <Droppable droppableId='droppable2'>
            {(provided, snapshot) => (
              <Box
                rounded='lg'
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                minH='80'
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
        </Box>
      </HStack>
    </DragDropContext>
  );
};

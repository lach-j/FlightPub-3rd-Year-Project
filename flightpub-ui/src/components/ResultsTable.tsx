import { Button, HStack, Table, TableCaption, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import * as _ from 'lodash';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ColumnDefinition, Flight } from '../models';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

type ResultsTableProps = {
  columns: ColumnDefinition<any>[],
  data: any[],
  sortable?: boolean;
  keyAccessor: string;
  cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
                                                            columns,
                                                            data,
                                                            children,
                                                            sortable = false,
                                                            keyAccessor,
                                                            cartState,
                                                          }) => {
  const toast = useToast();
  const [cart, setCart] = cartState;
  const [sortingColumn, setSortingColumn] = useState<ColumnDefinition<any>>();
  const [descending, setDescending] = useState<boolean>(false);

  const sortFunc = (a: any, b: any): number => {
    let o1 = _.get(a, sortingColumn?.accessor);
    let o2 = _.get(b, sortingColumn?.accessor);

    if (sortingColumn?.sortValue) {
      o1 = sortingColumn.sortValue(o1, descending);
      o2 = sortingColumn.sortValue(o2, descending);
    }

    let order = descending ? 1 : -1;

    if (!o1) return order * -1;
    if (!o2) return order;

    return o1 < o2 ? order : -1 * order;
  };

  const handleColumnSort = (column: ColumnDefinition<any>) => {
    if (!sortable) return;

    if (column === sortingColumn) {
      setDescending(!descending);
    } else {
      setSortingColumn(column);
    }
  };

  const sortIcon = () => descending ? <TriangleDownIcon /> : <TriangleUpIcon />;

  return (
    <Table width='100%'>
      <TableCaption>Prices subject to change. T&C's apply</TableCaption>
      <Thead>
        <Tr>
          {columns.map((column) =>
            <Th userSelect='none' onClick={() => handleColumnSort(column)} key={column.accessor}>
              <HStack spacing={3}>
                <Text>{column.Header}</Text>
                {column === sortingColumn && sortIcon()}
              </HStack>
            </Th>,
          )}
        </Tr>
      </Thead>
      <Tbody>
        {data.sort(sortFunc).map((result: any) => {
            return <Tr key={_.get(result, keyAccessor)}>
              {columns.map((column) =>
                <Td
                  key={column.accessor}>{column?.transform ? column.transform(_.get(result, column.accessor)) : _.get(result, column.accessor)}</Td>)}
              {children}
              <Td>
                <Button type='button'
                        colorScheme='red'
                        onClick={() => {
                          setCart(cart => [...cart, result]);
                          toast({
                            title: 'Success!',
                            description:
                              'Flight added to cart successfully.',
                            status: 'success',
                            duration: 9000,
                            isClosable: true,
                            position: 'top',
                          });
                        }}>
                  Add to Cart
                </Button>
              </Td>
            </Tr>;
          },
        )}
      </Tbody>
    </Table>
  );
};
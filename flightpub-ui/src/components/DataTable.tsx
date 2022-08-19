import { HStack, Table, TableCaption, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import * as _ from 'lodash';
import React, { useState } from 'react';
import { ColumnDefinition } from '../models';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

type DataTableProps<T> = {
  columns: ColumnDefinition<T>[];
  data: T[];
  sortable?: boolean;
  keyAccessor: string;
  extraRow?: (item: T) => React.ReactNode;
};

export let DataTable: React.FC<DataTableProps<any>>;
DataTable = ({ columns, data, children, sortable = false, keyAccessor, extraRow }) => {
  const [sortingColumn, setSortingColumn] = useState<ColumnDefinition<any>>(
    columns.find((c) => c.accessor === keyAccessor) || { accessor: '', Header: '' }
  );
  const [descending, setDescending] = useState<boolean>(false);

  const sortFunc = (a: any, b: any): number => {
    let o1 = _.get(a, sortingColumn.accessor);
    let o2 = _.get(b, sortingColumn.accessor);

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

  const sortIcon = () => (descending ? <TriangleDownIcon /> : <TriangleUpIcon />);

  return (
    <Table width='100%'>
      <TableCaption>Prices subject to change. T&C's apply</TableCaption>
      <Thead>
        <Tr>
          {columns.map((column) => (
            <Th userSelect='none' onClick={() => handleColumnSort(column)} key={column.accessor}>
              <HStack spacing={3}>
                <Text>{column.Header}</Text>
                {column === sortingColumn && sortIcon()}
              </HStack>
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.sort(sortFunc).map((result: any) => {
          return (
            <Tr key={_.get(result, keyAccessor)}>
              {columns.map((column) => (
                <Td key={column.accessor}>
                  {column?.transform
                    ? column.transform(_.get(result, column.accessor))
                    : _.get(result, column.accessor)}
                </Td>
              ))}
              {extraRow && <Td>{extraRow(result)}</Td>}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

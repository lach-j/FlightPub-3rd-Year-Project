import { HStack, Table, TableCaption, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import * as _ from 'lodash';
import React, { useState } from 'react';
import { ColumnDefinition } from '../models';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

type DataTableProps = {
  columns: ColumnDefinition<any>[],
  data: any[],
  sortable?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data, children, sortable = false }) => {
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
            <Th userSelect='none' onClick={() => handleColumnSort(column)}>
              <HStack spacing={3}>
                <Text>{column.Header}</Text>
                {column === sortingColumn && sortIcon()}
              </HStack>
            </Th>,
          )}
        </Tr>
      </Thead>
      <Tbody>
        {data.sort(sortFunc).map((result: any) =>
          <Tr>
            {columns.map((column) =>
              <Td>{column?.transform ? column.transform(_.get(result, column.accessor)) : _.get(result, column.accessor)}</Td>)}
            {children}
          </Tr>,
        )}
      </Tbody>
    </Table>
  );
};
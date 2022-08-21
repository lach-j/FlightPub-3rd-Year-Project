import React from 'react';

//Defines column definitions for DataTable
export interface ColumnDefinition<T> {
  accessor: string;
  Header: string;
  databaseMapping?: string;
  transform?: (value: any) => React.ReactNode;
  sortValue?: (value: any, descending: boolean) => any;
}

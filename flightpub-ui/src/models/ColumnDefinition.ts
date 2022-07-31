//Defines column definitions for DataTable
export interface ColumnDefinition<T> {
  accessor: T;
  Header: string;
  transform?: (value: any) => string;
  sortValue?: (value: any, descending: boolean) => any;
}

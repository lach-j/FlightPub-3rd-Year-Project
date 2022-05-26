export interface ColumnDefinition<T> {
  accessor: T;
  Header: string;
  transform?: (value: any) => string;
}
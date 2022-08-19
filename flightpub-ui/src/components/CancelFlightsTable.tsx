import { Button, HStack, Table, TableCaption, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import * as _ from 'lodash';
import React, { Dispatch, SetStateAction, useState } from 'react';
import {ColumnDefinition, Flight, User} from '../models';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {ApiError, useApi} from "../services/ApiService";
import {endpoints} from "../constants/endpoints";
import {FlightCancel} from "../models/FlightCancel";

type ResultsTableProps = {
    columns: ColumnDefinition<any>[],
    data: any[],
    sortable?: boolean;
    keyAccessor: string;
    type: string;

}

export const ResultsTable: React.FC<ResultsTableProps> = ({
                                                              columns,
                                                              data,
                                                              children,
                                                              sortable = false,
                                                              keyAccessor,
    type,
                                                          }) => {
    const toast = useToast();
    const [sortingColumn, setSortingColumn] = useState<ColumnDefinition<any>>();
    const [descending, setDescending] = useState<boolean>(false);
    const { httpPost: httpCreateCancel } = useApi(endpoints.flightUpdate);
    const { httpDelete: httpDeleteCancel} = useApi(endpoints.deleteCancel)
    const { httpDelete: httpDeleteCovid} = useApi(endpoints.deleteCovid)
    const { httpDelete: httpDeleteSponsored} = useApi(endpoints.deleteSponsored)

    //authRequest : stores registration request with email, password, firstName, lastName parameters
    const [flightCancelation, setflightCancelation] = useState<FlightCancel>();
    const [selectedFlight, setSelectedFlight] = useState<Flight>()

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
                                {/*TODO put conditional render here for delete and restore*/}
                                {/*cancel+uncancel,covid+uncovid,sponsor+unsponsor*/}

                                {type === "cancel" ? (
                                    <Button type='button'
                                            colorScheme='red'
                                            onClick={() => {
                                                httpCreateCancel('', {flightId:result})
                                                    .then((authResponse) => {
                                                        toast({
                                                            title: 'Flight Canceled',
                                                            description:
                                                                'The flight was successfully canceled',
                                                            status: 'success',
                                                            duration: 9000,
                                                            isClosable: true,
                                                            position: 'top'
                                                        });
                                                        //    refresh here
                                                    })
                                                    .catch((err: ApiError) => {
                                                        //if an error occurs in registration process
                                                        toast({
                                                            title: 'Error.',
                                                            description: err.message,
                                                            status: 'error',
                                                            duration: 9000,
                                                            isClosable: true,
                                                            position: 'top'
                                                        });
                                                    });
                                            }}>
                                        Cancel flight
                                    </Button>
                                ): (
                                    <Button type='button'
                                            colorScheme='red'
                                            onClick={() => {
                                                httpDeleteCancel('')// {flightId:result} TODO not sure how this works
                                                    .then((authResponse) => {
                                                        toast({
                                                            title: 'Flight Canceled',
                                                            description:
                                                                'The flight was successfully canceled',
                                                            status: 'success',
                                                            duration: 9000,
                                                            isClosable: true,
                                                            position: 'top'
                                                        });
                                                        //    refresh here
                                                    })
                                                    .catch((err: ApiError) => {
                                                        //if an error occurs in registration process
                                                        toast({
                                                            title: 'Error.',
                                                            description: err.message,
                                                            status: 'error',
                                                            duration: 9000,
                                                            isClosable: true,
                                                            position: 'top'
                                                        });
                                                    });
                                            }}>
                                        UnCancel flight
                                    </Button>
                                )}

                            </Td>
                        </Tr>;
                    }
                )}
            </Tbody>
        </Table>
    );
};
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { FC } from 'react';
import './table.scss';
/**
 * @description gets the table row including the all table definition
 * @param {Array} row
 */
const getTableRow = (row: any[] = []) => (
  <TableRow>
    {row?.map((cell) => (
      <TableCell>{cell}</TableCell>
    ))}
  </TableRow>
);

interface ITable {
  tableData?: any[];
  headers?: any[];
  wrapperClass?: string;
  children?: React.ReactNode;
}

/**
 * @description Customized Braintip table | accepts table or with data
 * @param { Array } tableData
 * @param { Array } headers
 * @returns void
 */
const CustomTable: FC<ITable> = ({ tableData = [], headers = [], wrapperClass = '', children }) => {
  return (
    <TableContainer component={Paper} className={`${wrapperClass && wrapperClass} custom-table`}>
      <Table aria-label="customized table">
        {!!tableData && !!headers && !children ? (
          <React.Fragment>
            <TableHead>
              <TableRow>
                {headers?.map((header) => (
                  <TableCell>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{tableData?.map((row) => getTableRow(row))}</TableBody>
          </React.Fragment>
        ) : (
          children
        )}
      </Table>
    </TableContainer>
  );
};

export default CustomTable;

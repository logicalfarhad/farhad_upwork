import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core';

const ResponseTable = ({ response, onPredicateClick, onObjectClick }) => {
    return (
        <div style={{ overflowX: 'auto' }}>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant="subtitle2">Subject</Typography></TableCell>
                            <TableCell><Typography variant="subtitle2">Predicate</Typography></TableCell>
                            <TableCell><Typography variant="subtitle2">Object</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {response.results.bindings.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    <Typography>{row.subject.value}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={() => onPredicateClick(row.predicate.value)}
                                    >
                                        {row.predicate.value}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={() => onObjectClick(row.object.value)}
                                    >
                                        {row.object.value}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ResponseTable;

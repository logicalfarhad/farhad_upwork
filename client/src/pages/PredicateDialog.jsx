import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core';

const PredicateDialog = ({ open, handleClose, response }) => {
    return (
        <Dialog open={open} onClose={handleClose} fullWidth
            maxWidth="lg">
            <DialogTitle>Predicate Details</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 850 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography variant="subtitle2">Subject</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">Predicate</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">Object</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {response.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        <Typography>{row.subject.value}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{row.predicate.value}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{row.object.value}</Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PredicateDialog;

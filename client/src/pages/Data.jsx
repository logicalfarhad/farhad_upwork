// GeoModel.js
import { Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@material-ui/core";

function Data() {
  return (
    <>
      <Container>
        <Typography variant="h6" style={{ marginBottom: 0 }}>Data Availability</Typography>
        <Typography variant="body1">The data is available at the following GitHub repository: TBD</Typography>
        <Typography variant="h6" style={{ marginTop: 50 }}>Data Statistics</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Feature</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Feature 1</TableCell>
                <TableCell>100</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Feature 2</TableCell>
                <TableCell>200</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}

export default Data;

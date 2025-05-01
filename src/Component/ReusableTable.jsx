import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Container,
    Box,
  } from "@mui/material";
  
  const ReusableTable = ({ title, columns, rows, getRowData, actions }) => {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "brown" }}>
              <TableRow>
                {columns.map((col, index) => (
                  <TableCell key={index}>{col}</TableCell>
                ))}
                {actions && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {getRowData(row).map((cell, i) => (
                    <TableCell key={i}>{cell}</TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <Box display="flex" gap={1}>
                        {actions.map((action, idx) => (
                          <action.Component
                            key={idx}
                            label={action.label}
                            onClick={() => action.onClick(row)}
                          />
                        ))}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  };
  
  export default ReusableTable;
  
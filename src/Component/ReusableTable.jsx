import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TableSortLabel,
  Box
} from '@mui/material';
import Loader from './Loader'; 
const ReusableTable = ({
  columns,
  rows,
  getRowData,
  actions,
  onSort,
  sortConfig,
  loading,
  error,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: '#1E293B',
        border: '1px solid #334155',
      }}
    >
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'brown' }}>
            {columns.map((col, idx) => (
              <TableCell
                key={idx}
                sx={{
                  border: '1px solid #334155',
                  color: '#F8FAFC',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}
              >
                {col !== 'Actions' ? (
                  <TableSortLabel
                    active={sortConfig.key === col}
                    direction={sortConfig.key === col ? sortConfig.direction : 'asc'}
                    onClick={() => onSort(col)}
                    sx={{
                      color: '#F8FAFC',
                      '&.Mui-active': { color: '#F8FAFC' },
                    }}
                  >
                    {col}
                  </TableSortLabel>
                ) : col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Loader/>
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ color: '#CBD5E1' }}>
                No data found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, idx) => (
              <TableRow
                key={idx}
                sx={{
                  '&:hover': {
                    backgroundColor: '#334155',
                  },
                }}
              >
                {getRowData(row).map((cell, cIdx) => (
                  <TableCell
                    key={cIdx}
                    sx={{
                      border: '1px solid #334155',
                      color: '#CBD5E1',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cell}
                  </TableCell>
                ))}

                {actions && (
                  <TableCell
                    sx={{
                      border: '1px solid #334155',
                      color: '#CBD5E1',
                    }}
                  >
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      gap={1}
                      sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
                    >
                      {typeof actions === 'function' ? actions(row) : null}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReusableTable;

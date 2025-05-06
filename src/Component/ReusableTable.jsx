import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TableSortLabel,
} from '@mui/material';

const ReusableTable = ({ columns, rows, getRowData, actions, onSort, sortConfig }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: '#1E293B',
        border: '1px solid #334155',
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'brown' }}>
            {columns.map((col, idx) => (
              <TableCell
                key={idx}
                sx={{
                  border: '1px solid #334155',
                  color: '#F8FAFC',
                  fontWeight: 'bold',
                }}
              >
                {col !== 'Actions' ? (
                  <TableSortLabel
                    active={sortConfig.key === col}
                    direction={sortConfig.key === col ? sortConfig.direction : 'asc'}
                    onClick={() => onSort(col)}
                    sx={{ color: '#F8FAFC', '&.Mui-active': { color: '#F8FAFC' } }}
                  >
                    {col}
                  </TableSortLabel>
                ) : col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
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
                  {typeof actions === 'function'
                    ? actions(row)
                    : actions.map((action, i) => (
                        <action.Component
                          key={i}
                          onClick={() => action.onClick(row)}
                          sx={{ mr: 1 }}
                        >
                          {action.label}
                        </action.Component>
                      ))}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReusableTable;

const ReusableTable = ({ columns, rows, getRowData, actions }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((col, idx) => (
            <TableCell key={idx}>{col}</TableCell>
          ))}
          {actions && <TableCell>Actions</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, idx) => (
          <TableRow key={idx}>
            {getRowData(row).map((cell, cIdx) => (
              <TableCell key={cIdx}>{cell}</TableCell>
            ))}
            {actions && (
              <TableCell>
                {actions(row)}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default ReusableTable
import React, { useState } from 'react';
import { Button } from '@mui/material';
import BudgetStatus from './BudgetStatus';

const BudgetStatusPage = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <BudgetStatus key={refresh} />
      <Button onClick={() => setRefresh((prev) => !prev)} variant="outlined" sx={{ mt: 2 }}>
        Refresh Status
      </Button>
    </>
  );
};

export default BudgetStatusPage;

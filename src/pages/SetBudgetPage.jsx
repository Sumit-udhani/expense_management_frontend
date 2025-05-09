import React, { useState } from 'react';
import { Button } from '@mui/material';
import SetBudgetForm from '../Component/setBudgetForm';

const SetBudgetPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained">
        Set Monthly Budget
      </Button>
      <SetBudgetForm open={open} handleClose={() => setOpen(false)} onSuccess={() => setOpen(false)} />
    </>
  );
};

export default SetBudgetPage;

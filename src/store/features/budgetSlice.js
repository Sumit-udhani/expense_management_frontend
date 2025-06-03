import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInterceptor";


export const fetchBudgetStatus = createAsyncThunk('budget/fetchBudgetStatus', async({month,year},thunkApi) =>{
    const response = await api.get(`/budget/status/${month}/${year}`)
    return response.data;
})
export const fetchCategoryDistribution = createAsyncThunk(
    'budget/fetchCategoryDistribution',
    async ({ month, year }, thunkAPI) => {
      const response = await api.get(`/budget/category-distribution?month=${month}&year=${year}`);
      return response.data;
    }
  );
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axiosInterceptor";

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (
    { page = 1, search = "", sortColumn = "title", sortOrder = "asc" },
    thunkAPI
  ) => {
    const response = await api.get(
      `/expense?page=${page}&search=${search}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
    );
    return {
      data: response.data.data,
      totalPages: response.data.totalPages,
    };
  }
);

export const addExpenses = createAsyncThunk(
  "expenses/add",
  async (expenseData) => {
    const response = await api.post("/expense", expenseData);
    return response.data;
  }
);
export const updateExpenses = createAsyncThunk(
  "expenses/update",
  async ({ id, updates }) => {
    const response = await api.put(`/expense/${id}`, updates);
    return response.data;
  }
);
export const deleteExpense = createAsyncThunk("expenses/delete", async (id) => {
  await api.delete(`/expense/${id}`);
  return id;
});
const expenseSlice = createSlice({
    name: "expenses",
    initialState: {
      items: [],
      loading: false,
      error: null,
      totalPages: 1,
      currentPage: 1,
      search: "",
      sortColumn: "title",
      sortOrder: "asc",
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchExpenses.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchExpenses.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload.data;
          state.totalPages = action.payload.totalPages;
        })
        .addCase(fetchExpenses.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "Failed to fetch expenses";
        })
        .addCase(addExpenses.fulfilled, (state, action) => {
          state.items.push(action.payload);
        })
        .addCase(updateExpenses.fulfilled, (state, action) => {
          const idx = state.items.findIndex((e) => e.id === action.payload.id);
          if (idx !== -1) state.items[idx] = action.payload;
        })
        .addCase(deleteExpense.fulfilled, (state, action) => {
          state.items = state.items.filter((e) => e.id !== action.payload);
        });
    },
  });
  
  export default expenseSlice.reducer;
  

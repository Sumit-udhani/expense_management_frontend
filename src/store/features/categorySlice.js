import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axiosInterceptor";
export const fetchCategories = createAsyncThunk('categories/fetchAll', async() =>{
    const response = await api.get('/category')
    return response.data
})
export const addCategories  = createAsyncThunk('categories/add',async(categoryData) =>{
    const response  = await api.post('/category',categoryData)
    return response.data;

})
 const categoriesSlice  = createSlice({
    name:'categories',
    initialState:{
        items:[],
        loading: false,
        error: null,
    },
    reducers:{},
    extraReducers: (builder) =>{
        builder.addCase(fetchCategories.pending,(state) =>{
            state.loading = true
        })
        .addCase(fetchCategories.fulfilled,(state,action) =>{
            state.loading = false,
            state.items = action.payload

        })
        .addCase(fetchCategories.rejected,(state,action) =>{
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(addCategories.fulfilled,(state,action) =>{
            state.items.push(action.payload)
        })
    }
 })

export default categoriesSlice.reducer;
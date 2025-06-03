import {configureStore} from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import expensesReducer from './features/expenseSlice'
import categoriesReducer from './features/categorySlice'

export const store = configureStore({
    reducer:{
        auth: authReducer,
        expenses: expensesReducer,
        categories: categoriesReducer
    }
})
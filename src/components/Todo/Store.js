import { configureStore } from '@reduxjs/toolkit'
import todoReducer from '../Todo/TodoSlice'
import counterReducer from '../Counter/CounterSlice'

export const myStore = configureStore({
	reducer: {
		counter: counterReducer,
		todo: todoReducer
	}
})

export default myStore
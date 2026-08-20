import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./Counter/CounterSlice";
import todoReducer from "./Todo/TodoSlice";

const myStore = configureStore({
    reducer: {
        count: counterReducer,
        todo: todoReducer
    }
})

export default myStore
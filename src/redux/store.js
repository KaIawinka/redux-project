import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./conuter/counterSlice"

const myStore = configureStore({
    reducer: {
        count: counterReducer
    }
})

export default myStore
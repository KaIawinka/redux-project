import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    timer: 3,
  },
  reducers: {
    addCounter: (state) => {
      state.timer += 1;
    },
    minusCounter: (state) => {
      state.timer -= 1;
    },
  },
});

export const { addCounter, minusCounter } = counterSlice.actions;
export default counterSlice.reducer;
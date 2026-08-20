import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    timer: 0,
  },
  reducers: {
    addCounter: (state) => {
      state.timer = state.timer + 1;
    },
    minusCounter: (state) => {
      if (state.timer > 0) {
        state.timer -= 1;
      }
    },
  },
});

export const { addCounter, minusCounter } = counterSlice.actions;
export default counterSlice.reducer;
import { createSlice, nanoid } from "@reduxjs/toolkit";

const todoSlice = createSlice({
	name: "todo",
	initialState: {
		list: [
			{ id: 1, title: "airplane", completed: true },
			{ id: 2, title: "airplane2", completed: false },
		],
	},
	reducers: {
		addTodo: (state, action) => {
			const newTodo = {
				id: nanoid(),
				title: action.payload,
				completed: false,
			};
			state.list.push(newTodo);
		},
	},
});

export const { addTodo } = todoSlice.actions;
export default todoSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";


const todoSlice = createSlice({
	name: "todo",
	initialState: {
		list: [
			{
				id: 1,
				title: "airplane",
				complited: true,
			},
			{
				id: 2,
				title: "airplane2",
				complited: false,
			}
		]
	},
	reducers: {
		addTodo: (state, action) => {
			console.log(action);
		}
	}
})

export const {} = todoSlice.actions
export default todoSlice.reducer
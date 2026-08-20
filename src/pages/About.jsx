import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addTodo } from '../redux/Todo/TodoSlice'
import '../styles/About.css'

function About() {
	const dispatch = useDispatch()
	const { list } = useSelector((state) => state.todo)
	const [text, setText] = useState('')

	const handleAdd = () => {
		if (!text.trim()) return
		dispatch(addTodo(text))
		setText('')
	}

	return (
		<div className="todo-container">
			<div className="todo-form">
				<input
					type="text"
					className="todo-input"
					placeholder="Enter Task"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<button className="todo-button" onClick={handleAdd}>
					add Task
				</button>
			</div>
			<ul className="todo-list">
				{list.map((item) => (
					<li key={item.id} className="todo-item">
						<span>{item.title}</span>
						<div className="todo-actions">
							<span className={`todo-status ${item.completed ? 'completed' : 'pending'}`}>
								{item.completed ? '✓' : '✗'}
							</span>
							<span className="todo-id">ID: {item.id}</span>
							<button className="todo-delete">
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

export default About
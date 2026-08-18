import React from 'react'
import { NavLink } from 'react-router'
import './Header.css'

function Header() {
	return (
		<header>
			<NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
				Home
			</NavLink>
			<NavLink to="/About" className={({ isActive }) => (isActive ? 'active' : '')}>
				About
			</NavLink>
		</header>
	)
}

export default Header
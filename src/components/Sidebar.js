import React from 'react';
import FilterLink from '../containers/FilterLink';
import '../styles/Sidebar.css';

const Sidebar = () => (
	<div className="sidebar-wrapper">
		<div className="sidebar">
			<FilterLink filter='/search:'><i className="fas fa-user"></i></FilterLink>
			<FilterLink filter='artist'><i className="fas fa-user"></i></FilterLink>
			<FilterLink filter='album'><i className="fas fa-compact-disc"></i></FilterLink>
			<FilterLink filter='genre'><i className="fas fa-cube"></i></FilterLink>
		</div>
	</div>
)

export default Sidebar;
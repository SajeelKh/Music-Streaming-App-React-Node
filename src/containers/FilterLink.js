import React from 'react';
import {NavLink} from 'react-router-dom';
import '../styles/Sidebar.css';

const FilterLink = ({filter, children}) => (
	<NavLink
		to={filter === 'all' ? '' : `/${filter}`}
		className="link"
		activeClassName="activeLink"
		>
		{children}
	</NavLink>
);

export default FilterLink;
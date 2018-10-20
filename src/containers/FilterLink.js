import React from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import '../styles/Sidebar.css';

var FilterLink = ({filter, children, match}) => {
	var path = "";
	const keys = Object.keys(match.params);
	console.log(match.params);
	console.log(keys);
	keys.forEach(key => {
		if(match.params[key])
			path += `/${match.params[key]}`
	});
	console.log(path);

	return (
		<NavLink
			to={filter === 'all' ? '' : `${path}/${filter}`}
			className="link"
			activeClassName="activeLink"
			>
			{children}
		</NavLink>
	);
}

FilterLink = withRouter(FilterLink);

export default FilterLink;
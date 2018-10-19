import React from 'react';
import MusicBar from '../containers/MusicBar';
import Library from '../containers/Library';
import Sidebar from './Sidebar';
import '../styles/App.css';

const App = () => (
	<div className="app">
		<Sidebar />
		<Library />
		<MusicBar />
	</div>
)

export default App;
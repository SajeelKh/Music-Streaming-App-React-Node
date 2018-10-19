import React from 'react';
import {Provider} from 'react-redux';
import configureStore from '../configureStore';
import {BrowserRouter, Route} from 'react-router-dom';
import App from './App';
import '../styles/App.css';

const store = configureStore();

const Root = () => (
	<div className="root">
		<Provider store = {store}>
			<BrowserRouter>
				<Route exact path={'/:filter?/:search?'} component={App}/>
			</BrowserRouter>
		</Provider>
	</div>
)

export default Root;
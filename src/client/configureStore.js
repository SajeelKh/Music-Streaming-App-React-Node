import {createStore, applyMiddleware} from 'redux';
import rootReducer from './reducers';

const loggingMW = (store) => {
	return (next) => {

		return (action) => {
			console.group(action.type);
			console.log('%c Previous State: ', 'color: red', store.getState());
			console.log('%c Action: ', 'color: gray', action);
			const returnValue = next(action);
			console.log('%c Next State: ', 'color: green', store.getState());
			console.groupEnd(action.type);
			return returnValue;
		}
	}
}

// const PromiseMW = (store) => {
// 	const prevDispatch = store.dispatch;

// 	return (action) => {
// 		if(typeof action.then === 'function')
// 			return action.then(prevDispatch);
// 		else
// 			return prevDispatch(action);
// 	}
// }

const thunkMW = (store) => (next) => (action) => {
	typeof action === 'function'?
	action(store.dispatch, store.getState):
	next(action);
}

const configureStore = () => {
	
	const middleware = [thunkMW];
	
	if(process.env.NODE_ENV !== 'production')
		middleware.push(loggingMW);

	//store.dispatch = PromiseMW(store);

	const store = createStore(
		rootReducer,
		applyMiddleware(...middleware),
	);

	return store;
}

export default configureStore;
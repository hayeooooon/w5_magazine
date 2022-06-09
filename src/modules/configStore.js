import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import magazineItems from './redux/magazineItems';

const middlewares = [thunk];
const rootReducer = combineReducers({magazineItems});
const enhancer = applyMiddleware(...middlewares);
const store = createStore(rootReducer, enhancer);

export default store;

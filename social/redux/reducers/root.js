import { combineReducers } from 'redux';
import alertReducer from './alertReducer';
import authLoadingReducer from './authLoadingReducer.js';
import authReducer from './authReducer';
import loadingReducer from './loadingReducer';
import profileReducer from './profileReducer';

export default combineReducers({
	auth: authReducer,
	loading: loadingReducer,
	alert: alertReducer,
	authLoading: authLoadingReducer,
	profile: profileReducer,
});

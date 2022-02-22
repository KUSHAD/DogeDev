import { combineReducers } from 'redux';
import alertReducer from './global/alertReducer';
import authReducer from './global/authReducer';
import loadingReducer from './global/loadingReducer';

export default combineReducers({
	auth: authReducer,
	loading: loadingReducer,
	alert: alertReducer,
});
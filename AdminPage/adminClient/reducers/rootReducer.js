import { combineReducers } from 'redux';
import admin from './admin';
import globalError  from './globalError';
import products  from './products';

export default combineReducers({
    admin,
    globalError,
    products
});
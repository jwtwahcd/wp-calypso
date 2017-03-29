/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { WOOCOMMERCE_EDIT_PRODUCT } from '../action-types';

export const initialState = {
	add: {},
};

export function edits( state = initialState, action ) {
	const add = state.add || {};
	switch ( action.type ) {
		case WOOCOMMERCE_EDIT_PRODUCT:
			const { id, key, value } = action.payload;

			if ( ! id ) {
				const newAdd = Object.assign( {}, add, { [ key ]: value } );
				return Object.assign( {}, state, { add: newAdd } );
			}

			// @Todo Logic for editing an existing entry.
			break;

		default:
			return state;
	}
}

export default combineReducers( {
	edits,
} );

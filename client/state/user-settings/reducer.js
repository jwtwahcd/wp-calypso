/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { merge, omit } from 'lodash';

/**
 * Internal dependencies
 */
import {
	USER_SETTINGS_FETCH,
	USER_SETTINGS_FETCH_SUCCESS,
	USER_SETTINGS_FETCH_FAILURE,
	USER_SETTINGS_SAVE_SUCCESS,
	USER_SETTINGS_RECEIVE,
	USER_SETTINGS_UNSAVED_SET,
	USER_SETTINGS_UNSAVED_REMOVE,
} from 'state/action-types';
import { createReducer } from 'state/utils';
import { decodeEntities } from 'lib/formatting';

/*
 * Decodes entities in those specific user settings properties
 * that the REST API returns already HTML-encoded
 */
function decodeUserSettingsEntities( data ) {
	const decodedValues = {
		display_name: data.display_name && decodeEntities( data.display_name ),
		description: data.description && decodeEntities( data.description ),
		user_URL: data.user_URL && decodeEntities( data.user_URL )
	};

	return merge( {}, data, decodedValues );
}

/**
 * Returns the updated remote values state after an action has been dispatched.
 * The remote values state reflects preferences which are persisted to the REST
 * API current user settings endpoint.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export const settings = createReducer( false, {
	[ USER_SETTINGS_RECEIVE ]: ( state, { values } ) => {
		return merge( {}, state || {}, decodeUserSettingsEntities( values ) );
	}
} );

export const unsavedSettings = createReducer( {}, {
	[ USER_SETTINGS_SAVE_SUCCESS ]: ( state, { savedSettingNames } ) => {
		return savedSettingNames ? omit( state, savedSettingNames ) : {};
	},
	[ USER_SETTINGS_UNSAVED_SET ]: ( state, { settingName, value } ) => {
		if ( state[ settingName ] === value ) {
			return state;
		}

		return { ...state, [ settingName ]: value };
	},
	[ USER_SETTINGS_UNSAVED_REMOVE ]: ( state, { settingName } ) => {
		return omit( state, settingName );
	}
} );

export const fetchingSettings = createReducer( false, {
	[ USER_SETTINGS_FETCH_SUCCESS ]: () => false,
	[ USER_SETTINGS_FETCH_FAILURE ]: () => false,
	[ USER_SETTINGS_FETCH ]: () => true,
} );

export const initialized = createReducer( false, {
	[ USER_SETTINGS_FETCH_SUCCESS ]: () => true
} );

export default combineReducers( {
	settings,
	unsavedSettings,
	fetchingSettings,
	initialized,
} );

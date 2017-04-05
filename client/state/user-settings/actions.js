/**
 * External dependencies
 */
import debugFactory from 'debug';
import { isEmpty, keys } from 'lodash';

/**
 * Internal dependencies
 */
import wpcom from 'lib/wp';
import userUtils from 'lib/user/utils';
import {
	USER_SETTINGS_FETCH,
	USER_SETTINGS_FETCH_SUCCESS,
	USER_SETTINGS_FETCH_FAILURE,
	USER_SETTINGS_SAVE_FAILURE,
	USER_SETTINGS_SAVE_SUCCESS,
	USER_SETTINGS_RECEIVE,
	USER_SETTINGS_UNSAVED_SET,
	USER_SETTINGS_UNSAVED_REMOVE,
} from 'state/action-types';

const debug = debugFactory( 'calypso:user:settings' );

/**
 * Fetch user settings from WordPress.com API and store them in UserSettings instance
 * @returns {Function} Action thunk
 */
export function fetchUserSettings() {
	return ( dispatch, getState ) => {
		if ( ! userUtils.isLoggedIn() || getState().userSettings.fetchingSettings ) {
			return;
		}

		dispatch( { type: USER_SETTINGS_FETCH } );

		debug( 'Fetching user settings' );

		const fetchRequest = wpcom.me().settings().get();

		fetchRequest.then( ( data ) => {
			dispatch( receiveUserSettings( data ) );
			dispatch( { type: USER_SETTINGS_FETCH_SUCCESS } );

			debug( 'Settings successfully retrieved' );
		} ).catch( ( error ) => {
			dispatch( {
				type: USER_SETTINGS_FETCH_FAILURE,
				error
			} );
		} );

		// Let the caller know whether the fetch was successful or not
		return fetchRequest;
	};
}

/**
 * Post settings to WordPress.com API at /me/settings endpoint
 *
 * @param {Object} settingsOverride - default settings object
 * @return {Function} Action thunk
 */
export function saveUserSettings( settingsOverride ) {
	return ( dispatch, getState ) => {
		const settings = settingsOverride ? settingsOverride : getState().userSettings.unsavedSettings;

		if ( isEmpty( settings ) ) {
			debug( 'There are no settings to save.' );
			return Promise.resolve( null );
		}

		debug( 'Saving settings: ' + JSON.stringify( settings ) );

		const saveRequest = wpcom.me().settings().update( settings );

		saveRequest.then( ( data ) => {
			dispatch( receiveUserSettings( data ) );
			dispatch( {
				type: USER_SETTINGS_SAVE_SUCCESS,
				savedSettingNames: settingsOverride ? keys( settingsOverride ) : null
			} );

			// Refetch the user data after saving user settings
			// user.fetch();
		} ).catch( ( error ) => {
			dispatch( {
				type: USER_SETTINGS_SAVE_FAILURE,
				error
			} );
		} );

		// Let the caller know whether the save was successful or not
		return saveRequest;
	};
}

/**
 * Returns an action object signalling the settings have been received from server.
 *
 * @param  {Object} values Settings values
 * @return {Object}        Action object
 */
export function receiveUserSettings( values ) {
	return {
		type: USER_SETTINGS_RECEIVE,
		values
	};
}

export function cancelPendingEmailChange() {
	return ( dispatch ) => {
		const saveRequest = wpcom.me().settings().update( {
			user_email_change_pending: false
		} );

		saveRequest.then( ( data ) => {
			dispatch( receiveUserSettings( data ) );
		} );

		// Let the caller know whether the save was successful or not
		return saveRequest;
	};
}
/**
 * Handles the storage and removal of changed setting that are pending
 * being saved to the WPCOM API.
 *
 * @param  {String} settingName - setting name
 * @param  {*} value - setting value
 * @return {Function} Action thunk that returns updating successful response
 */
export function updateUserSetting( settingName, value ) {
	return ( dispatch, getState ) => {
		const { settings } = getState().userSettings;

		if ( ! settings || settings[ settingName ] === undefined ) {
			debug( settingName + ' does not exist in user-settings data module.' );
			return false;
		}

		/*
		 * If the two match, we don't consider the setting "changed".
		 * user_login is a special case since the logic for validating and saving a username
		 * is more complicated.
		 */
		if ( settings[ settingName ] === value && 'user_login' !== settingName ) {
			debug( 'Removing ' + settingName + ' from changed settings.' );
			dispatch( removeUnsavedUserSetting( settingName ) );
		} else {
			dispatch( updateUnsavedUserSetting( settingName, value ) );
		}

		return true;
	};
}

export function updateUnsavedUserSetting( settingName, value ) {
	return {
		type: USER_SETTINGS_UNSAVED_SET,
		settingName,
		value
	};
}

export function removeUnsavedUserSetting( settingName ) {
	return {
		type: USER_SETTINGS_UNSAVED_REMOVE,
		settingName
	};
}

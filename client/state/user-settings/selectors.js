/**
 * External dependencies
 */
import isEmpty from 'lodash/isEmpty';

/**
 * Returns a boolean signifying whether there are settings or not
 *
 * @param  {Object} state Global state tree
 * @return {Boolean} true is the user has settings object
 */
export function hasUserSettings( state ) {
	return !! state.userSettings.settings;
}

export function getUserSettings( state ) {
	return state.userSettings.settings;
}

export function isFetchingUserSettings( state ) {
	return state.userSettings.fetchingSettings;
}

/**
 * Given a settingName, returns that original setting if it exists or null
 *
 * @param  {Object} state Global state tree
 * @param  {String} settingName - setting name
 * @return {*} setting key value
 */
export function getOriginalUserSetting( state, settingName ) {
	const { settings } = state.userSettings;
	let setting = null;

	if ( settings && settings[ settingName ] !== undefined ) {
		setting = settings[ settingName ];
	}

	return setting;
}

/**
 * Is two-step enabled for the current user?
 *
 * @param  {Object} state Global state tree
 * @return {Boolean} return true if two-step is enabled
 */
export function isTwoStepEnabled( state ) {
	const { settings } = state.userSettings;
	return settings ? settings.two_step_enabled : false;
}

/**
 * Is two-step sms enabled for the current user?
 *
 * @param  {Object} state Global state tree
 * @return {Boolean} return true if two-step sms is enabled
 */
export function isTwoStepSMSEnabled( state ) {
	const { settings } = state.userSettings;
	return settings ? settings.two_step_sms_enabled : false;
}

/**
 * Returns true if there is a pending email change, false if not.
 *
 * @param  {Object} state Global state tree
 * @return {Boolean} pending email state
 */
export function isPendingEmailChange( state ) {
	const { settings } = state.userSettings;
	return settings ? !! this.settings.new_user_email : false;
}

/**
 * Given a settingName, returns that setting if it exists or null
 *
 * @param  {Object} state Global state tree
 * @param  {String} settingName - setting name
 * @return {*} setting name value
 */
export function getUserSetting( state, settingName ) {
	const { settings, unsavedSettings } = state.userSettings;
	let setting = null;

	// If we haven't fetched settings, or if the setting doesn't exist return null
	if ( settings && settings[ settingName ] !== undefined ) {
		setting = unsavedSettings[ settingName ] !== undefined
			? unsavedSettings[ settingName ]
			: settings[ settingName ];
	}

	return setting;
}

export function isUserSettingUnsaved( state, settingName ) {
	const { unsavedSettings } = state.userSettings;
	return ( settingName in unsavedSettings );
}

export function hasUnsavedUserSettings( state ) {
	const { unsavedSettings } = state.userSettings;
	return ! isEmpty( unsavedSettings );
}

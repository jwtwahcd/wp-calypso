/**
 * External Dependencies
 */
import { translate } from 'i18n-calypso';

/**
 * Internal Dependencies
 */
import {
	READER_SUBSCRIBE_TO_NEW_POST_EMAIL,
	READER_UNSUBSCRIBE_TO_NEW_POST_EMAIL,
} from 'state/action-types';
import { http } from 'state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'state/data-layer/wpcom-http/utils';
import { errorNotice } from 'state/notices/actions';

function requestPostEmailSubscription( { dispatch }, action, next ) {
	const siteId = action.payload.site;
	dispatch( http( {
		method: 'POST',
		path: `/read/site/$siteId/post_email_subscriptions/new`
	} ) );
}

function receivePostEmailSubscription( store, action, next, response ) {

}

function receivePostEmailSubscriptionError( { dispatch }, action, next, error ) {
	dispatch( errorNotice( translate( 'Sorry, we had a problem subscribing. Please try again.' ) ) );
	// dispatch an unsubscribe
	next( );
}

function requestPostEmailUnsubscription() {

}

function receivePostEmailUnsubscription() {

}

function receivePostEmailUnsubscriptionError() {

}

export default {
	[ READER_SUBSCRIBE_TO_NEW_POST_EMAIL ]: [
		dispatchRequest( requestPostEmailSubscription, receivePostEmailSubscription, receivePostEmailSubscriptionError )
	],
	[ READER_UNSUBSCRIBE_TO_NEW_POST_EMAIL ]: [
		dispatchRequest( requestPostEmailUnsubscription, receivePostEmailUnsubscription, receivePostEmailUnsubscriptionError )
	],
};

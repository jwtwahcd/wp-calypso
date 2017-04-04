/**
 * External Dependencies
 */
import { omit } from 'lodash';
import { translate } from 'i18n-calypso';

/**
 * Internal Dependencies
 */
import {
	READER_SUBSCRIBE_TO_NEW_POST_EMAIL,
	READER_UNSUBSCRIBE_TO_NEW_POST_EMAIL,
	READER_UPDATE_NEW_POST_EMAIL_SUBSCRIPTION,
} from 'state/action-types';
import { http } from 'state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'state/data-layer/wpcom-http/utils';
import { subscribeToNewPostEmails, unsubscribeToNewPostEmails } from 'state/reader/follows/actions';
import { errorNotice } from 'state/notices/actions';

function requestPostEmailSubscription( { dispatch }, action, next ) {
	dispatch( http( {
		method: 'POST',
		path: `/read/site/${ action.payload.blogId }/post_email_subscriptions/new`,
		onSuccess: action,
		onFailure: action,
	} ) );
	next( action );
}

function receivePostEmailSubscription( store, action, next, response ) {
	// validate that it worked
	// if it did, just swallow this response, as we don't need to pass it along.
	console.log( response );
}

function receivePostEmailSubscriptionError( { dispatch }, action, next, error ) {
	dispatch( errorNotice( translate( 'Sorry, we had a problem subscribing. Please try again.' ) ) );
	// dispatch an unsubscribe
	next( unsubscribeToNewPostEmails( action.payload.blogId ) );
	console.log( error );
}

function updatePostEmailSubscription( { dispatch }, action, next ) {
	dispatch( http( {
		method: 'POST',
		path: `/read/site/${ action.payload.blogId }/post_email_subscriptions/update`,
		body: omit( action.payload, 'blogId' ),
		onSuccess: action,
		onFailure: action,
	} ) );
	next( action );
}

function receiveUpdatePostEmailSubscription( { dispatch }, action, next, response ) {
	console.log( response );
}

function receiveUpdatePostEmailSubscriptionError( { dispatch }, action, next, error ) {
	dispatch( errorNotice( translate( 'Sorry, we had a problem updating that subscription. Please try again.' ) ) );
	console.log( error );
}

function requestPostEmailUnsubscription( { dispatch }, action, next ) {
	dispatch( http( {
		method: 'POST',
		path: `/read/site/${ action.payload.blogId }/post_email_subscriptions/delete`,
		onSuccess: action,
		onFailure: action,
	} ) );
	next( action );
}

function receivePostEmailUnsubscription( store, action, next, response ) {
	// validate that it worked
	// if it did, just swallow this response, as we don't need to pass it along.
	console.log( response );
}

function receivePostEmailUnsubscriptionError( { dispatch }, action, next, error ) {
	dispatch( errorNotice( translate( 'Sorry, we had a problem unsubscribing. Please try again.' ) ) );
	next( subscribeToNewPostEmails( action.payload.blogId ) );
	console.log( error );
}

export default {
	[ READER_SUBSCRIBE_TO_NEW_POST_EMAIL ]: [
		dispatchRequest(
			requestPostEmailSubscription,
			receivePostEmailSubscription,
			receivePostEmailSubscriptionError
		)
	],
	[ READER_UPDATE_NEW_POST_EMAIL_SUBSCRIPTION ]: [
		dispatchRequest(
			updatePostEmailSubscription,
			receiveUpdatePostEmailSubscription,
			receiveUpdatePostEmailSubscriptionError
		)
	],
	[ READER_UNSUBSCRIBE_TO_NEW_POST_EMAIL ]: [
		dispatchRequest(
			requestPostEmailUnsubscription,
			receivePostEmailUnsubscription,
			receivePostEmailUnsubscriptionError
		)
	],
};

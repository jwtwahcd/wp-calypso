/**
 *
 *//**
 * External Dependencies
 */
import { omit } from 'lodash';
import { translate } from 'i18n-calypso';

/**
 * Internal Dependencies
 */
import {
	READER_SUBSCRIBE_TO_NEW_COMMENT_EMAIL,
	READER_UNSUBSCRIBE_TO_NEW_COMMENT_EMAIL
} from 'state/action-types';
import { http } from 'state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'state/data-layer/wpcom-http/utils';
import { subscribeToNewCommentEmails, unsubscribeToNewCommentEmails } from 'state/reader/follows/actions';
import { errorNotice } from 'state/notices/actions';

function requestCommentEmailSubscription( { dispatch }, action, next ) {
	dispatch( http( {
		method: 'POST',
		path: `/read/site/${ action.payload.blogId }/comment_email_subscriptions/new`,
		apiVersion: '1.2',
		onSuccess: action,
		onFailure: action,
	} ) );
	next( action );
}

function receiveCommentEmailSubscription( store, action, next, response ) {
	// validate that it worked
	// if it did, just swallow this response, as we don't need to pass it along.
	console.log( response );
}

function receiveCommentEmailSubscriptionError( { dispatch }, action, next, error ) {
	dispatch( errorNotice( translate( 'Sorry, we had a problem subscribing. Please try again.' ) ) );
	// dispatch an unsubscribe
	next( unsubscribeToNewCommentEmails( action.payload.blogId ) );
	console.log( error );
}

function requestCommentEmailUnsubscription( { dispatch }, action, next ) {
	dispatch( http( {
		method: 'POST',
		path: `/read/site/${ action.payload.blogId }/post_email_subscriptions/delete`,
		apiVersion: '1.2',
		onSuccess: action,
		onFailure: action,
	} ) );
	next( action );
}

function receiveCommentEmailUnsubscription( store, action, next, response ) {
	// validate that it worked
	// if it did, just swallow this response, as we don't need to pass it along.
	console.log( response );
}

function receiveCommentEmailUnsubscriptionError( { dispatch }, action, next, error ) {
	dispatch( errorNotice( translate( 'Sorry, we had a problem unsubscribing. Please try again.' ) ) );
	next( subscribeToNewCommentEmails( action.payload.blogId ) );
	console.log( error );
}

export default {
	[ READER_SUBSCRIBE_TO_NEW_COMMENT_EMAIL ]: [
		dispatchRequest(
			requestCommentEmailSubscription,
			receiveCommentEmailSubscription,
			receiveCommentEmailSubscriptionError
		)
	],
	[ READER_UNSUBSCRIBE_TO_NEW_COMMENT_EMAIL ]: [
		dispatchRequest(
			requestCommentEmailUnsubscription,
			receiveCommentEmailUnsubscription,
			receiveCommentEmailUnsubscriptionError
		)
	],
};

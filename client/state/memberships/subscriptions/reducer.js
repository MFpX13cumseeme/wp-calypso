import {
	MEMBERSHIPS_SUBSCRIPTIONS_RECEIVE,
	MEMBERSHIPS_SUBSCRIPTION_STOP,
	MEMBERSHIPS_SUBSCRIPTION_STOP_SUCCESS,
	MEMBERSHIPS_SUBSCRIPTION_STOP_FAILURE,
} from 'calypso/state/action-types';
import { combineReducers } from 'calypso/state/utils';

/**
 * Returns the updated items state after an action has been dispatched.
 * The state contains all past and upcoming billing transactions.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @returns {Object}        Updated state
 */
export const items = ( state = [], action ) => {
	switch ( action.type ) {
		case MEMBERSHIPS_SUBSCRIPTIONS_RECEIVE: {
			const { subscriptions } = action;
			return subscriptions;
		}
		case MEMBERSHIPS_SUBSCRIPTION_STOP_SUCCESS: {
			const { subscriptionId } = action;
			return state.filter( ( sub ) => sub.ID !== subscriptionId );
		}
	}

	return state;
};

export const stoppingSubscription = ( state = [], action ) => {
	switch ( action.type ) {
		case MEMBERSHIPS_SUBSCRIPTION_STOP: {
			const { subscriptionId } = action;

			return {
				...state,
				[ subscriptionId ]: 'start',
			};
		}
		case MEMBERSHIPS_SUBSCRIPTION_STOP_SUCCESS: {
			const { subscriptionId } = action;

			return {
				...state,
				[ subscriptionId ]: 'success',
			};
		}
		case MEMBERSHIPS_SUBSCRIPTION_STOP_FAILURE: {
			const { subscriptionId } = action;

			return {
				...state,
				[ subscriptionId ]: 'fail',
			};
		}
	}

	return state;
};

export default combineReducers( {
	items,
	stoppingSubscription,
} );

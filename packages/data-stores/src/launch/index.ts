import { registerStore } from '@wordpress/data';
import { controls } from '@wordpress/data-controls';
import { registerPlugins } from '../plugins';
import * as actions from './actions';
import { STORE_KEY } from './constants';
import reducer, { State } from './reducer';
import * as selectors from './selectors';

export type { State };
export type { LaunchStepType } from './types';
export { STORE_KEY };

registerPlugins();

let isRegistered = false;

export function register(): typeof STORE_KEY {
	if ( ! isRegistered ) {
		isRegistered = true;
		registerStore( STORE_KEY, {
			actions,
			controls,
			reducer,
			selectors,
			persist: [
				'domain',
				'domainSearch',
				'planProductId',
				'planBillingPeriod',
				'confirmedDomainSelection',
				'isAnchorFm',
				'isSiteTitleStepVisible',
				'siteTitle',
			],
		} );
	}
	return STORE_KEY;
}

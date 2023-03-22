import {
	planMatches,
	PlanSlug,
	TERM_ANNUALLY,
	TERM_BIENNIALLY,
	TERM_MONTHLY,
	TERM_TRIENNIALLY,
} from '@automattic/calypso-products';

const useBillingMonthsForPlan = ( planSlug: PlanSlug ) => {
	if ( planMatches( planSlug, { term: TERM_TRIENNIALLY } ) ) {
		return 36;
	}

	if ( planMatches( planSlug, { term: TERM_BIENNIALLY } ) ) {
		return 24;
	}

	if ( planMatches( planSlug, { term: TERM_ANNUALLY } ) ) {
		return 12;
	}

	if ( planMatches( planSlug, { term: TERM_MONTHLY } ) ) {
		return 1;
	}

	return 1;
};

export default useBillingMonthsForPlan;

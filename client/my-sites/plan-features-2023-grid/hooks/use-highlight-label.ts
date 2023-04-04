import {
	isBusinessPlan,
	isPremiumPlan,
	isWooExpressMediumPlan,
} from '@automattic/calypso-products';
import { useTranslate } from 'i18n-calypso';
import { useSelector } from 'react-redux';
import { NEWSLETTER_FLOW } from 'calypso/../packages/onboarding/src';
import { getCurrentPlan } from 'calypso/state/sites/plans/selectors';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';

const useHighlightLabel = ( planName: string, flowName?: string ) => {
	const translate = useTranslate();
	const selectedSiteId = useSelector( getSelectedSiteId );
	const currentPlan = useSelector( ( state ) => getCurrentPlan( state, selectedSiteId ) );
	const isCurrentPlan = currentPlan?.productSlug === planName;

	if ( flowName === NEWSLETTER_FLOW ) {
		if ( isPremiumPlan( planName ) ) {
			return translate( 'Best for Newsletter' );
		}
	} else if ( isCurrentPlan ) {
		return translate( 'Your plan' );
	} else if ( isBusinessPlan( planName ) ) {
		return translate( 'Best for devs' );
	} else if ( isPremiumPlan( planName ) || isWooExpressMediumPlan( planName ) ) {
		return translate( 'Popular' );
	}

	return null;
};

export default useHighlightLabel;

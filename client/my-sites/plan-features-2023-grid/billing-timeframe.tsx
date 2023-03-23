import {
	isWpComFreePlan,
	isWpcomEnterpriseGridPlan,
	PlanSlug,
	getPlanSlugForTermVariant,
	TERM_ANNUALLY,
} from '@automattic/calypso-products';
import { Plans } from '@automattic/data-stores';
import { formatCurrency } from '@automattic/format-currency';
import { useLocale } from '@automattic/i18n-utils';
import { useSelect } from '@wordpress/data';
import { localize, TranslateResult, useTranslate } from 'i18n-calypso';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import usePlanPrices from 'calypso/my-sites/plans/hooks/use-plan-prices';
import { getCurrentUserCurrencyCode } from 'calypso/state/currency-code/selectors';
import { PLANS_STORE } from './store';
import type { PlansSelect } from '@automattic/data-stores';

interface Props {
	planName: string;
	billingTimeframe: TranslateResult;
	isMonthlyPlan: boolean;
}

function usePerMonthDescription( { isMonthlyPlan, planName }: Omit< Props, 'billingTimeframe' > ) {
	const translate = useTranslate();
	const currencyCode = useSelector( getCurrentUserCurrencyCode );
	const planPrices = usePlanPrices( {
		planSlug: planName as PlanSlug,
		returnMonthly: isMonthlyPlan,
	} );
	const planYearlyVariantPrices = usePlanPrices( {
		planSlug:
			getPlanSlugForTermVariant( planName as PlanSlug, TERM_ANNUALLY ) ?? ( '' as PlanSlug ),
		returnMonthly: true,
	} );
	const maybeDiscountedPrice =
		planPrices.planDiscountedRawPrice || planPrices.discountedRawPrice || planPrices.rawPrice;
	// we want the raw price (discounted or not) for the yearly variant, not the site-plan discounted one
	const yearlyVariantMaybeDiscountedPrice =
		planYearlyVariantPrices.discountedRawPrice || planYearlyVariantPrices.rawPrice;
	const locale = useLocale();
	const plan = useSelect(
		( select ) =>
			( select( PLANS_STORE ) as PlansSelect ).getPlanProductByStoreSlug( planName, locale ),
		[ planName ]
	);

	if ( ! plan || isWpComFreePlan( planName ) || isWpcomEnterpriseGridPlan( planName ) ) {
		return null;
	}

	if ( isMonthlyPlan ) {
		if ( yearlyVariantMaybeDiscountedPrice < planPrices.rawPrice ) {
			return translate( `Save %(discountRate)s%% by paying annually`, {
				args: {
					discountRate: Math.round(
						( 100 * ( planPrices.rawPrice - yearlyVariantMaybeDiscountedPrice ) ) /
							planPrices.rawPrice
					),
				},
			} );
		}
	}

	if ( ! isMonthlyPlan ) {
		const fullTermPriceText =
			currencyCode && maybeDiscountedPrice
				? formatCurrency( maybeDiscountedPrice, currencyCode )
				: null;

		if ( Plans.TERM_ANNUALLY === plan?.term ) {
			return translate( 'per month, %(fullTermPriceText)s billed annually', {
				args: { fullTermPriceText },
			} );
		}

		if ( Plans.TERM_BIENNIALLY === plan?.term ) {
			return translate( 'per month, %(fullTermPriceText)s billed every two years', {
				args: { fullTermPriceText },
			} );
		}

		if ( Plans.TERM_TRIENNIALLY === plan?.term ) {
			return translate( 'per month, %(fullTermPriceText)s billed every three years', {
				args: { fullTermPriceText },
			} );
		}
	}

	return null;
}

const PlanFeatures2023GridBillingTimeframe: FunctionComponent< Props > = ( props ) => {
	const { planName, billingTimeframe } = props;
	const translate = useTranslate();

	const perMonthDescription = usePerMonthDescription( props ) || billingTimeframe;
	const price = formatCurrency( 25000, 'USD' );

	if ( isWpcomEnterpriseGridPlan( planName ) ) {
		return (
			<div className="plan-features-2023-grid__vip-price">
				{ translate( 'Starts at {{b}}%(price)s{{/b}} yearly.', {
					args: { price },
					components: { b: <b /> },
					comment: 'Translators: the price is in US dollars for all users (US$25,000)',
				} ) }
			</div>
		);
	}

	return <div>{ perMonthDescription }</div>;
};

export default localize( PlanFeatures2023GridBillingTimeframe );

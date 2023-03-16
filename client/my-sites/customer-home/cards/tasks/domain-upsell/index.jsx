import { getPlan, isFreePlanProduct, getIntervalTypeForTerm } from '@automattic/calypso-products';
import { useDomainSuggestions } from '@automattic/domain-picker/src';
import { useLocale } from '@automattic/i18n-utils';
import { useShoppingCart } from '@automattic/shopping-cart';
import { useMemo } from '@wordpress/element';
import { useTranslate } from 'i18n-calypso';
import page from 'page';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import domainUpsellMobileIllustration from 'calypso/assets/images/customer-home/illustration--task-domain-upsell-mobile.png';
import { domainRegistration } from 'calypso/lib/cart-values/cart-items';
import { preventWidows } from 'calypso/lib/formatting';
import { addQueryArgs } from 'calypso/lib/url';
import CalypsoShoppingCartProvider from 'calypso/my-sites/checkout/calypso-shopping-cart-provider';
import useCartKey from 'calypso/my-sites/checkout/use-cart-key';
import { TASK_DOMAIN_UPSELL } from 'calypso/my-sites/customer-home/cards/constants';
import Task from 'calypso/my-sites/customer-home/cards/tasks/task';
import { isStagingSite } from 'calypso/sites-dashboard/utils';
import { isCurrentUserEmailVerified } from 'calypso/state/current-user/selectors';
import { getDomainsBySite } from 'calypso/state/sites/domains/selectors';
import { getCurrentPlan } from 'calypso/state/sites/plans/selectors';
import { getSelectedSite, getSelectedSiteSlug } from 'calypso/state/ui/selectors';

import './style.scss';

export default function DomainUpsell() {
	const isEmailVerified = useSelector( isCurrentUserEmailVerified );

	const selectedSite = useSelector( getSelectedSite );
	const selectedSiteSlug = useSelector( getSelectedSiteSlug );

	const currentPlan = useSelector( ( state ) => getCurrentPlan( state, selectedSite?.ID ) );
	const currentPlanIntervalType = getIntervalTypeForTerm(
		getPlan( currentPlan?.productSlug )?.term
	);

	const isFreePlan = isFreePlanProduct( selectedSite?.plan );

	const siteDomains = useSelector( ( state ) => getDomainsBySite( state, selectedSite ) );
	const siteDomainsLength = useMemo(
		() => siteDomains.filter( ( domain ) => ! domain.isWPCOMDomain ).length,
		[ siteDomains ]
	);

	const shouldNotShowMyHomeUpsell = siteDomainsLength || ! isEmailVerified;

	if ( shouldNotShowMyHomeUpsell || isStagingSite( selectedSite ) ) {
		return null;
	}

	const searchTerm = selectedSiteSlug?.split( '.' )[ 0 ];

	return (
		<CalypsoShoppingCartProvider>
			<RenderDomainUpsell
				isFreePlan={ isFreePlan }
				isMonthlyPlan={ currentPlanIntervalType === 'monthly' }
				searchTerm={ searchTerm }
				siteSlug={ selectedSiteSlug }
			/>
		</CalypsoShoppingCartProvider>
	);
}

const domainSuggestionOptions = {
	vendor: 'domain-upsell',
};

export function RenderDomainUpsell( { isFreePlan, isMonthlyPlan, searchTerm, siteSlug } ) {
	const translate = useTranslate();

	const locale = useLocale();

	useEffect( () => {
		const centerDomainSuggestion = () => {
			const svgGroup = document.querySelector( '.task__domain-upsell svg g' );
			if ( svgGroup ) {
				const svgGroupProps = svgGroup.getBBox();
				const svgGroupWidth = ( svgGroupProps.width - 20 ) / 2;
				svgGroup.setAttribute( 'transform', 'translate(-' + svgGroupWidth + ', 0)' );
			}
		};

		centerDomainSuggestion();

		window.addEventListener( 'resize', centerDomainSuggestion );
		return () => {
			window.removeEventListener( 'resize', centerDomainSuggestion );
		};
	} );

	// Note: domainSuggestionOptions must be equal by reference upon each render
	// to avoid a render loop, since it's used to memoize a selector.
	const { allDomainSuggestions } =
		useDomainSuggestions( searchTerm, 3, undefined, locale, domainSuggestionOptions ) || {};

	const cartKey = useCartKey();
	const shoppingCartManager = useShoppingCart( cartKey );

	// Get first non-free suggested domain.
	const domainSuggestion = allDomainSuggestions?.filter(
		( suggestion ) => ! suggestion.is_free
	)[ 0 ];

	// It takes awhile to suggest a domain name. Set a default to an empty string.
	const domainSuggestionName = domainSuggestion?.domain_name ?? '';

	const domainSuggestionProductSlug = domainSuggestion?.product_slug;

	const searchLink = addQueryArgs(
		{
			domainAndPlanPackage: true,
			domain: true,
		},
		`/domains/add/${ siteSlug }`
	);

	const purchaseLink =
		! isFreePlan && ! isMonthlyPlan
			? `/checkout/${ siteSlug }`
			: addQueryArgs(
					{
						domain: true,
						domainAndPlanPackage: true,
					},
					`/plans/yearly/${ siteSlug }`
			  );

	const [ ctaIsBusy, setCtaIsBusy ] = useState( false );
	const getCtaClickHandler = async () => {
		setCtaIsBusy( true );

		try {
			await shoppingCartManager.addProductsToCart( [
				domainRegistration( {
					productSlug: domainSuggestionProductSlug,
					domain: domainSuggestionName,
				} ),
			] );
		} catch {
			// Nothing needs to be done here. CartMessages will display the error to the user.
			return null;
		}
		page( purchaseLink );
	};

	const cardTitle =
		! isFreePlan && ! isMonthlyPlan
			? translate( 'That perfect domain is waiting' )
			: translate( 'Own a domain. Build a site.' );

	const cardSubtitle =
		! isFreePlan && ! isMonthlyPlan
			? translate(
					"{{strong}}%(domainSuggestion)s{{/strong}} is included free for one year with any paid plan. Claim it and start building a site that's easy to find, share and follow.",
					{
						components: {
							strong: <strong />,
						},
						args: {
							domainSuggestion: domainSuggestionName,
						},
					}
			  )
			: translate(
					"{{strong}}%(domainSuggestion)s{{/strong}} is a perfect site address. It's available and easy to find and follow. Get it now and claim a corner of the web.",
					{
						components: {
							strong: <strong />,
						},
						args: {
							domainSuggestion: domainSuggestionName,
						},
					}
			  );

	const domainNameSVG = (
		<svg viewBox="0 0 40 18" id="map">
			<g>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M15 11h-.2V9c0-1.5-1.2-2.8-2.8-2.8S9.2 7.5 9.2 9v2H9c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-4c0-.6-.4-1-1-1zm-1.8 0h-2.5V9c0-.7.6-1.2 1.2-1.2s1.2.6 1.2 1.2v2z"
				/>
				<text x="20" y="15">
					{ domainSuggestionName }
				</text>
			</g>
		</svg>
	);

	return (
		<Task
			customClass="task__domain-upsell"
			title={ cardTitle }
			description={ preventWidows( cardSubtitle ) }
			actionText={ translate( 'Get this domain' ) }
			actionOnClick={ getCtaClickHandler }
			actionBusy={ ctaIsBusy }
			hasSecondaryAction={ true }
			secondaryActionText={ translate( 'Find other domains' ) }
			secondaryActionUrl={ searchLink }
			illustration={ domainUpsellMobileIllustration }
			illustrationAlwaysShow={ true }
			illustrationHeader={ domainSuggestionName ? domainNameSVG : null }
			badgeText={ domainSuggestionName }
			timing={ 2 }
			taskId={ TASK_DOMAIN_UPSELL }
		/>
	);
}

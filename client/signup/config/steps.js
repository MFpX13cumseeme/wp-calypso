import { current as currentPage } from 'page';
import {
	addAddOnsToCart,
	addPlanToCart,
	createAccount,
	createSite,
	createWpForTeamsSite,
	createSiteOrDomain,
	createSiteWithCart,
	setDesignOnSite,
	setThemeOnSite,
	setOptionsOnSite,
	setStoreFeatures,
	setIntentOnSite,
	addDomainToCart,
	launchSiteApi,
	isPlanFulfilled,
	isAddOnsFulfilled,
	isDomainFulfilled,
	isSiteTypeFulfilled,
	isSiteTopicFulfilled,
	maybeRemoveStepForUserlessCheckout,
	isNewOrExistingSiteFulfilled,
	setDIFMLiteDesign,
	excludeStepIfEmailVerified,
	submitWebsiteContent,
	excludeStepIfProfileComplete,
} from 'calypso/lib/signup/step-actions';
import { generateSteps } from './steps-pure';

export default generateSteps( {
	addAddOnsToCart,
	addPlanToCart,
	createAccount,
	createSite,
	createWpForTeamsSite,
	createSiteOrDomain,
	createSiteWithCart,
	currentPage,
	setDesignOnSite,
	setThemeOnSite,
	setOptionsOnSite,
	setStoreFeatures,
	setIntentOnSite,
	addDomainToCart,
	launchSiteApi,
	isPlanFulfilled,
	isAddOnsFulfilled,
	isDomainFulfilled,
	isSiteTypeFulfilled,
	isSiteTopicFulfilled,
	maybeRemoveStepForUserlessCheckout,
	isNewOrExistingSiteFulfilled,
	setDIFMLiteDesign,
	excludeStepIfEmailVerified,
	excludeStepIfProfileComplete,
	submitWebsiteContent,
} );

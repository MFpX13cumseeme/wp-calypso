import { getLanguageRouteParam } from '@automattic/i18n-utils';
import { makeLayout, ssrSetupLocale } from 'calypso/controller';
import { setHrefLangLinks, setLocalizedCanonicalUrl } from 'calypso/controller/localized-links';
import { browsePlugins, browsePluginsOrPlugin } from './controller';

export default function ( router ) {
	const langParam = getLanguageRouteParam();

	router(
		`/${ langParam }/plugins/:plugin`,
		ssrSetupLocale,
		setHrefLangLinks,
		setLocalizedCanonicalUrl,
		browsePluginsOrPlugin,
		makeLayout
	);

	router(
		[ `/${ langParam }/plugins`, `/${ langParam }/plugins/browse/:category` ],
		ssrSetupLocale,
		setHrefLangLinks,
		setLocalizedCanonicalUrl,
		browsePlugins,
		makeLayout
	);

	router( '/plugins/*', makeLayout );
}

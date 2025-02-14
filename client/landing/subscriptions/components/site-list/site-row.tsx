import { Gridicon } from '@automattic/components';
import { SubscriptionManager } from '@automattic/data-stores';
import { useTranslate } from 'i18n-calypso';
import { useMemo } from 'react';
import TimeSince from 'calypso/components/time-since';
import { SiteSettings } from '../settings-popover';
import type {
	SiteSubscription,
	SiteSubscriptionDeliveryFrequency,
} from '@automattic/data-stores/src/reader/types';

const useDeliveryFrequencyLabel = ( deliveryFrequencyValue: SiteSubscriptionDeliveryFrequency ) => {
	const translate = useTranslate();

	const deliveryFrequencyLabels = useMemo(
		() => ( {
			daily: translate( 'Daily' ),
			weekly: translate( 'Weekly' ),
			instantly: translate( 'Instantly' ),
		} ),
		[ translate ]
	);

	return deliveryFrequencyLabels[ deliveryFrequencyValue ];
};

export default function SiteRow( {
	blog_ID,
	name,
	site_icon,
	URL: url,
	date_subscribed,
	delivery_methods,
}: SiteSubscription ) {
	const hostname = useMemo( () => new URL( url ).hostname, [ url ] );
	const siteIcon = useMemo( () => {
		if ( site_icon ) {
			return <img className="icon" src={ site_icon } alt={ name } />;
		}
		return <Gridicon className="icon" icon="globe" size={ 48 } />;
	}, [ site_icon, name ] );

	const deliveryFrequencyValue = useMemo(
		() => delivery_methods?.email?.post_delivery_frequency as SiteSubscriptionDeliveryFrequency,
		[ delivery_methods?.email?.post_delivery_frequency ]
	);
	const deliveryFrequencyLabel = useDeliveryFrequencyLabel( deliveryFrequencyValue );

	const { mutate: updateDeliveryFrequency, isLoading: updatingFrequency } =
		SubscriptionManager.useSiteDeliveryFrequencyMutation();
	const { mutate: unFollow, isLoading: unfollowing } =
		SubscriptionManager.useSiteUnfollowMutation();

	return (
		<li className="row" role="row">
			<a href={ url } rel="noreferrer noopener" className="title-box" target="_blank">
				<span className="title-box" role="cell">
					{ siteIcon }
					<span className="title-column">
						<span className="name">{ name }</span>
						<span className="url">{ hostname }</span>
					</span>
				</span>
			</a>
			<span className="date" role="cell">
				<TimeSince date={ date_subscribed.toISOString?.() ?? date_subscribed } />
			</span>
			<span className="email-frequency" role="cell">
				{ deliveryFrequencyLabel }
			</span>
			<span className="actions" role="cell">
				<SiteSettings
					deliveryFrequency={ deliveryFrequencyValue }
					onDeliveryFrequencyChange={ ( delivery_frequency ) =>
						updateDeliveryFrequency( { blog_id: blog_ID, delivery_frequency } )
					}
					updatingFrequency={ updatingFrequency }
					onUnfollow={ () => unFollow( { blog_id: blog_ID } ) }
					unfollowing={ unfollowing }
				/>
			</span>
		</li>
	);
}

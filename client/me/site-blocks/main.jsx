import { Card } from '@automattic/components';
import { localizeUrl } from '@automattic/i18n-utils';
import { localize } from 'i18n-calypso';
import { times } from 'lodash';
import { Component } from 'react';
import { connect } from 'react-redux';
import DocumentHead from 'calypso/components/data/document-head';
import QuerySiteBlocks from 'calypso/components/data/query-site-blocks';
import FormattedHeader from 'calypso/components/formatted-header';
import InfiniteList from 'calypso/components/infinite-list';
import Main from 'calypso/components/main';
import PageViewTracker from 'calypso/lib/analytics/page-view-tracker';
import { requestSiteBlocks } from 'calypso/state/reader/site-blocks/actions';
import {
	getBlockedSites,
	isFetchingSiteBlocks,
	getSiteBlocksCurrentPage,
	getSiteBlocksLastPage,
} from 'calypso/state/reader/site-blocks/selectors';
import SiteBlockListItem from './list-item';
import SiteBlockListItemPlaceholder from './list-item-placeholder';

import './style.scss';

class SiteBlockList extends Component {
	fetchNextPage = () => {
		const { currentPage, lastPage } = this.props;

		if ( currentPage === lastPage ) {
			return;
		}

		this.props.requestSiteBlocks( { page: currentPage + 1 } );
	};

	renderPlaceholders() {
		return times( 2, ( i ) => (
			<SiteBlockListItemPlaceholder key={ 'site-block-list-item-placeholder-' + i } />
		) );
	}

	renderItem( siteId ) {
		return <SiteBlockListItem key={ 'site-block-list-item-' + siteId } siteId={ siteId } />;
	}

	getItemRef = ( siteId ) => {
		return 'site-block-' + siteId;
	};

	render() {
		const { translate, blockedSites, currentPage, lastPage } = this.props;
		const hasNoBlocks = blockedSites.length === 0 && currentPage === lastPage;

		return (
			<Main wideLayout className="site-blocks">
				<QuerySiteBlocks />
				<PageViewTracker path="/me/site-blocks" title="Me > Blocked Sites" />
				<DocumentHead title={ translate( 'Blocked Sites' ) } />
				<FormattedHeader brandFont headerText={ translate( 'Blocked Sites' ) } align="left" />

				<Card className="site-blocks__intro">
					<p>
						{ translate(
							'Blocked sites will not appear in your Reader and will not be recommended to you.'
						) }{ ' ' }
						<a href={ localizeUrl( 'https://wordpress.com/support/reader/#blocking-sites' ) }>
							{ translate( 'Learn more' ) }
						</a>
					</p>

					{ hasNoBlocks && (
						<p className="site-blocks__no-sites">
							{ translate( "You haven't blocked any sites yet." ) }
						</p>
					) }

					{ ! hasNoBlocks && (
						<InfiniteList
							items={ this.props.blockedSites }
							className="site-blocks__list"
							fetchNextPage={ this.fetchNextPage }
							renderLoadingPlaceholders={ this.renderPlaceholders }
							renderItem={ this.renderItem }
							fetchingNextPage={ this.props.isFetching }
							lastPage={ currentPage === lastPage }
							guessedItemHeight={ 100 }
							getItemRef={ this.getItemRef }
						/>
					) }
				</Card>
			</Main>
		);
	}
}

export default connect(
	( state ) => {
		return {
			blockedSites: getBlockedSites( state ),
			currentPage: getSiteBlocksCurrentPage( state ),
			lastPage: getSiteBlocksLastPage( state ),
			isFetching: isFetchingSiteBlocks( state ),
		};
	},
	{ requestSiteBlocks }
)( localize( SiteBlockList ) );

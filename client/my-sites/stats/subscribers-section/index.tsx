import UplotChart from '@automattic/components/src/chart-uplot';
import { useTranslate } from 'i18n-calypso';
import { useEffect, useRef, useState } from 'react';
import { UseQueryResult } from 'react-query';
import useSubscribersQuery from 'calypso/my-sites/stats/hooks/use-subscribers-query';
import StatsModulePlaceholder from '../stats-module/placeholder';
import type uPlot from 'uplot';

import './style.scss';

interface SubscribersData {
	period: string;
	subscribers: number;
	subscribers_change: number;
}

interface SubscribersDataResult {
	data: SubscribersData[];
}

// New Subscriber Stats
function transformData( data: SubscribersData[] ): uPlot.AlignedData {
	// Transform the data into the format required by uPlot.
	//
	// Note that the incoming data is ordered ascending (newest to oldest)
	// but uPlot expects descending in its deafult configuration.
	const x: number[] = data.map( ( point ) => Number( new Date( point.period ) ) / 1000 ).reverse();
	const y: number[] = data.map( ( point ) => Number( point.subscribers ) ).reverse();

	return [ x, y ];
}

export default function SubscribersSection( {
	siteId,
	siteSlug,
}: {
	siteId: string;
	siteSlug: string;
} ) {
	const period = 'month';
	const quantity = 30;
	const {
		isLoading,
		isError,
		data,
		// error,
		status,
	}: UseQueryResult< SubscribersDataResult > = useSubscribersQuery( siteId, period, quantity );
	const [ errorMessage, setErrorMessage ] = useState( '' );
	const legendRef = useRef< HTMLDivElement >( null );
	const translate = useTranslate();

	useEffect( () => {
		if ( isError ) {
			setErrorMessage( 'There was an error!' ); //TODO: check if error has a `message` property and how to handle `error`'s type
		}
	}, [ status, isError ] );

	const chartData = transformData( data?.data || [] );

	return (
		<div className="subscribers-section">
			{ /* TODO: Remove highlight-cards class and use a highlight cards heading component instead. */ }
			<div className="subscribers-section-heading highlight-cards">
				<h1 className="highlight-cards-heading">
					{ translate( 'Subscribers' ) }{ ' ' }
					<small>
						<a
							className="highlight-cards-heading-wrapper"
							href={ '/people/subscribers/' + siteSlug }
						>
							{ translate( 'View all subscribers' ) }
						</a>
					</small>
				</h1>
				<div className="subscribers-section-legend" ref={ legendRef }></div>
			</div>
			{ isLoading && <StatsModulePlaceholder className="is-chart" isLoading /> }
			{ ! isLoading && chartData.length === 0 && (
				<p className="subscribers-section__no-data">
					{ translate( 'No data availble for the specified period.' ) }
				</p>
			) }
			{ errorMessage && <div>Error: { errorMessage }</div> }
			{ ! isLoading && chartData.length !== 0 && (
				<UplotChart data={ chartData } legendContainer={ legendRef } />
			) }
		</div>
	);
}

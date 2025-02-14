import { PatternRenderer } from '@automattic/block-renderer';
import { Button } from '@automattic/components';
import classnames from 'classnames';
import { useEffect, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import EmptyPattern from './empty-pattern';
import { encodePatternId } from './utils';
import type { Pattern } from './types';
import './pattern-list-renderer.scss';

interface PatternListItemProps {
	pattern: Pattern;
	className: string;
	isFirst: boolean;
	isShown: boolean;
	onSelect: ( selectedPattern: Pattern | null ) => void;
}

interface PatternListRendererProps {
	patterns: Pattern[];
	shownPatterns: Pattern[];
	selectedPattern: Pattern | null;
	activeClassName: string;
	emptyPatternText?: string;
	onSelect: ( selectedPattern: Pattern | null ) => void;
}

const PLACEHOLDER_HEIGHT = 100;
const MAX_HEIGHT_FOR_100VH = 500;

const PatternListItem = ( {
	pattern,
	className,
	isFirst,
	isShown,
	onSelect,
}: PatternListItemProps ) => {
	const ref = useRef< HTMLButtonElement >();
	const { ref: inViewRef, inView: inViewOnce } = useInView( {
		triggerOnce: true,
	} );

	const setRefs = useCallback(
		( node?: Element | null | undefined ) => {
			if ( node ) {
				ref.current;
			}
			inViewRef( node );
		},
		[ inViewRef ]
	);

	useEffect( () => {
		if ( isShown && isFirst && ref.current ) {
			ref.current.focus();
		}
	}, [ isShown, isFirst, ref ] );

	return (
		<Button
			className={ className }
			title={ pattern.title }
			ref={ setRefs }
			onClick={ () => onSelect( pattern ) }
		>
			{ isShown && inViewOnce ? (
				<PatternRenderer
					key={ pattern.ID }
					patternId={ encodePatternId( pattern.ID ) }
					viewportWidth={ 1060 }
					minHeight={ PLACEHOLDER_HEIGHT }
					maxHeightFor100vh={ MAX_HEIGHT_FOR_100VH }
				/>
			) : (
				<div key={ pattern.ID } style={ { height: PLACEHOLDER_HEIGHT } } />
			) }
		</Button>
	);
};

const PatternListRenderer = ( {
	patterns,
	shownPatterns,
	selectedPattern,
	activeClassName,
	emptyPatternText,
	onSelect,
}: PatternListRendererProps ) => {
	return (
		<>
			{ emptyPatternText && (
				<EmptyPattern
					className={ classnames( 'pattern-list-renderer__pattern-list-item', {
						[ activeClassName ]: ! selectedPattern,
					} ) }
					text={ emptyPatternText }
					onSelect={ () => onSelect( null ) }
				/>
			) }
			{ patterns?.map( ( pattern, index ) => (
				<PatternListItem
					key={ `${ index }-${ pattern.ID }` }
					pattern={ pattern }
					className={ classnames( 'pattern-list-renderer__pattern-list-item', {
						[ activeClassName ]: pattern.ID === selectedPattern?.ID,
					} ) }
					isFirst={ index === 0 }
					isShown={ shownPatterns.includes( pattern ) }
					onSelect={ onSelect }
				/>
			) ) }
		</>
	);
};

export default PatternListRenderer;

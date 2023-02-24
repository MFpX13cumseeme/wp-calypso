import { isEnabled } from '@automattic/calypso-config';
import { useTranslate } from 'i18n-calypso';
import NavigatorHeader from './navigator-header';
import PatternSelector from './pattern-selector';
import { useFooterPatterns } from './patterns-data';
import type { Pattern } from './types';

interface Props {
	selectedPattern: Pattern | null;
	onSelect: ( selectedPattern: Pattern ) => void;
	onBack: () => void;
	onDoneClick: () => void;
}

const ScreenFooter = ( { selectedPattern, onSelect, onBack, onDoneClick }: Props ) => {
	const translate = useTranslate();
	const patterns = useFooterPatterns();
	const isSidebarRevampEnabled = isEnabled( 'pattern-assembler/sidebar-revamp' );

	return (
		<>
			{ isSidebarRevampEnabled && (
				<NavigatorHeader
					title={ translate( 'Choose a footer' ) }
					description={ translate(
						'Your footer will be added to all pages and can be used to show information or links that will help visitors take the next step.'
					) }
				/>
			) }
			<div className="screen-container__body">
				<PatternSelector
					title={ ! isSidebarRevampEnabled ? translate( 'Add a footer' ) : undefined }
					patterns={ patterns }
					onSelect={ onSelect }
					onBack={ onBack }
					onDoneClick={ onDoneClick }
					selectedPattern={ selectedPattern }
					emptyPatternText={ isSidebarRevampEnabled ? translate( 'No Footer' ) : undefined }
				/>
			</div>
		</>
	);
};

export default ScreenFooter;
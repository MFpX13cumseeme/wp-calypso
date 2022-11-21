import { useBlockProps } from '@wordpress/block-editor';
import { SupportPageBlockAttributes } from './block';
import { SupportPageEmbed } from './support-page-embed';

/**
 * Convert block attributes to HTML representation for storing in the post content
 */
export const Save = ( props: { attributes: SupportPageBlockAttributes } ) => {
	const blockProps = useBlockProps.save();
	const { attributes } = props;

	return (
		<div { ...blockProps }>
			<SupportPageEmbed attributes={ attributes } clickable />
		</div>
	);
};
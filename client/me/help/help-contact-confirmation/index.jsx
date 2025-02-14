import { Gridicon } from '@automattic/components';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import FormSectionHeading from 'calypso/components/forms/form-section-heading';

import './style.scss';

export default class extends PureComponent {
	static displayName = 'HelpContactConfirmation';

	static propTypes = {
		title: PropTypes.string.isRequired,
		message: PropTypes.node.isRequired,
	};

	render() {
		/* eslint-disable wpcalypso/jsx-gridicon-size */
		return (
			<div className="help-contact-confirmation">
				<div className="help-contact-confirmation__contents">
					<div className="help-contact-confirmation__large-gridicon">
						<Gridicon icon="checkmark-circle" size={ 96 } />
					</div>
					<div className="help-contact-confirmation__small-gridicon">
						<Gridicon icon="checkmark-circle" size={ 56 } />
					</div>
					<FormSectionHeading>{ this.props.title }</FormSectionHeading>
					<p className="help-contact-confirmation__message">{ this.props.message }</p>
				</div>
			</div>
		);
	}
}

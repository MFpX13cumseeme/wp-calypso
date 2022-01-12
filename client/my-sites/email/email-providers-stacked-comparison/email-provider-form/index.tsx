import { Button, Gridicon } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import { Fragment, FunctionComponent, ReactNode } from 'react';
import {
	newUser,
	GSuiteNewUser as NewUser,
	sanitizeEmail,
	validateUsers,
} from 'calypso/lib/gsuite/new-users';
import EmailProviderSingleUser, {
	EmailProviderFormField,
} from 'calypso/my-sites/email/email-providers-stacked-comparison/email-provider-form/email-provider-single-user';
import type { SiteDomain } from 'calypso/state/sites/domains/types';

import './style.scss';

interface Props {
	autoFocus?: boolean;
	children?: ReactNode;
	domains?: ( SiteDomain | undefined )[];
	hiddenFields?: EmailProviderFormField[];
	extraValidation: ( user: NewUser ) => NewUser;
	selectedDomainName: string;
	showAddAnotherMailboxButton?: boolean;
	onUsersChange: ( users: NewUser[] ) => void;
	onReturnKeyPress: ( event: Event ) => void;
	users: NewUser[];
}

const EmailProviderForm: FunctionComponent< Props > = ( {
	autoFocus = false,
	children,
	domains,
	hiddenFields,
	extraValidation,
	onUsersChange,
	onReturnKeyPress,
	selectedDomainName,
	showAddAnotherMailboxButton = true,
	users,
} ) => {
	const translate = useTranslate();

	const onUserValueChange = ( uuid: string ) => (
		fieldName: string,
		fieldValue: string,
		mailBoxFieldTouched = false
	) => {
		const changedUsers = users.map( ( user ) => {
			if ( user.uuid !== uuid ) {
				return user;
			}

			const changedUser = { ...user, [ fieldName ]: { value: fieldValue, error: null } };

			if ( 'firstName' === fieldName && ! mailBoxFieldTouched ) {
				return { ...changedUser, mailBox: { value: sanitizeEmail( fieldValue ), error: null } };
			}

			return changedUser;
		} );

		onUsersChange( validateUsers( changedUsers, extraValidation ) );
	};

	const onUserAdd = () => {
		onUsersChange( [ ...users, newUser( selectedDomainName ) ] );
	};

	const onUserRemove = ( uuid: string ) => () => {
		const newUserList = users.filter( ( _user ) => _user.uuid !== uuid );

		onUsersChange( 0 < newUserList.length ? newUserList : [ newUser( selectedDomainName ) ] );
	};

	return (
		<div>
			{ users.map( ( user, index ) => (
				<Fragment key={ user.uuid }>
					<EmailProviderSingleUser
						autoFocus={ autoFocus } // eslint-disable-line jsx-a11y/no-autofocus
						domains={
							domains ? domains.map( ( domain ) => domain?.name ?? '' ) : [ selectedDomainName ]
						}
						hiddenFields={ hiddenFields }
						user={ user }
						onUserValueChange={ onUserValueChange( user.uuid ) }
						onUserRemove={ onUserRemove( user.uuid ) }
						onReturnKeyPress={ onReturnKeyPress }
						selectedDomainName={ selectedDomainName }
						showTrashButton={ index > 0 }
					/>

					<hr className="email-provider-form__user-divider" />
				</Fragment>
			) ) }

			<div className="email-provider-form__actions">
				{ showAddAnotherMailboxButton && (
					<Button className="email-provider-form__add-another-user-button" onClick={ onUserAdd }>
						<Gridicon icon="plus" />
						<span>{ translate( 'Add another mailbox' ) }</span>
					</Button>
				) }

				{ children }
			</div>
		</div>
	);
};

export default EmailProviderForm;
